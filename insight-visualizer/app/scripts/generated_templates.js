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
    "        <option value=\"measurement\">Measurement</option>\n" +
    "        <option value=\"entity\">Entity</option>\n" +
    "        <option value=\"docType\">File Type</option>\n" +
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
    "<button class=\"btn btn-primary\" data-ng-click=\"addFilter()\"><i class=\"fa fa-plus\"></i></button>\n"
  );


  $templateCache.put('app/scripts/components/analytics/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-2 col-md-offset-10\">\n" +
    "      <div class=\"pull-right\">\n" +
    "        <div polar-add-filter data-filters=\"filters\"></div>\n" +
    "        <button class=\"btn btn-info\" data-ng-click=\"filters = [ ]; loadData()\"><i class=\"fa fa-refresh\"></i></button>\n" +
    "        <button class=\"btn btn-warning\" data-ng-click=\"loadData()\"><i class=\"fa fa-search\"></i></button>\n" +
    "        <button class=\"btn btn-info\" data-ng-click=\"fullScreen()\"><i class=\"fa fa-arrows-alt\"></i></button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12 query-result\">\n" +
    "\n" +
    "       <uib-tabset active=\"active\">\n" +
    "        <uib-tab index=\"6\" heading=\"Stats\"  select=\"active = 6\">\n" +
    "          <div polar-analytics-stats  class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 6\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"0\" heading=\"Date Distribution\" select=\"active = 0\">\n" +
    "          <div polar-analytics-time-variance class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 0\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"1\" heading=\"Geographic Distribution\" select=\"active = 1\">\n" +
    "          <div polar-analytics-geo-distribution  class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 1\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"2\" heading=\"Concept Correlation\" select=\"active = 2\">\n" +
    "          <div polar-analytics-concept  class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 2\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"5\" heading=\"Popular Entities\"  select=\"active = 5\">\n" +
    "          <div polar-analytics-popular-entities  class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 5\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"3\" heading=\"Measurement Distribution\"  select=\"active = 3\">\n" +
    "          <div polar-analytics-measurement  class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 3\"></div>\n" +
    "        </uib-tab>\n" +
    "\n" +
    "        <uib-tab index=\"4\" heading=\"Regions of interest\"  select=\"active = 4\">\n" +
    "          <div polar-analytics-geo-diversity  class=\"query-result-view\" data-filters=\"filters\" data-ng-if=\"active == 4\"></div>\n" +
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
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"graph-container\"\n" +
    "           tg-graph\n" +
    "           graph=\"graph\"\n" +
    "           on-load=\"onGraphLoad(graph)\"\n" +
    "           edge-menu=\"edgeMenu\"\n" +
    "           node-menu=\"nodeMenu\"\n" +
    "           metadata=\"metadata\"\n" +
    "           configration=\"configration\"\n" +
    "           behavior=\"behavior\"\n" +
    "           stream=\"stream\"\n" +
    "           helpers=\"helpers\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"graph-panel\">\n" +
    "        <button class=\"btn btn-primary\" data-ng-click=\"addConcept()\">\n" +
    "          <i class=\"fa fa-plus\"></i>\n" +
    "        </button>\n" +
    "\n" +
    "        <button class=\"btn btn-info\" data-ng-click=\"saveLocally()\">\n" +
    "          <i class=\"fa fa-floppy-o\"></i>\n" +
    "        </button>\n" +
    "\n" +
    "        <!-- TODO: enable users to set a name while uploading -->\n" +
    "        <button class=\"btn btn-warning\"  data-ng-click=\"upload()\" data-ng-disabled=\"true\">\n" +
    "          <i class=\"fa fa-cloud-upload\"></i>\n" +
    "        </button>\n" +
    "\n" +
    "        <a href=\"#/config\" class=\"btn btn-warning\">\n" +
    "          <i class=\"fa fa-cloud-download\"></i>\n" +
    "        </a>\n" +
    "\n" +
    "        <button class=\"btn btn-success\" data-ng-click=\"export()\">\n" +
    "          <i class=\"fa fa-external-link\"></i>\n" +
    "        </button>\n" +
    "\n" +
    "        <button class=\"btn btn-secondary pull-right\" data-ng-click=\"helpers.fullScreen()\">\n" +
    "          <i class=\"fa fa-arrows-alt\"></i>\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/configuration/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>\n" +
    "        Application configuration\n" +
    "        <span class=\"badge\" data-ng-show=\"!(isConfigSet() && isOntologySet())\">Incomplete</span>\n" +
    "        <span class=\"badge\" data-ng-show=\"isConfigSet() && isOntologySet()\">Complete</span>\n" +
    "      </h3>\n" +
    "\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"loadDefault(1)\">Trec-DD-PDF</button>\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"loadDefault(2)\" data-ng-disabled=\"true\">Trec-DD-Sample</button>\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"loadDefault(3)\">NSIDC-crawl</button>\n" +
    "\n" +
    "      <hr />\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <table class=\"table\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Field</th>\n" +
    "            <th>Value</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr>\n" +
    "            <td>Elastic search endpoint</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.endpoint\" placeholder=\"http://mydomain/elasticsearch\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td>Elastic search extraction index</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.index\" placeholder=\"polar-deep-insights\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td>Elastic search extraction doc-type</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.docType\" placeholder=\"docs\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td>Elastic search measurements index</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.measurementIndex\" placeholder=\"polar-measurements\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td>Elastic search measurements doc-type</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.measurementDocType\" placeholder=\"raw-measurements\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td>Entity Count JSON path</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.entityCountPath\" placeholder=\"http://mydomain/entitiy-count.json\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td>Sweet ontology path</td>\n" +
    "            <td><input class=\"form-control\" data-ng-model=\"config.sweetOntologyPath\" placeholder=\"http://mydomain/sweet.json\" /></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr>\n" +
    "            <td colspan=\"2\">\n" +
    "              <button class=\"btn btn-success\" data-ng-click=\"saveConfig(config)\">Save</button>\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <p>\n" +
    "        A concept ontology is required for this application to function.\n" +
    "\n" +
    "        You can <a href=\"/#!/concept_editor\">create</a> your own ontology or\n" +
    "        download a predefined ontology from your elasticsearch index.\n" +
    "      </p>\n" +
    "\n" +
    "      <p>\n" +
    "        <i class=\"text-danger\" data-ng-show=\"!isOntologySet()\">\n" +
    "          A concept ontology has not been setup yet.\n" +
    "        </i>\n" +
    "      </p>\n" +
    "\n" +
    "      <button class=\"btn btn-warning\" data-ng-click=\"downloadOntology()\">Download</button>\n" +
    "\n" +
    "      <hr />\n" +
    "\n" +
    "      <p>\n" +
    "        The analytics interface requires additional precomputed information (ie)\n" +
    "        document counts per-entity.\n" +
    "      </p>\n" +
    "\n" +
    "      <p>\n" +
    "        <i class=\"text-danger\" data-ng-show=\"!entityCountSet\">\n" +
    "          This has not been setup yet\n" +
    "        </i>\n" +
    "      </p>\n" +
    "\n" +
    "      <button class=\"btn btn-info\" data-ng-click=\"downloadEntityCount()\" data-ng-disabled=\"!config.entityCountPath\">Download</button>\n" +
    "\n" +
    "      <hr />\n" +
    "\n" +
    "      You can Curate extracted measurements <a href=\"/#!/measurement_editor\">here</a>.\n" +
    "    </div>\n" +
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
    "\n" +
    "        <div polar-filter-measurement data-filter=\"data.filter\" data-ng-if=\"data.filter.type == 'measurement'\"></div>\n" +
    "\n" +
    "        <div polar-filter-entity data-filter=\"data.filter\" data-ng-if=\"data.filter.type == 'entity'\"></div>\n" +
    "\n" +
    "        <div polar-filter-doc-type data-filter=\"data.filter\" data-ng-if=\"data.filter.type == 'docType'\"></div>\n" +
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
    "  <div class=\"panel bounceInLeft animated\" data-ng-class=\"{\n" +
    "    'panel-success' : (filter.type == 'geo'),\n" +
    "    'panel-info' : (filter.type == 'time'),\n" +
    "    'panel-warning' : (filter.type == 'concept'),\n" +
    "    'panel-danger' : (filter.type == 'measurement'),\n" +
    "  }\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "      <h3 class=\"panel-title\">\n" +
    "        <span data-ng-show=\"filter.type == 'geo'\">Geographic</span>\n" +
    "        <span data-ng-show=\"filter.type == 'time'\">Date Range</span>\n" +
    "        <span data-ng-show=\"filter.type == 'concept'\">Concept</span>\n" +
    "        <span data-ng-show=\"filter.type == 'measurement'\">Measurement</span>\n" +
    "        <span data-ng-show=\"filter.type == 'entity'\">Entity</span>\n" +
    "        <span data-ng-show=\"filter.type == 'docType'\">File Type</span>\n" +
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
    "\n" +
    "      <span data-ng-show=\"filter.type == 'measurement'\">\n" +
    "        <i data-ng-show=\"!filter.measurements || filter.measurements.length == 0\">\n" +
    "          Add filter specifications\n" +
    "        </i>\n" +
    "\n" +
    "        <span data-ng-show=\"filter.measurements.length > 0\">\n" +
    "          {{ filter.measurements.length }} measurement(s)\n" +
    "        </span>\n" +
    "      </span>\n" +
    "\n" +
    "      <span data-ng-show=\"filter.type == 'entity'\">\n" +
    "        <i data-ng-show=\"!filter.entities || filter.entities.length == 0\">\n" +
    "          Add filter specifications\n" +
    "        </i>\n" +
    "\n" +
    "        <span data-ng-show=\"filter.entities.length > 0\">\n" +
    "          {{ filter.entities.length }} entity(s)\n" +
    "        </span>\n" +
    "      </span>\n" +
    "\n" +
    "      <span data-ng-show=\"filter.type == 'docType'\">\n" +
    "        <i data-ng-show=\"!filter.docTypes || filter.docTypes.length == 0\">\n" +
    "          Add filter specifications\n" +
    "        </i>\n" +
    "\n" +
    "        <span data-ng-show=\"filter.docTypes.length > 0\">\n" +
    "          {{ filter.docTypes.length }} document type(s)\n" +
    "        </span>\n" +
    "      </span>\n" +
    "\n" +
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
    "  <span>\n" +
    "    <a href=\"https://github.com/USCDataScience/polar-deep-insights\" target=\"_blank\">Github</a>&nbsp;.&nbsp;\n" +
    "    <a href=\"https://github.com/USCDataScience/polar-deep-insights/wiki/pages\" target=\"_blank\">Wiki</a>\n" +
    "  </span>\n" +
    "  <span class=\"pull-right\">\n" +
    "    <span class=\"glyphicon glyphicon-heart\"></span> from <a href=\"http://irds.usc.edu\" target=\"_blank\">IRDS.USC.EDU</a>\n" +
    "  </span>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/measurement_editor/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <h3>Extracted Measurements</h3>\n" +
    "\n" +
    "      <button class=\"btn btn-success\" data-ng-click=\"save()\">Save</button>&nbsp;\n" +
    "      <button class=\"btn btn-info\" data-ng-click=\"download()\">Download</button>\n" +
    "      <button class=\"btn btn-warning\" data-ng-click=\"upload()\" data-ng-disabled=\"true\">Upload</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"list-group measurements-container source\" ui-sortable=\"sortableOptions\" data-ng-model=\"measurements\" style=\"height: 650px; overflow-y: scroll;\">\n" +
    "        <a class=\"list-group-item measurements\"\n" +
    "           data-ng-repeat=\"m in measurements\"\n" +
    "           style=\"padding:5px;\">\n" +
    "            <span data-ng-bind=\"m.name\" data-ng-click=\"showDistribution(m.name)\" class=\"link\"></span>\n" +
    "            <span class=\"pull-right\">\n" +
    "              <span data-ng-bind=\"m.count\" class=\"badge\"></span>\n" +
    "              <i class=\"fa fa-times\" data-ng-click=\"measurements.splice($index, 1)\"></i>\n" +
    "              &nbsp;&nbsp;\n" +
    "            </span>\n" +
    "        </a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-9\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" placeholder=\"Group Name\" data-ng-model=\"groupName\"/>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-3\">\n" +
    "          <div class=\"form-group\">\n" +
    "            <button class=\"btn btn-primary\" data-ng-click=\"addGroup(groupName)\">Add</button>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "          <table class=\"table table-bodered\">\n" +
    "            <thead>\n" +
    "              <tr><th>Name</th><th>#</th></tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "              <tr data-ng-show=\"!groups || groups.length == 0\">\n" +
    "                <td colspan=\"2\"><i class=\"text-warning\">No groups</i></td>\n" +
    "              </tr>\n" +
    "\n" +
    "              <tr data-ng-repeat=\"g in groups track by g\" data-ng-class=\"{'success' : (selectedGroup == $index) }\" data-ng-click=\"selectGroup($index)\">\n" +
    "                <td data-ng-bind=\"g\"></td>\n" +
    "                <td><a class=\"text-danger\" data-ng-click=\"removeGroup($index)\"><i class=\"fa fa-times\"></i></a></td>\n" +
    "              </tr>\n" +
    "            </tbody>\n" +
    "          </table>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4 well measurements-container target\"\n" +
    "         data-ng-if=\"groups[selectedGroup]\"\n" +
    "         ui-sortable=\"sortableOptions\" ng-model=\"allMeasurements[groups[selectedGroup]]\"\n" +
    "         style=\"height: 650px; overflow-y: scroll;\">\n" +
    "      <a class=\"list-group-item measurements\"\n" +
    "         data-ng-repeat=\"m in allMeasurements[groups[selectedGroup]]\"\n" +
    "         style=\"padding:5px;\">\n" +
    "        <span data-ng-bind=\"m.name\" data-ng-click=\"showDistribution(m.name)\" class=\"link\"></span>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
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
    "      <a class=\"navbar-brand\" href=\"#!/\">Polar Deep Insights</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"collapse navbar-collapse navbar-collapse\" id=\"navbarLinks\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "\n" +
    "      </ul>\n" +
    "\n" +
    "\n" +
    "      <ul class=\"nav navbar-nav navbar-right\">\n" +
    "        <li data-ng-class=\"$location.path() == '/concept_editor' ? 'active' : '' \"><a href=\"/#!/concept_editor\">Concept Editor</a></li>\n" +
    "        <li data-ng-class=\"$location.path() == '/query' ? 'active' : '' \"><a href=\"/#!/query\">Query Interface</a></li>\n" +
    "        <li data-ng-class=\"$location.path() == '/config' ? 'active' : '' \"><a href=\"/#!/config\">Configure</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</nav>\n"
  );


  $templateCache.put('app/scripts/components/analytics/concept/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-2\">\n" +
    "      <div class=\"btn-group\" role=\"group\" data-ng-init=\"view = 'chart'\">\n" +
    "        <button type=\"button\"\n" +
    "                class=\"btn btn-info\"\n" +
    "                data-ng-disabled=\"view == 'chart'\"\n" +
    "                data-ng-click=\"view = 'chart'\">Chart</button>\n" +
    "        <button type=\"button\"\n" +
    "                class=\"btn btn-info\"\n" +
    "                data-ng-disabled=\"view == 'graph'\"\n" +
    "                data-ng-click=\"view = 'graph'\">Graph</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "        <rzslider rz-slider-model=\"nResults\"\n" +
    "            rz-slider-options=\"{ 'floor': 0, 'ceil': 500, 'step': 1 }\"></rzslider>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-2\">\n" +
    "        <rzslider rz-slider-model=\"inferenceBound\"\n" +
    "            rz-slider-options=\"{ 'floor': 2, 'ceil': 10, 'step': 1 }\"></rzslider>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div polar-analytics-filter data-field=\"field\" data-fn=\"fn\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" data-ng-if=\"view == 'chart'\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\" api=\"api.api\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" data-ng-if=\"view == 'graph'\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"graph-container\"\n" +
    "           tg-graph\n" +
    "           graph=\"graph\"\n" +
    "           on-load=\"onGraphLoad(graph)\"\n" +
    "           edge-menu=\"edgeMenu\"\n" +
    "           node-menu=\"nodeMenu\"\n" +
    "           metadata=\"metadata\"\n" +
    "           configration=\"configration\"\n" +
    "           behavior=\"behavior\"\n" +
    "           stream=\"stream\"\n" +
    "           helpers=\"helpers\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" data-ng-if=\"infered.length > 0\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <h4>Semantic inference</h4>\n" +
    "\n" +
    "      <table class=\"table table-bordered\">\n" +
    "        <thead>\n" +
    "          <tr><th>Inferred</th></tr>\n" +
    "        </thead>\n" +
    "        <tr data-ng-repeat=\"i in infered\">\n" +
    "          <td data-ng-bind=\"i\"></td>\n" +
    "        </tr>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/filter/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <select class=\"form-control\" placeholder=\"FIELD\" data-ng-model=\"field\" data-ng-init=\"field='tf-idf'\">\n" +
    "          <option value=\"count\">Entity Count</option>\n" +
    "          <option value=\"tf\">Term Frequency</option>\n" +
    "          <option value=\"tf-alpha\">Term Occurrence Frequency</option>\n" +
    "          <option value=\"tf-idf\">TF-IDF</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <select class=\"form-control\"\n" +
    "                placeholder=\"OPERATION\"\n" +
    "                data-ng-model=\"fn\"\n" +
    "                data-ng-init=\"fn='avg'\">\n" +
    "          <option value=\"count\">Document Count</option>\n" +
    "          <option value=\"sum\">Sum</option>\n" +
    "          <option value=\"avg\">Average</option>\n" +
    "          <option value=\"max\">Maximum</option>\n" +
    "          <option value=\"min\">Minimum</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/geo_distribution/template.html',
    "<div>\n" +
    "  <div class=\"row\" data-ng-init=\"slider = { 'value': 100 , 'scale': 100 }\">\n" +
    "    <div class=\"col-md-5\">\n" +
    "      <rzslider rz-slider-model=\"slider.value\" rz-slider-options=\"{ 'floor': 1, 'ceil': 10000 }\"></rzslider>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "      <rzslider rz-slider-model=\"slider.scale\" rz-slider-options=\"{ 'floor': 1, 'ceil': 100 }\"></rzslider>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div polar-analytics-filter data-field=\"field\" data-fn=\"fn\"></div>\n" +
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
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <rzslider rz-slider-model=\"slider.value\" rz-slider-options=\"{ 'floor': 1, 'ceil': 10000 }\"></rzslider>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div polar-analytics-filter data-field=\"field\" data-fn=\"fn\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" class=\"idf-location-cont\">\n" +
    "    <div class=\"col-md-8 col-md-offset-2\">\n" +
    "      <leaflet lf-center=\"center\" layers=\"layers\" width=\"1050px\" height=\"850px\" defaults=\"options\" maxbounds=\"options.maxBounds\"></leaflet>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/measurement/hist_modal_template.html',
    "<div>\n" +
    "  <div class=\"modal-body\">\n" +
    "    <div polar-analytics-measurement-histogram data-unit=\"data.unit\" data-filters=\"data.filters\" data-type=\"data.type\"></div>\n" +
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
    "    <div class=\"col-md-4 col-md-offset-8\">\n" +
    "      <div class=\"pull-right\">\n" +
    "        <button data-ng-click=\"init()\" class=\"btn btn-info btn-xs\">Refresh</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\" data-ng-show=\"list.length > 0\" data-ng-show=\"showMeta\">\n" +
    "    <div class=\"col-md-12\" style=\"white-space: pre-line;word-wrap: break-word;\">\n" +
    "      <p>\n" +
    "        <span><b>BUCKET RANGE : </b> {{ range }}</span>\n" +
    "        <span><b>BUCKET Average : </b> {{ avg }}</span>\n" +
    "        <span><b>BUCKET VALUES : </b> {{ list.join(', ') }}</span>\n" +
    "      </p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/measurement/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <select class=\"form-control\" data-ng-model=\"mType\">\n" +
    "          <option value=\"normal\">Normalized measurements</option>\n" +
    "          <option value=\"raw\">Raw measurements</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <select class=\"form-control\" data-ng-model=\"filteredType\" data-ng-options=\"t for t in types\">\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <table class=\"table table-striped table-bordered\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Unit</th>\n" +
    "            <th>Type</th>\n" +
    "            <th>DocCount</th>\n" +
    "            <th>Min</th>\n" +
    "            <th>Max</th>\n" +
    "            <th>Average</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"d in data | filter:filteredType\">\n" +
    "            <td><a data-ng-bind=\"d.unit\" data-ng-click=\"openHistogram(d.unit)\"></a></td>\n" +
    "            <td data-ng-bind=\"d.type\"></td>\n" +
    "            <td data-ng-bind=\"d.count\"></td>\n" +
    "            <td data-ng-bind=\"d.min | number:2\"></td>\n" +
    "            <td data-ng-bind=\"d.max | number:2\"></td>\n" +
    "            <td data-ng-bind=\"d.avg | number:2\"></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/popular_entities/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <select class=\"form-control\" data-ng-model=\"eType\" data-ng-init=\"eType = 'places'\">\n" +
    "          <option value=\"places\">Places</option>\n" +
    "          <option value=\"organizations\">Organizations</option>\n" +
    "          <option value=\"people\">People</option>\n" +
    "          <option value=\"time\">Times</option>\n" +
    "          <option value=\"money\">Money</option>\n" +
    "          <option value=\"percentages\">Percentages</option>\n" +
    "        </select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div polar-analytics-filter data-field=\"field\" data-fn=\"fn\"></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/analytics/stats/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <nvd3 options=\"typeOptions\" data=\"typeData\"></nvd3>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <table class=\"table table-bordered\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <td></td>\n" +
    "            <td>Max</td>\n" +
    "            <td>Average</td>\n" +
    "            <td>Sum (Bytes)</td>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr>\n" +
    "            <th>Number of Documents</th>\n" +
    "            <td colspan=\"3\"><center data-ng-bind=\"docCount | number\"></center></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr data-ng-show=\"results.textSize.avg\">\n" +
    "            <th>Extracted information size</th>\n" +
    "            <td data-ng-bind=\"results.textSize.max| number\"></td>\n" +
    "            <td data-ng-bind=\"results.textSize.avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results.textSize.sum| number\"></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr data-ng-show=\"results.fileSize.avg\">\n" +
    "            <th>File size</th>\n" +
    "            <td data-ng-bind=\"results.fileSize.max| number\"></td>\n" +
    "            <td data-ng-bind=\"results.fileSize.avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results.fileSize.sum| number\"></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr data-ng-show=\"results.textSize.avg\">\n" +
    "            <th>Information Extracted ( Extracted size / File size )</th>\n" +
    "            <td data-ng-bind=\"results.textSize.max / results.fileSize.max | number\"></td>\n" +
    "            <td data-ng-bind=\"results.textSize.avg / results.fileSize.avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results.textSize.sum / results.fileSize.sum | number\"></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr data-ng-show=\"results.metaSize.avg\">\n" +
    "            <th>Metadata size</th>\n" +
    "            <td data-ng-bind=\"results.metaSize.max| number\"></td>\n" +
    "            <td data-ng-bind=\"results.metaSize.avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results.metaSize.sum| number\"></td>\n" +
    "          </tr>\n" +
    "\n" +
    "          <tr data-ng-show=\"results.metaSize.avg\">\n" +
    "            <th>Metadata ratio ( Metadata size / File size )</th>\n" +
    "            <td data-ng-bind=\"results.metaSize.max / results.fileSize.max | number\"></td>\n" +
    "            <td data-ng-bind=\"results.metaSize.avg / results.fileSize.avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results.metaSize.sum / results.fileSize.sum | number\"></td>\n" +
    "          </tr>\n" +
    "\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "\n" +
    "      <hr />\n" +
    "\n" +
    "      <nvd3 options=\"options\" data=\"data\"></nvd3>\n" +
    "\n" +
    "      <hr />\n" +
    "\n" +
    "      <select class=\"form-control\" data-ng-model=\"sE\" data-ng-init=\"sE = keys[0]\" data-ng-options=\"k for k in keys\"></select>\n" +
    "\n" +
    "      <table class=\"table table-striped\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Type</th>\n" +
    "            <th>Max</th>\n" +
    "            <th>Average</th>\n" +
    "            <th>Total</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr>\n" +
    "            <td>Extracted terms</td>\n" +
    "            <td data-ng-bind=\"results[sE + 'OC'].max| number\"></td>\n" +
    "            <td data-ng-bind=\"results[sE + 'OC'].avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results[sE + 'OC'].sum| number\"></td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <td>Distinct extracted terms</td>\n" +
    "            <td data-ng-bind=\"results[sE + 'TC'].max| number\"></td>\n" +
    "            <td data-ng-bind=\"results[sE + 'TC'].avg | number:2\"></td>\n" +
    "            <td data-ng-bind=\"results[sE + 'TC'].sum| number\"></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
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
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <div polar-analytics-filter data-field=\"field\" data-fn=\"fn\"></div>\n" +
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
    "<div>\n" +
    "  <pre style=\"height: 500px; overflow-y: scroll;\">{{ entityString }}</pre>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/concept/search_template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-10\">\n" +
    "      <tags-input ng-model=\"sC\"\n" +
    "                  replace-spaces-with-dashes=\"false\"\n" +
    "                  data-add-from-autocomplete-only=\"true\"\n" +
    "                  placeholder=\"Search for a concept ..\">\n" +
    "        <auto-complete source=\"filterConcepts($query)\" max-results-to-show=\"100\">\n" +
    "\n" +
    "        </auto-complete>\n" +
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


  $templateCache.put('app/scripts/components/filter/doc_type/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <tags-input ng-model=\"sC\"\n" +
    "                  display-property=\"name\"\n" +
    "                  replace-spaces-with-dashes=\"false\"\n" +
    "                  data-add-from-autocomplete-only=\"true\"\n" +
    "                  data-min-length=\"1\"\n" +
    "                  placeholder=\"Search for a measurement\">\n" +
    "        <auto-complete source=\"filterTypes($query)\"\n" +
    "                       load-on-empty=\"true\" load-on-focus=\"true\" load-on-down-arrow=\"true\"></auto-complete>\n" +
    "      </tags-input>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"addType(sC); sC=[]\">\n" +
    "        Add File Type &nbsp;<i class=\"fa fa-plus\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "      <table class=\"table table-striped\" data-ng-show=\"filter.docTypes.length > 0\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>File Type</th>\n" +
    "            <th></th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"g in filter.docTypes\">\n" +
    "            <td data-ng-bind=\"g.name\"></td>\n" +
    "            <td class=\"cursor text-danger\" data-ng-click=\"filter.docTypes.splice($index, 1)\"><i class=\"fa fa-times\"></i></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/components/filter/entity/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <select class=\"form-control\" data-ng-model=\"type\" data-ng-init=\"type = 'places'\">\n" +
    "        <option value=\"places\">Places</option>\n" +
    "        <option value=\"organizations\">Organizations</option>\n" +
    "        <option value=\"people\">People</option>\n" +
    "        <option value=\"time\">Times</option>\n" +
    "        <option value=\"money\">Money</option>\n" +
    "        <option value=\"percentages\">Percentages</option>\n" +
    "      </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <tags-input ng-model=\"sC\"\n" +
    "                  display-property=\"name\"\n" +
    "                  replace-spaces-with-dashes=\"false\"\n" +
    "                  data-add-from-autocomplete-only=\"true\"\n" +
    "                  data-min-length=\"1\"\n" +
    "                  placeholder=\"Search for a measurement\">\n" +
    "        <auto-complete source=\"filterEntities($query)\"\n" +
    "                       load-on-empty=\"true\" load-on-focus=\"true\" load-on-down-arrow=\"true\"></auto-complete>\n" +
    "      </tags-input>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"addEntity(sC); sC=[]\">\n" +
    "        Add Entity &nbsp;<i class=\"fa fa-plus\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "      <table class=\"table table-striped\" data-ng-show=\"filter.entities.length > 0\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Entity</th>\n" +
    "            <th>Type</th>\n" +
    "            <th></th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"g in filter.entities\">\n" +
    "            <td data-ng-bind=\"g.name\"></td>\n" +
    "            <td data-ng-bind=\"g.type\"></td>\n" +
    "            <td class=\"cursor text-danger\" data-ng-click=\"filter.entities.splice($index, 1)\"><i class=\"fa fa-times\"></i></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
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


  $templateCache.put('app/scripts/components/filter/measurement/template.html',
    "<div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <tags-input ng-model=\"sC\"\n" +
    "                  display-property=\"name\"\n" +
    "                  replace-spaces-with-dashes=\"false\"\n" +
    "                  data-add-from-autocomplete-only=\"true\"\n" +
    "                  data-min-length=\"1\"\n" +
    "                  placeholder=\"Search for a measurement\">\n" +
    "        <auto-complete source=\"filterMeasurements($query)\"\n" +
    "                       load-on-empty=\"true\" load-on-focus=\"true\" load-on-down-arrow=\"true\"></auto-complete>\n" +
    "      </tags-input>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-6\">\n" +
    "      <button class=\"btn btn-primary\" data-ng-click=\"addFilter(sC); sC=[]\">\n" +
    "        Add Filter &nbsp;<i class=\"fa fa-plus\"></i>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <hr />\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "\n" +
    "      <table class=\"table table-striped\" data-ng-show=\"filter.measurements.length > 0\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Measurement</th>\n" +
    "            <th></th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "\n" +
    "        <tbody>\n" +
    "          <tr data-ng-repeat=\"g in filter.measurements\">\n" +
    "            <td><a data-ng-bind=\"g.name\" data-ng-click=\"openHist(g.name)\"></a></td>\n" +
    "            <td class=\"cursor text-danger\" data-ng-click=\"filter.measurements.splice($index, 1)\"><i class=\"fa fa-times\"></i></td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "\n" +
    "\n" +
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
    "<div class=\"row\">\n" +
    "  <div class=\"col-md-12\">\n" +
    "    <div polar-concept-editor></div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/config.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div polar-configuration></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/measurement_editor.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div polar-measurement-editor></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('app/scripts/sections/home/query.html',
    "<div>\n" +
    "  <div class=\"row\" data-ng-init=\"filters = []\" style=\"min-height: 105px;\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-md-2\" data-ng-repeat=\"f in filters\">\n" +
    "          <div polar-filter data-filter=\"f\" data-on-delete=\"filters.splice($index, 1)\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "      <div polar-analytics data-filters=\"filters\" data-start-tab=\"{{params.type}}\"></div>\n" +
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
    "  <div>\n" +
    "    <div class=\"c-global-loader\" data-ng-if=\"loaderConfig\">\n" +
    "      <span data-ng-bind=\"loaderConfig.message\"></span>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"c-global-loader-center\" data-ng-if=\"loaderConfig && heavyLoading\">\n" +
    "      <center>\n" +
    "        <img src=\"images/loading.gif\" style=\"height: 120px;margin-right: 20px;\" />\n" +
    "        <br />\n" +
    "        Generating Insights\n" +
    "      </center>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
