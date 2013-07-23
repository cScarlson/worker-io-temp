self.importScripts('/lib/scriptorium.js');

$hive(function(hive, port, ports, e){
  hive.post('CONNECTED SUCCESSFULLY...with ' + ports.length-1 || 0 + ' others.');
  hive.listen(function(data, e){
    hive.bcast('SHAREDWORKER.JS - BROADCAST: ' + data);
    //hive.post('SHAREDWORKER.JS - POST: ' + data);
    hive.post(data);
  });
}).load('/lib/fakeLib.js');
