import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestErrors";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

export default function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route
          path="/"
          element={
            <Container style={{ marginTop: "7em" }}>
              <NavBar />
              <Outlet />
            </Container>
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
          <Route path="errors" element={<TestErrors />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
