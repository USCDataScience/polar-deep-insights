import React, { Component } from "react";
import { FullSearch } from "@iec1761/superfacetsearchview-er";
import ItemCard from "./ItemCard";

class FacetView extends Component {
  GetSearchCards() {
    return [
      {
        display_name: "Dates",
        field: "dates.name",
        nested_field: "dates"
      },
      {
        display_name: "Dates Occurance Count",
        field: "people-occuranceCount"
      },
      {
        display_name: "Dates Type Count",
        field: "dates-typeCount"
      },
      {
        display_name: "Entities",
        field: "entities.name.raw",
        nested_field: "entities"
      },
      {
        display_name: "Entities Occurance Count",
        field: "entities-occuranceCount"
      },
      {
        display_name: "Entities Type Count",
        field: "entities-typeCount"
      },
      {
        display_name: "Geo Latitude", // range field
        field: "geo.lat"
        // nested_field: "geo",
      },
      {
        display_name: "Locations",
        field: "locations.rawText.raw",
        nested_field: "locations"
      },
      {
        display_name: "Locations Occurance Count",
        field: "locations-occuranceCount"
      },
      {
        display_name: "Locations Type Count",
        field: "locations-typeCount"
      },
      {
        display_name: "Mime Type",
        field: "mime-type"
      },
      {
        display_name: "Money Occurance Count",
        field: "money-occuranceCount"
      },
      {
        display_name: "Money",
        field: "money.name",
        nested_field: "money"
      },
      {
        display_name: "Money Type Count",
        field: "money-typeCount"
      },
      {
        display_name: "Organizations",
        field: "organizations.name.raw",
        nested_field: "organizations"
      },
      {
        display_name: "Organizations Occurance Count",
        field: "organizations-occuranceCount"
      },
      {
        display_name: "Organizations Type Count",
        field: "organizations-typeCount"
      },
      {
        display_name: "People",
        field: "people.name.raw",
        nested_field: "people"
      },
      {
        display_name: "People Occurance Count",
        field: "people-occuranceCount"
      },
      {
        display_name: "People Type Count",
        field: "people-typeCount"
      },
      {
        display_name: "Percentages",
        field: "percentages.name.raw",
        nested_field: "percentages"
      },
      {
        display_name: "Percentages Occurance Count",
        field: "percentages-occuranceCount"
      },
      {
        display_name: "Percentages Type Count",
        field: "percentages-typeCount"
      },
      {
        display_name: "Places",
        field: "places.name.raw",
        nested_field: "places"
      },
      {
        display_name: "Places Occurance Count",
        field: "places-occuranceCount"
      },
      {
        display_name: "Places Type Count",
        field: "places-typeCount"
      },
      {
        display_name: "Time",
        field: "time.name.raw",
        nested_field: "time"
      },
      {
        display_name: "Time Occurance Count",
        field: "time-occuranceCount"
      },
      {
        display_name: "Time Type Count",
        field: "time-typeCount"
      }
    ];
  }

  render() {
    return (
      <div className="FacetView">
        <FullSearch
          credentials="elastic"
          app="pdi-trec-dd-pdf"
          elasticsearchUrl="http://polar.usc.edu/elasticsearch"
          dataField={["metadata.title", "metadata.Author"]}
          nestedField={"metadata"}
          resultItem={resultItem => {
            // return <Card>{JSON.stringify(res, null, 2)}</Card>;
            return <ItemCard result={resultItem} />;
          }}
          searchCards={this.GetSearchCards()}
        />
      </div>
    );
  }
}

export default FacetView;
