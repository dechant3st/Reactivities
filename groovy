#!/usr/bin/env groovy
// Simple Groovy script to build Podman images for backend and frontend and optionally run containers
// Usage: groovy create-podman-image.groovy [--run] [--branch BRANCH]
// Requires: git, podman, dotnet, npm available in PATH.

def runCmd(cmd, failOnError = true) {
    println ">> ${cmd}"
    def p = cmd.execute(null, new File('.'))
    p.in.eachLine { println it }
    p.err.eachLine { System.err.println it }
    p.waitFor()
    if (failOnError && p.exitValue() != 0) {
        throw new RuntimeException("Command failed: ${cmd}")
    }
    return p.exitValue()
}

def argsMap = [:]
def runContainers = false
def i = 0
// Use a safe lookup for 'args' so the script works in Jenkins pipeline (binding may not expose 'args')
def cliArgsList = []
if (binding?.hasVariable('args')) {
    def a = binding.getVariable('args')
    if (a instanceof List) {
        cliArgsList = a
    } else if (a != null) {
        cliArgsList = a.toString().split('\\s+') as List
    }
}
while (i < cliArgsList.size()) {
    switch(cliArgsList[i]) {
        case '--run':
            runContainers = true; i++; break
        case '--branch':
            argsMap.branch = (i+1 < cliArgsList.size()) ? cliArgsList[i+1] : null; i += 2; break
        default:
            i++
    }
}

// determine branch
// replaced System.getenv usage with a binding-safe lookup of the pipeline 'env' map
def envMap = [:]
if (binding?.hasVariable('env')) {
    def e = binding.getVariable('env')
    if (e instanceof Map) {
        envMap = e
    } else if (e != null) {
        try { envMap = e as Map } catch (Exception ignored) { envMap = [:] }
    }
}

def branch = argsMap.branch ?: envMap['BRANCH'] ?: envMap['GIT_BRANCH']
if (!branch) {
    try {
        def proc = "git rev-parse --abbrev-ref HEAD".execute()
        def out = proc.text.trim()
        if (out) branch = out
    } catch (Ignored) { /* ignore */ }
}
if (!branch) {
    println "No branch detected; defaulting to 'dev'"
    branch = 'dev'
}
println "Detected branch: ${branch}"

def envName
def tag
def networkName
switch(branch.toLowerCase()) {
    case 'prod':
    case 'production':
        envName = 'Production'
        tag = 'prod'
        networkName = 'prod-net'
        break
    case 'staging':
        envName = 'Staging'
        tag = 'staging'
        networkName = 'staging-net'
        break
    default:
        envName = 'Development'
        tag = 'dev'
        networkName = 'dev-net'
}

println "Environment: ${envName}  Tag: ${tag}  Network: ${networkName}"

// Paths - adjust if your project layout differs
def backendDir = 'src'             // path to .NET project
def frontendDir = 'client-app'     // path to React project

// Build backend
println "\n--- Building backend (.NET) ---"
runCmd("dotnet publish ${backendDir} -c Release -o ${backendDir}/publish")

// Build backend image (assumes Dockerfile exists at src/Dockerfile)
def backendImage = "your-dotnet-image:${tag}"
runCmd("podman build -f ${backendDir}/Dockerfile -t ${backendImage} ${backendDir}")

// Build frontend
println "\n--- Building frontend (React) ---"
runCmd("npm --prefix ${frontendDir} install")
runCmd("npm --prefix ${frontendDir} run build")

// Build frontend image (assumes Dockerfile at client-app/Dockerfile that uses build output)
def frontendImage = "your-react-image:${tag}"
runCmd("podman build -f ${frontendDir}/Dockerfile -t ${frontendImage} ${frontendDir}")

println "\nImages built: ${backendImage}, ${frontendImage}"

// Optionally run containers
if (runContainers) {
    println "\n--- Running containers on network ${networkName} ---"
    // ensure network exists
    def networks = new ByteArrayOutputStream()
    "podman network ls --format json".execute() | networks
    if (!(networks.toString().contains(networkName))) {
        runCmd("podman network create ${networkName}")
    }

    if (tag == 'prod') {
        // remove existing if present
        runCmd("podman rm -f api-prod || true", false)
        runCmd("podman rm -f web-prod || true", false)
        runCmd("podman run -d --name api-prod --network ${networkName} -e ASPNETCORE_ENVIRONMENT=${envName} -p 8001:8080 ${backendImage}")
        runCmd("podman run -d --name web-prod --network ${networkName} -p 8000:80 ${frontendImage}")
    } else if (tag == 'staging') {
        runCmd("podman rm -f api-staging || true", false)
        runCmd("podman rm -f web-staging || true", false)
        runCmd("podman run -d --name api-staging --network ${networkName} -e ASPNETCORE_ENVIRONMENT=${envName} -p 5001:8080 ${backendImage}")
        runCmd("podman run -d --name web-staging --network ${networkName} -p 5000:80 ${frontendImage}")
    } else {
        println "Dev tag: not automatically running containers. Use --run with prod or staging branches."
    }
}

println "\nDone."