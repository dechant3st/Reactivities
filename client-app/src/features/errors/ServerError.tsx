import { observer } from "mobx-react-lite";
import React from "react";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

function ServerError() {
  const { commonStore } = useStore();

  console.log(commonStore.error);

  return (
    <Container style={{ marginTop: "5em" }}>
      <Header as="h1" content="Server Error" icon="bug" />
      <Header sub as="h5" color="red" content={commonStore.error?.message} />
      {commonStore.error?.details ? (
        <Segment>
          <Header as="h4" content="Stack trace" color="teal" />
          <code style={{ marginTop: 10 }}>{commonStore.error.details}</code>
        </Segment>
      ) : (
        <Segment>
          <Header as="h4" content="Stack trace" color="teal" />
          <code>Please contact your web adminitrator for assistance</code>
        </Segment>
      )}
    </Container>
  );
}

export default observer(ServerError);
