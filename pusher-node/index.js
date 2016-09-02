var Pusher = require('pusher-js/node');
var exec = require('child_process').exec;

var pusher = new Pusher("8458eb6fbd288f0cf3d8");

var last_ten = [];
var last_ten_avg = 0;

function do_last_ten_avg(now) {
  if ( last_ten.length > 10 ) {
    last_ten.splice(0, 1);
  }
  last_ten.push(now);
  tot = 0;
  for(var i=0; i<last_ten.length; i++){
    tot+=last_ten[i];
  }

  var last_ten_avg_new = Math.round((tot/last_ten.length) * 100) / 100;

  last_ten_avg = (last_ten_avg+last_ten_avg_new) / 2;

  return last_ten_avg;
}

function level(tick) {
  var scartamento = (tick-last_ten_avg) / last_ten_avg;
  console.log("scartamento: " + scartamento);

  var color = "red";

  switch (true) {
    case (scartamento > 0.2):
      color = "green";
      break;
    case (scartamento >= 0):
      color = "blue";
      break;
    case (scartamento > -0.1):
      color = "yellow";
      break;
    case (scartamento > -0.2):
      color = "orange";
      break;
  }

  return color;
}

var channel = pusher.subscribe('currency');
channel.bind('last_trade', function(data) {
  console.log(data);
  if ( data.symbol === "BTCEUR") {
    var title = data.value + "€ ~ " + do_last_ten_avg(data.value) + "€";
    var body = data.volume + "€ per " + data.quantity + "BTC";

    var cmd = "notify-send -i ~/Documents/the-rock-trading-trades/pusher-node/trt32." + level(data.value) + ".png '" +  title + "' '" + body + "'";
    console.log(cmd);

    exec(cmd, function(error, stdout, stderr) {
      // command output is in stdout
    });
  }
});
