angular.module('polar').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/scripts/components/add_filter/modal_template.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <fieldset class=\"form-group\">\n" +
    "      <select class=\"form-control\" placeholder=\"Filter Type\" data-ng-model=\"filterType\">\n" +
    "        <option value=\"\" disabled>-- Filter Type --</option>\n" +
    "        <option value=\"geo\">Geographic</option>\n" +
    "        <option value=\"time\">Date Range</option>\n" +
    "        <option value=\"concept\">Conceptual</option>\n" +
    "      </select>\n" +
    "     </fieldset>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\"\n" +
    "            type=\"button\"\n" +
    "            data-ng-click=\"ok({ type: filterType })\"\n" +
    "            data-ng-disabled=\"!filterType\">Add</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/add_filter/template.html',
    "<div>\n" +
    "  <button class=\"btn btn-primary\" data-ng-click=\"addFilter()\"><i class=\"fa fa-plus\"></i></button>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-2 col-md-offset-10\">\n" +
    "      <button class=\"btn btn-warning btn-block\" data-ng-click=\"loadData()\">Query</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "       <uib-tabset active=\"active\">\n" +
    "        <uib-tab index=\"0\" heading=\"Time Distribution\" select=\"active = 0\">\n" +
    "          <div polar-analytics-time-variance data-filters=\"filters\" data-ng-if=\"active == 0\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"1\" heading=\"Geographic Distribution\" select=\"active = 1\">\n" +
    "          <div polar-analytics-geo-distribution  data-filters=\"filters\" data-ng-if=\"active == 1\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"2\" heading=\"Concept Correlation\" select=\"active = 2\">\n" +
    "          <div polar-analytics-concept  data-filters=\"filters\" data-ng-if=\"active == 2\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"3\" heading=\"Measurement Distribution\"  select=\"active = 3\">\n" +
    "          <div polar-analytics-measurement  data-filters=\"filters\" data-ng-if=\"active == 3\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"4\" heading=\"Geographic Diversity\"  select=\"active = 4\">\n" +
    "          <div polar-analytics-geo-diversity  data-filters=\"filters\" data-ng-if=\"active == 4\"></div>\n" +
    "        </uib-tab>\n" +
    "      </uib-tabset>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/concept_editor/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"graph-container\"\n" +
    "         tg-graph\n" +
    "         graph=\"graph\"\n" +
    "         on-load=\"onGraphLoad(graph)\"\n" +
    "         edge-menu=\"edgeMenu\"\n" +
    "         node-menu=\"nodeMenu\"\n" +
    "         metadata=\"metadata\"\n" +
    "         configration=\"configration\"\n" +
    "         behavior=\"behavior\"\n" +
    "         stream=\"stream\"\n" +
    "         helpers=\"helpers\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row graph-panel\">\n" +
    "    <button class=\"btn btn-primary\" data-ng-click=\"addConcept()\">\n" +
    "      <i class=\"fa fa-plus\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <button class=\"btn btn-info\" data-ng-click=\"saveLocally()\">\n" +
    "      <i class=\"fa fa-floppy-o\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <button class=\"btn btn-warning\"  data-ng-click=\"upload()\" data-ng-disabled=\"true\">\n" +
    "      <i class=\"fa fa-cloud-upload\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <button class=\"btn btn-warning\"  data-ng-click=\"download()\">\n" +
    "      <i class=\"fa fa-cloud-download\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <button class=\"btn btn-success\" data-ng-click=\"export()\">\n" +
    "      <i class=\"fa fa-external-link\"></i>\n" +
    "    </button>\n" +
    "\n" +
    "    <button class=\"btn btn-secondary pull-right\" data-ng-click=\"helpers.fullScreen()\">\n" +
    "      <i class=\"fa fa-arrows-alt\"></i>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/edit_modal_template.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-12\">\n" +
    "        <div polar-filter-geo data-filter=\"data.filter\" data-ng-if=\"data.filter.type == 'geo'\"></div>\n" +
    "\n" +
    "        <div polar-filter-time data-filter=\"data.filter\" data-ng-if=\"data.filter.type == 'time'\"></div>\n" +
    "\n" +
    "        <div polar-filter-concept data-filter=\"data.filter\" data-ng-if=\"data.filter.type == 'concept'\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\"\n" +
    "            type=\"button\"\n" +
    "            data-ng-click=\"ok(data.filter)\">Save</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/template.html',
    "<div>\n" +
    "  <div class=\"panel\" data-ng-class=\"{\n" +
    "    'panel-success' : (filter.type == 'geo'),\n" +
    "    'panel-info' : (filter.type == 'time'),\n" +
    "    'panel-warning' : (filter.type == 'concept'),\n" +
    "  }\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "      <h3 class=\"panel-title\">\n" +
    "        <span data-ng-show=\"filter.type == 'geo'\">Geographic</span>\n" +
    "        <span data-ng-show=\"filter.type == 'time'\">Date Range</span>\n" +
    "        <span data-ng-show=\"filter.type == 'concept'\">Concept</span>\n" +
    "\n" +
    "        <span class=\"pull-right\">\n" +
    "          <button class=\"btn btn-xs btn-default\" data-ng-click=\"edit(filter)\"><i class=\"fa fa-pencil\"></i></button>\n" +
    "          &nbsp;\n" +
    "          <button class=\"btn btn-xs btn-default\" data-ng-click=\"onDelete(filter)\"><i class=\"fa fa-times\"></i></button>\n" +
    "        </span>\n" +
    "      </h3>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\">\n" +
    "      <span data-ng-show=\"filter.type == 'geo'\">\n" +
    "        <i data-ng-show=\"!filter.regions || filter.regions.length == 0\">\n" +
    "          Add filter specifications\n" +
    "        </i>\n" +
    "\n" +
    "        <span data-ng-show=\"filter.regions.length > 0\">\n" +
    "          {{ filter.regions.length }} region(s)\n" +
    "        </span>\n" +
    "      </span>\n" +
    "\n" +
    "      <span data-ng-show=\"filter.type == 'time'\">\n" +
    "        <i data-ng-show=\"!filter.timeRanges || filter.timeRanges.length == 0\">\n" +
    "          Add filter specifications\n" +
    "        </i>\n" +
    "\n" +
    "        <span data-ng-show=\"filter.timeRanges.length > 0\">\n" +
    "          {{ filter.timeRanges.length }} time range(s)\n" +
    "        </span>\n" +
    "      </span>\n" +
    "\n" +
    "      <span data-ng-show=\"filter.type == 'concept'\">\n" +
    "        <i data-ng-show=\"!filter.factory || filter.factory.concepts.length == 0\">\n" +
    "          Add filter specifications\n" +
    "        </i>\n" +
    "\n" +
    "        <span data-ng-show=\"filter.factory.concepts.length > 0\">\n" +
    "          {{ filter.factory.concepts.length }} concept(s)\n" +
    "        </span>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/flash/template.html',
    "<div>\n" +
    "  <div class=\"c-alert c-{{flashConfig.type || 'info'}}\" data-ng-if=\"(flashConfig && !closeFlash)\">\n" +
    "    <span class=\"glyphicon c-{{flashConfig.type || 'info'}}-icon\"></span>\n" +
    "    <span class=\"body\" data-ng-bind=\"flashConfig.message\"></span>\n" +
    "    <button type=\"button\" class=\"close\" data-ng-click=\"close()\" aria-hidden=\"true\">&times;</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/footer/template.html',
    "<div class=\"footer\">\n" +
    "  <p class=\"pull-right\">\n" +
    "    <span class=\"glyphicon glyphicon-heart\"></span> from <a href=\"http://irds.usc.edu\" target=\"_blank\">IRDS.USC.EDU</a>\n" +
    "  </p>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/navigation/template.html',
    "<nav class=\"navbar navbar-default\">\n" +
    "  <div class=\"container\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbarLinks\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "      <a class=\"navbar-brand\" href=\"/\">Polar Deep Insights</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"collapse navbar-collapse navbar-collapse\" id=\"navbarLinks\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "\n" +
    "      </ul>\n" +
    "\n" +
    "\n" +
    "      <ul class=\"nav navbar-nav navbar-right\">\n" +
    "        <li data-ng-class=\"$location.path() == '/concept_editor' ? 'active' : '' \"><a href=\"#/concept_editor\">Concept Editor</a></li>\n" +
    "\n" +
    "        <li data-ng-class=\"$location.path() == '/query' ? 'active' : '' \"><a href=\"#/query\">Query Interface</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</nav>\n"
  );


  $templateCache.put('app/scripts/components/analytics/concept/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"graph-container\"\n" +
    "           tg-graph\n" +
    "           graph=\"graph\"\n" +
    "           on-load=\"onGraphLoad(graph)\"\n" +
    "           edge-menu=\"edgeMenu\"\n" +
    "           node-menu=\"nodeMenu\"\n" +
    "           metadata=\"{}\"\n" +
    "           configration=\"{}\"\n" +
    "           behavior=\"{}\"\n" +
    "           stream=\"stream\"\n" +
    "           helpers=\"{}\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"tag-cloud\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/geo_distribution/template.html',
    "<div>\n" +
    "  <div class=\"row\" data-ng-init=\"slider = { 'value': 100 }\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <rzslider rz-slider-model=\"slider.value\"\n" +
    "                rz-slider-options=\"{ 'floor': 1, 'ceil': 250 }\"></rzslider>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" class=\"idf-location-cont\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"idf-location\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/geo_diversity/template.html',
    "<div>\n" +
    "  <div class=\"row\" class=\"idf-location-cont\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <leaflet lf-center=\"center\"  layers=\"layers\"  markers=\"map.markers\" event-broadcast=\"events\" height=\"680px\" width=\"100%\"></leaflet>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/measurement/hist_modal_template.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div polar-analytics-measurement-histogram data-unit=\"data.unit\" data-filters=\"data.filters\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\"\n" +
    "            data-ng-click=\"ok()\"\n" +
    "            type=\"button\">Close</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/measurement/hist_template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/measurement/template.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <table class=\"table table-striped table-bordered\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Unit</th>\n" +
    "            <th>Type</th>\n" +
    "            <th>Count</th>\n" +
    "            <th>Average</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"d in data\">\n" +
    "            <td><a data-ng-bind=\"d.unit\" data-ng-click=\"openHistogram(d.unit)\"></a></td>\n" +
    "            <td data-ng-bind=\"d.type\"></td>\n" +
    "            <td data-ng-bind=\"d.count\"></td>\n" +
    "            <td data-ng-bind=\"d.avg | number:2\"></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/time_variance/template.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <rzslider rz-slider-model=\"r.min\"\n" +
    "                rz-slider-high=\"r.max\"\n" +
    "                rz-slider-options=\"{ 'floor': 1900, 'ceil': 2050, 'step': 1 }\"></rzslider>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/concept_editor/concept/modal_template.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div polar-concept-box data-concept=\"data.concept\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\"\n" +
    "            type=\"button\"\n" +
    "            ng-click=\"ok(data.concept)\"\n" +
    "            data-ng-disabled=\"!data.concept.isValid()\">Save</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/concept_editor/concept/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "       <fieldset class=\"form-group\">\n" +
    "        <input class=\"form-control\" placeholder=\"Concept Name\" data-ng-model=\"concept.name\">\n" +
    "       </fieldset>\n" +
    "\n" +
    "       <fieldset class=\"form-group\">\n" +
    "        <select class=\"form-control\" placeholder=\"Concept Type\" data-ng-model=\"concept.type\">\n" +
    "          <option value=\"\" disabled>-- Concept Type --</option>\n" +
    "          <option value=\"meta\">High Level</option>\n" +
    "          <option value=\"basic\">Low Level</option>\n" +
    "        </select>\n" +
    "       </fieldset>\n" +
    "\n" +
    "       <fieldset class=\"form-group\">\n" +
    "        <tags-input data-ng-model=\"concept.alias\"\n" +
    "                    data-min-length=\"1\"\n" +
    "                    replace-spaces-with-dashes=\"false\"></tags-input>\n" +
    "       </fieldset>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/concept_editor/export/modal_template.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div polar-concept-export data-factory=\"data.factory\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\"\n" +
    "            type=\"button\"\n" +
    "            ng-click=\"ok()\">Close</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/concept_editor/export/template.html',
    "<div>{{ factory.getConceptNames().join('|') }}</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/concept/search_template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-10\">\n" +
    "      <tags-input ng-model=\"sC\"\n" +
    "                  replace-spaces-with-dashes=\"false\"\n" +
    "                  data-add-from-autocomplete-only=\"true\"\n" +
    "                  placeholder=\"Search for a concept ..\">\n" +
    "        <auto-complete source=\"filterConcepts($query)\"></auto-complete>\n" +
    "      </tags-input>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <button class=\"btn btn-primary btn-block\" data-ng-click=\"helpers.onConceptAdd(sC); sC=[]\">Add</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/concept/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div polar-filter-concept-search data-helpers=\"helpers\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"graph-container\"\n" +
    "           tg-graph\n" +
    "           graph=\"graph\"\n" +
    "           on-load=\"onGraphLoad(graph)\"\n" +
    "           edge-menu=\"edgeMenu\"\n" +
    "           node-menu=\"nodeMenu\"\n" +
    "           metadata=\"{}\"\n" +
    "           configration=\"{}\"\n" +
    "           behavior=\"{}\"\n" +
    "           stream=\"stream\"\n" +
    "           helpers=\"{}\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/geo/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-9\">\n" +
    "      <leaflet lf-center=\"map.center\"\n" +
    "           lf-draw=\"map.drawOptions\" height=\"480px\" width=\"100%\">\n" +
    "      </leaflet>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\" style=\"height: 480px; overflow-y:scroll;\">\n" +
    "      <p data-ng-show=\"filter.regions.length == 0\">\n" +
    "        <i>Draw a geographic bound</i>\n" +
    "      </p>\n" +
    "      <table class=\"table table-striped\" data-ng-show=\"filter.regions.length > 0\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Regions</th>\n" +
    "            <th>Coordinates</th>\n" +
    "            <th></th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"r in filter.regions\">\n" +
    "            <td data-ng-bind=\"r.name\"></td>\n" +
    "            <td>\n" +
    "              <div data-ng-repeat=\"c in r.coords\" data-ng-bind=\"c\"></div>\n" +
    "            </td>\n" +
    "            <td class=\"cursor text-danger\" data-ng-click=\"removeRegion($index)\"><i class=\"fa fa-times\"></i></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/time/template.html',
    "<div>\n" +
    "  <div class=\"row\" data-ng-repeat=\"r in filter.timeRanges\">\n" +
    "    <div class=\"col-md-11\">\n" +
    "      <rzslider rz-slider-model=\"r.min\"\n" +
    "              rz-slider-high=\"r.max\"\n" +
    "              rz-slider-options=\"{ 'floor': 1900, 'ceil': 2050, 'step': 1 }\"></rzslider>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-1 text-center\">\n" +
    "      <button class=\"btn btn-danger btn-xs\" data-ng-click=\"filter.timeRanges.splice($index, 1)\" style=\"margin-top:25px;\">\n" +
    "        <i class=\"fa fa-times\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"addRange()\">\n" +
    "        Add Filter &nbsp;<i class=\"fa fa-plus\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/graph/aside/template.html',
    "<div class=\"aside\" data-ng-class=\"show ? 'show' : ''\" style=\"z-index: 10000;\">\n" +
    "  <div class=\"aside-header\">\n" +
    "    <button class=\"close\" ng-click=\"close()\" type=\"button\">×</button>\n" +
    "    <h5 class=\"aside-title\" data-ng-bind=\"element.id\"></h5>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <ul class=\"nav nav-pills nav-justified nav-pills-aside\">\n" +
    "      <li class=\"active\"><a href=\"#\"><i class=\"fa fa-bars\"></i></a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <h5 class=\"text-center title-tab\">\n" +
    "      Properties\n" +
    "    </h5>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row aside-form\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <form class=\"form-horizontal\">\n" +
    "\n" +
    "        <div class=\"form-group element-fields\"\n" +
    "             data-ng-show=\"element.isVertex || element.isEdge\"\n" +
    "             data-ng-repeat=\"(key, value) in element.toJSON()\">\n" +
    "          <label class=\"col-md-6 control-label\" data-ng-bind=\"key\"></label>\n" +
    "          <div class=\"col-md-6\">\n" +
    "            <p class=\"form-control-static\" data-ng-bind=\"value\"></p>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/concept_editor.html',
    "<div class=\"container\">\n" +
    "  <div polar-concept-editor></div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/query.html',
    "<div>\n" +
    "  <div class=\"row\" data-ng-init=\"filters = []\" style=\"min-height: 105px;\">\n" +
    "    <div class=\"col-md-11\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-3\" data-ng-repeat=\"f in filters\">\n" +
    "          <div polar-filter data-filter=\"f\" data-on-delete=\"filters.splice($index, 1)\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-1 text-center\">\n" +
    "      <div polar-add-filter data-filters=\"filters\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div polar-analytics data-filters=\"filters\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/util/templates/alert.html',
    "<div>\n" +
    "  <div class=\"modal-body\" data-ng-if=\"data.head\">\n" +
    "    {{ data.head }}\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-body\">\n" +
    "    {{ data.message }}\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\" type=\"button\" ng-click=\"ok()\">Ok</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/util/templates/dialog.html',
    "<div>\n" +
    "  <div class=\"modal-body\" data-ng-if=\"data.head\">\n" +
    "    {{ data.head }}\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-body\">\n" +
    "    {{ data.message }}\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-info\" type=\"button\" ng-click=\"ok()\">Ok</button>\n" +
    "    <button class=\"btn btn-danger\" type=\"button\" ng-click=\"cancel()\">Cancel</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/util/templates/global_loader.html',
    "<div>\n" +
    "  <div class=\"c-global-loader\" data-ng-if=\"loaderConfig\">\n" +
    "    <span data-ng-bind=\"loaderConfig.message\"></span>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
