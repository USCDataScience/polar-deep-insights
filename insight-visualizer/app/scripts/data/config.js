angular.module("polar.data")

.service("polar.data.Config", ["$resource", "$q", "localStorageService",
  function($resource, $q, localStorageService){

    var Config = { data: { } };

    Config.save = function(d){
      localStorageService.set('config', d);
      this.data = angular.copy(d);
    };

    Config.load = function(){
      this.data = localStorageService.get('config') || { };
    };

    Config.isSet = function(){
      var self = this;

      // Validate config fields
      var dataSet = function(){
        var fields = [
          self.data.endpoint,
          self.data.index,
          self.data.docType,
          self.data.ontologyIndex,
          self.data.ontologyDocType,
          self.data.entityCountPath,
          self.data.measurementIndex,
          self.data.measurementDocType,
        ]

        return ! _.any(fields, _.isEmpty);
      };

      return ! _.isEmpty(this.data) && dataSet();
    };

    Config.getData = function(){
      return Config.data;
    };

    Config.getExtractionURL = function(){
      return this.data.endpoint + "/" + this.data.index + "/" + this.data.docType;
    };

    Config.getOntologyURL = function(){
      return this.data.endpoint + "/" + this.data.ontologyIndex + "/" + this.data.ontologyDocType;
    };

    return Config;
  }
]);
