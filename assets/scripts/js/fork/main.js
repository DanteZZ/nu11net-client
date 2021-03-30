const { fork } = require('child_process');
let proc = fork('assets/scripts/js/vm-runner.js');

proc.on('message', (msg) => {
  if (msg.type == "command") {
        proc.send({
            type:"response",
            bufferId:msg.bufferId,
            data:{command:msg.command,result:"Oh, Hello from Kernel"}
        });
  };
  console.log("GET:",msg);
});

proc.send({ type:"command", command:"setCTX", data:{context:{a:10}}});
proc.send({
    type:"command",
    command:"runScript",
    data:{script:"process.sendCommand({command:'checkCommand',callback:function(data){process.send('Thanks, i resolve'); process.send(data)}})"}
})