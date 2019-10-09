import React from "react";

import CollapsibleTable from "./CollapsibleTable";

export function handleVal(val) {
  if (typeof val === "object") {
    if (Array.isArray(val)) {
      return val.map(item => handleVal(item));
    } else {
      // if object, but no keys, don't render anything
      if (Object.entries(val).length === 0) {
        return "";
      }
      return <CollapsibleTable val={val}/>
    }
  } else {
    return val;
  }
}
