import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

function App() {
  const location = useLocation();

  return (
    <>
      <Container style={{ marginTop: "7em" }}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <Outlet />
              </>
            }
          >
            <Route path="activities" element={<ActivityDashboard />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route
              path={"createActivity"}
              element={<ActivityForm key={location.key} />}
            />
            <Route
              path={"manage/:id"}
              element={<ActivityForm key={location.key} />}
            />
            <Route path="activities" element={<ActivityDashboard />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route
              path={"createActivity"}
              element={<ActivityForm key={location.key} />}
            />
            <Route
              path={"manage/:id"}
              element={<ActivityForm key={location.key} />}
            />
          </Route>
        </Routes>
      </Container>
    </>
  );
}

export default observer(App);
