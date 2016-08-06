angular.module("polar.util.services")
.factory("polar.util.services.StateHandler", [ "$window", "$rootScope", function( $window, $rootScope ){
  function Handler(shouldNotRegister){
    var instance = { },
        states = [
          { message : ""         }, //idle
          { message : "Working"  }, //working
          { message : "Complete" }, //complete
          { message : "Success"  }, //success
          { message : "Error"    }, //error
          { message : "Fatal"    }  //fatal
        ],
        currentState = states[ 0 ];

    function setAPIProperties(){
      instance.message = currentState.message;
      instance.isIdle = ( currentState == states[0] );
      instance.isWorking = ( currentState == states[1] );
      instance.isSuccess = ( currentState == states[3] );
      instance.isError = ( currentState == states[4] );
      instance.isFatal = ( currentState == states[5] );
      instance.isComplete = (currentState == states[3] || currentState == states[4] || currentState == states[5]);
    };

    function handleFeedback(message, type){
      if(message) {
        $rootScope.$broadcast("c.events.flash",{
          type: type,
          message: message
        });
      };
    };

    instance.shouldNotRegister = shouldNotRegister;
    /*
     * Public state
     */
    instance.setAllMessages = function(messages){
       for( var i = 0; i < states.length; i++ ){

         if(!messages[i]){
           messages[i] = "";
         };

         states[i].message = messages[i];
       }
    };

     instance.setMessageForState = function(n, message){
       if(states[n]){
         states[n]["message"] = message;
       };
     };

     instance.reset = function(){
       instance.idle();
       return instance;
     };

     instance.idle = function(){
       currentState = states[ 0 ];
       setAPIProperties();
       removeFromQueue(this);
       return instance;
     };

     instance.initiate = function(){
       currentState = states[ 1 ];
       setAPIProperties();
       addToQueue(this);
       return instance;
     };

     instance.success = function(message){
       currentState = states[ 3 ];
       setAPIProperties();
       removeFromQueue(this);
       handleFeedback(message, "success");
       return instance;
     };

     //set this when some known error occurs
     //like validation failure
     instance.error = function(message){
       currentState = states[ 4 ];
       setAPIProperties();
       removeFromQueue(this);
       handleFeedback(message, "danger");
       return instance;
     };

     //set this when the server is unavailable
     //or some exception occurs on the
     //sever side
     instance.fatal = function(message){
       currentState = states[ 5 ];
       message = message
       setAPIProperties();
       removeFromQueue(this);
       handleFeedback(message, "danger");
       return instance;
     };

     return instance;
  };

  Handler.queue = [ ];

  Handler.getInstance = function(shouldNotRegister){
    var ins = new Handler(shouldNotRegister);
    ins.idle();
    return ins;
  };

  function removeFromQueue(handler){
    if(handler.shouldNotRegister){
      return;
    }

    var index = Handler.queue.indexOf(handler);
    if(index > -1) Handler.queue.splice(index, 1);
  };

  function addToQueue(handler){
    if(handler.shouldNotRegister){
      return;
    };

    Handler.queue.push(handler);
  };

  return Handler;
}]);
