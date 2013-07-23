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
      self.port = self.sw.port;
      
      window.onbeforeunload = function(){
        //self.sw.port.emit('destroy port');
        //return '';
      };
      
      return {
        self: self,
        sw: self.sw,
        port: self.port,
        start: self.start,
        ready: self.ready,
        listen: self.listen,
        on: self.on,
        post: self.post,
        emit: self.emit,
        bcast: self.bcast,
        error: self.error
      };
    };
  };
  
  Apis.prototype = (function(){
    var port, object = function(){};
    
    var promise = {
      promises: [],
      when: (function(){
        return function(event){
          return function(callback){
            promise.promises.push({event: event, callback: callback});
          };
        };
      })()
    };
    
    var utils = {
      listenTo: function(event, callback){
        self.sw.port.addEventListener(event, function(e){
          callback(e.data, e);
        }, false);
      },
      newEmit: function(event, data){
        return {
          _event: event,
          _data: data
        };
      },
      dispatch: function(event, data, e){
        var data = data;
        if(data.constructor !== String){
          console.log('is data. Get event!');
          var messageEvent = new MessageEvent(event, {data: data});
          self.sw.port.dispatchEvent(messageEvent);
        }
      }
    };
    
    function start(){
      port.start();
      
      return this;
    };
    
    function ready(callback, run){
      port = this.sw.port;
      (run === true) && start();
      (callback) && callback(this, port, this.sw);
      
      return this;
    };
    
    function listen(callback){
      self.sw.port.addEventListener('message', function(e){
        (callback) && callback(e.data, e);
      }, false);
      
      return this;
    };
    
    function on(event, callback){
      //promise.when(event)(callback);
      utils.listenTo(event, callback);
      self.sw.port.addEventListener('message', function(e){
        utils.dispatch(event, e.data, e);
      }, false);
      return this;
    };
    
    function post(data){
      self.sw.port.postMessage(data);
      return this;
    };
    
    function emit(event, data, callback){
      var emission = utils.newEmit(event, data);
      post(emission);
      (callback) && callback(emission);
      return this
    };
    
    function broadcast(data){
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
      start: start,
      ready: ready,
      listen: listen,
      on: on,
      post: post,
      emit: emit,
      bcast: broadcast,
      error: error
    };
  })();
  
  return new Apis();
})();













