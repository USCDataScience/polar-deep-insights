import React from "react";

import { Button, H1 } from "@blueprintjs/core";

import { Col, Container, Row } from "react-grid-system";

export default function ResultView(props) {
  return (
    <Container>
      <Row>
        <Col xs={9}>
          <Button
            style={{ marginBottom: "15px" }}
            onClick={() => props.history.goBack()}
          >
            Back
          </Button>
          <H1>{props.location.state.result.metadata.title}</H1>

          <pre style={{ overflow: "scroll", marginTop: "20px" }}>
            {JSON.stringify(props.location.state.result, null, 2)}
          </pre>
        </Col>
      </Row>
    </Container>
  );
}
