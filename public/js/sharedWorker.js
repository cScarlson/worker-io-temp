self.importScripts('/lib/scriptorium.js');

$hive(function(hive, port, ports, e){
  hive.post('CONNECTED SUCCESSFULLY...');
  hive.listen(function(data){
    hive.post('SHAREDWORKER.JS: ' + data);
  });
}).load('/lib/fakeLib.js');
