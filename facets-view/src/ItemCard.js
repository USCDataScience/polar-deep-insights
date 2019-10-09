import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Collapse, HTMLTable } from "@blueprintjs/core";
import { handleVal } from "./utils";

export default function ItemCard(props) {
  const [otherFieldsIsOpen, setOtherFieldsIsOpen] = useState(false);
  const [metadataIsOpen, setMetadataIsOpen] = useState(false);

  function toggleExpandOtherFields() {
    setOtherFieldsIsOpen(!otherFieldsIsOpen);
  }

  function toggleMetadataFields() {
    setMetadataIsOpen(!metadataIsOpen);
  }

  const { metadata: resultMetadata, ...resultWithoutMetadata } = props.result;
  return (
    <Card style={{ margin: "20px 0" }}>
      <h3>
        <Link to={{ pathname: "/result", state: { result: props.result } }}>
          {resultMetadata
            ? resultMetadata.title
              ? resultMetadata.title
              : <i>Document Title Missing</i>
            : "no metadata"}
        </Link>
      </h3>
      <Button onClick={toggleMetadataFields}>
        {metadataIsOpen ? "Collapse Metadata" : "Expand for Metadata"}
      </Button>
      {/* <p>Metadata Fields:</p> */}
      {/* <pre style={{overflow: "scroll"}}>{JSON.stringify(resultMetadata, null, 2)}</pre> */}
      <Collapse isOpen={metadataIsOpen}>
        <div style={{ overflow: "scroll" }}>
          <HTMLTable>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resultMetadata).map(keyVal => {
                // generate unique react key
                let key = keyVal[0] + keyVal[1];
                return (
                  <tr key={key}>
                    <td>
                      <b>{keyVal[0]}</b>
                    </td>
                    <td>{keyVal[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        </div>
      </Collapse>
      <Button onClick={toggleExpandOtherFields} style={{ marginTop: "10px" }}>
        {otherFieldsIsOpen
          ? "Collapse Additional Fields"
          : "Expand for Additional Fields"}
      </Button>
      <Collapse isOpen={otherFieldsIsOpen}>
        <hr style={{ marginTop: "20px" }} />
        {/* <pre style={{ height: "800px", overflow: "scroll" }}>{JSON.stringify(resultWithoutMetadata, null, 2)}</pre> */}
        <div style={{ overflow: "scroll" }}>
          <HTMLTable condensed={true} striped={true} bordered={true}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(resultWithoutMetadata).map(keyVal => {
                // generate unique react key
                let key = keyVal[0] + keyVal[1];
                return (
                  <tr key={key}>
                    <td>
                      <b>{keyVal[0]}</b>
                    </td>
                    <td>{handleVal(keyVal[1])}</td>
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        </div>
      </Collapse>
    </Card>
  );
}
