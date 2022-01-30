using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Entities;
using System;
using Application.Activities;
using System.Threading;

namespace API.Controllers
{
    public class ActivitiesController: BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken cancellationToken) 
        {
            return await Mediator.Send(new List.Query(), cancellationToken);
        }

        [HttpGet("{id}")] // activities/id
        public async Task<ActionResult<Activity>> GetActivity(Guid id, CancellationToken cancellationToken) 
        {
            return await Mediator.Send(new Details.Query{ Id = id}, cancellationToken);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken cancellationToken)
        {
            return Ok(await Mediator.Send(new Create.Command { Activity = activity }, cancellationToken));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivities(Guid id, Activity activity, CancellationToken cancellationToken)
        {
            activity.Id = id;
            return Ok(await Mediator.Send(new Edit.Command {Activity = activity}, cancellationToken));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id, CancellationToken cancellationToken) 
        {
            return Ok(await Mediator.Send(new Delete.Command { Id = id }, cancellationToken));
        }
    }
}