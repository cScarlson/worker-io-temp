self.importScripts('/lib/fakeLib.js');


var $hive = $hive || (function(self){
  var hive, ports = [];
  
  function Hive(){
    hive = this;
    
    return function(callback){
      self.addEventListener('connect', function(e){
        var port = e.ports[0];
        hive.port = port;
        ports.push(port);
        port.start();
        (callback) && callback(hive, port, ports, e);
      }, false);
      
      
      return {
        hive: hive,
        load: hive.load,
        listen: hive.listen,
        post: hive.post
      };
    };
  };
  
  Hive.prototype = (function(){
    
    function load(scripts){
      self.importScripts(scripts);
      return this;
    };
    
    function handleEvent(msg, callback, e){
      var msg = JSON.parse(msg)
        , evt = msg._event
        , data = msg._data;
      
      emit(evt, data, callback);
    };
    
    function listen(callback){
      hive.port.addEventListener('message', function(e){
        var data = handleEvent(e.data, callback, e);
      }, false);
      
      return this;
    };
    
    function post(data){
      hive.port.postMessage(data);
      
      return this;
    };
    
    function on(){};
    
    function emit(event, data, callback){
      if(event === 'message'){
        post(data);
      }else if(event === 'broadcast'){
        broadcast(data);
      }
      return this;
    };
    
    function broadcast(data){
      ports.forEach(function(p, i, a){
        p.postMessage(data);
      });
      
      return this;
    };
    
    
    return {
      load: load,
      listen: listen,
      post: post
    };
  })();
  
  
  return new Hive();
})(self);











