import React, { useEffect } from "react";
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
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
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
          <Route path="/erver-error" element={<ServerError />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default observer(App);
