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
        return (
          ! _.isEmpty(self.data.endpoint)       &&
          ! _.isEmpty(self.data.index)          &&
          ! _.isEmpty(self.data.docType)        &&
          ! _.isEmpty(self.data.ontologyIndex)  &&
          ! _.isEmpty(self.data.ontologyDocType)&&
          ! _.isEmpty(self.data.entityCountPath)
        );
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
