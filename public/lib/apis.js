/**
 * 
 * 
 * TASK: Events/Promises should use new MessageEvent(name, {data: msg})
 */
var $bee = $bee || (function(){
  'use strict';
  
  var self;
  
  function Apis(){
    self = this;
    return function protagonist(opts, cb){
      opts.path = opts.path || '/js/scriptorium.js';
      opts.ns = opts.ns || 'Apis-Scriptorium-SharedWorker';
      self.sw = (opts) && new SharedWorker(opts.path, opts.ns);
      
      return {
        self: self,
        sw: self.sw,
        ready: self.ready,
        post: self.post,
        listen: self.listen,
        on: self.on,
        emit: self.emit,
        bcast: self.bcast,
        start: self.start,
        error: self.error
      };
    };
  };
  
  Apis.prototype = (function(){
    var port, object = function(){};
    
    var utils = {
      when: (function(){
        var promises = [];
        
        return function(event){
          var event = new CustomEvent(event, {});
          return function(cb){
            promises.push({key: promise, callback: cb});
          };
        };
      })()
    };
    
    function getData(msg){};
    
    function start(){
      port.start();
      
      return this;
    };
    
    function ready(cb, run){
      port = this.sw.port;
      (run === true) && start();
      (cb) && cb(this, port, this.sw);
      
      return this;
    };
    
    function onMessage(cb){
      self.sw.port.addEventListener('message', function(e){
        var data = e.data;
        (cb) && cb(data, e);
      }, false);
      
      return this;
    };
    
    function postMsg(data){
      self.sw.port.postMessage(data);  // just a string
      
      return this;
    };
    
    function on(){};
    
    function emit(event, data, callback){
      var _data = JSON.stringify({_event: event, _data: data});
      postMsg(_data);
      
      return this
    };
    
    function broadcast(data){
      emit('broadcast', data, function(){});
      return this;
    };
    
    function error(cb){
      self.sw.port.addEventListener('error', function(e){
        var errorMsg = e.message + " (" + e.filename + ":" + e.lineno + ")";
        cb && cb(errorMsg);
        throw new Error(errorMsg);
      }, false);
      
      return this;
    };
    
    return {
      ready: ready,
      post: postMsg,
      listen: onMessage,
      on: on,
      emit: emit,
      bcast: broadcast,
      start: start,
      error: error
    };
  })();
  
  return new Apis();
})();













