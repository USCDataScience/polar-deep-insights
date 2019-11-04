import React, { Component } from "react";

import { BrowserRouter, Route } from "react-router-dom";

import FacetView from "./FacetView";
import Header from "./Header";
import ResultView from "./ResultView";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "normalize.css";
import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/pdi/facetview">
        <Header />
        <Route exact path="/" component={FacetView} />
        <Route path="/result" component={ResultView} />
      </BrowserRouter>
    );
  }
}

export default App;
