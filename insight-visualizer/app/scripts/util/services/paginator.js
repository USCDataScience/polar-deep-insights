    (function() {
    function Factory($timeout) {

      function Service(ResourceClass, action) {
        this.page = 1;
        this.ResourceClass = ResourceClass;
        this.action = action;
        this.requestQueue = [ ];
        this.requestCount = 0;
        this.totalPages = 100;
      };

      Service.prototype.on = function(dataSet) {
        this.dataSet = dataSet;
        return this;
      };

      Service.prototype.setTotalPages = function(tp) {
        this.totalPages = tp;
        return this;
      };

      Service.prototype.paginate = function(params, onSuccess, onError) {
        var self = this;

        if(self.page > self.totalPages){ return; };

        self._queuePush();

        // this condition will prevent uncessary fetches unless the previous
        // fetch is complete
        if(self.requestQueue.length == 1) {
          $timeout(function(){
            self._dataFetch(params, ( onSuccess || angular.noop ), ( onError || angular.noop ) );
          }, 0);
        };
        return self;
      };

      Service.prototype._dataFetch = function(params, onSuccess, onError) {
        var self = this,
            req  = _.extend(params, { from: self.page });

        self.ResourceClass[self.action](req).$promise.then(function(response){
          self._afterResolution(response, params, onSuccess, onError);
          onSuccess(response);
        }, function(response){
          // handle error callback
          onError(response);
        });
      };

      Service.prototype._afterResolution = function(response, params, onSuccess, onError) {
        var self = this;
        // push data
        self._dataPush(response);
        // set next page
        self._setNextPage(response);
        // remove the first element from request queue
        self._queueShift();

        // if more calls are pending and previous response wasn't empty
        if(self.requestQueue.length > 0 && self._isValidResponse(response)) {
          self._dataFetch(params, onSuccess, onError);
        } else {
          // calls might be pending but response is already empty
          // so no use executing the other requests
          // so empty the queue
          self.requestQueue = [ ];
        }
      };

      Service.prototype._setNextPage = function(response) {
        var self = this;
        if(self._isValidResponse(response)) {
          self.page = self.page + 1;
        };
      };

      // pushes data into the array using the response
      Service.prototype._dataPush = function(response) {
        var self = this;

        angular.forEach(response, function(res){
          self.dataSet.push(res);
        });
      };

      // maintains a queue to store the number of pagination requests
      Service.prototype._queuePush = function() {
        var self = this;
        self.requestCount++;

        self.requestQueue.push({
          count: self.requestCount
        });
      };

      // when a pagination request is complete clear the first one
      Service.prototype._queueShift = function() {
        this.requestQueue.shift();
      };

      Service.prototype._isValidResponse = function(response) {
        return (response && response.length > 0);
      }
      return {
        getInstance: function(ResourceClass, action) {
          return new Service(ResourceClass, action);
        }
      }
    };
    angular.module('polar.util.services')
    .factory('polar.util.services.Paginator', [
      '$timeout',
      Factory
    ]);
  }());
