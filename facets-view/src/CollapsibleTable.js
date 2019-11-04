import React, { useState } from "react";
import { handleVal } from "./utils";
import { Button, Card, Collapse, HTMLTable } from "@blueprintjs/core";

export default function CollapsibleTable(props) {
  const [isCollapsed, setCollapse] = useState(false);

  function toggleCollapse() {
    setCollapse(!isCollapsed);
  }

  return (
    <div>
      {/* <Button onClick={toggleCollapse}>
        {isCollapsed ? "Collapse" : "Expand"}
      </Button>
      <Collapse isOpen={isCollapsed}> */}
      <HTMLTable
        bordered={true}
        condensed={true}
        striped={true}
        style={{ marginBottom: "20px" }}
      >
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props.val).map(keyVal => {
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
      {/* </Collapse> */}
    </div>
  );
}
