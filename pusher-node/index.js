var Pusher = require('pusher-js/node');
var exec = require('child_process').exec;

var pusher = new Pusher("8458eb6fbd288f0cf3d8");

var last_ten = [];

function last_ten_avg(now) {
  if ( last_ten.length > 10 ) {
    last_ten.splice(-1, 1);
  }
  last_ten.push(now);
  tot = 0;
  for(var i=0; i<last_ten.length; i++){
    tot+=last_ten[i];
  }

  return Math.round((tot/last_ten.length) * 100) / 100;
}

var channel = pusher.subscribe('currency');
channel.bind('last_trade', function(data) {
  console.log(data);
  if ( data.symbol === "BTCEUR") {
    var title = data.value + "€ ~ " + last_ten_avg(data.value) + "€";
    var body = data.volume + "€ per " + data.quantity + "BTC";

    var cmd = "notify-send -i ~/Documents/the-rock-trading-trades/pusher-node/trt32.png '" +  title + "' '" + body + "'";
    console.log(cmd);

    exec(cmd, function(error, stdout, stderr) {
      // command output is in stdout
    });
  }
});
