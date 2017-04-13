var Pusher = require( 'pusher-js/node' );
var exec   = require( 'child_process' ).exec;

var pusher = new Pusher( "bb1fafdf79a00453b5af" );

var last_ten     = [];
var last_ten_avg = false;

function do_last_ten_avg( now ) {
  if ( last_ten.length > 10 ) {
    last_ten.splice( 0, 1 );
  }
  last_ten.push( now );
  tot = 0;
  for ( var i = 0; i < last_ten.length; i++ ) {
    tot += last_ten[ i ];
  }

  var last_ten_avg_new = Math.round( (tot / last_ten.length) * 100 ) / 100;

  last_ten_avg = (!last_ten_avg) ? last_ten_avg_new : (last_ten_avg + last_ten_avg_new) / 2;

  last_ten_avg = Math.round( last_ten_avg * 100 ) / 100;

  return last_ten_avg;
}

function level( tick ) {
  var scartamento = (tick - last_ten_avg) / last_ten_avg;
  console.log( "scartamento: " + scartamento );

  var color = "red";

  switch ( true ) {
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

var channel = pusher.subscribe( 'currency' );
channel.bind( 'last_trade', function ( data ) {
  console.log( data );
  if ( data.symbol === "BTCEUR" ) {
    var last_ten_avg = do_last_ten_avg( data.value );
    var cmd2usd      = "curl -s http://api.fixer.io/latest?base=EUR | jq '.rates.USD' | awk '{print $0*" + last_ten_avg + "}'";
    exec( cmd2usd, function ( error, cmd2usd_stdout, stderr ) {
      var title = data.value + "€ ~ " + last_ten_avg + "€/" + cmd2usd_stdout + "$";
      var body  = data.volume + "€ per " + data.quantity + "Ƀ";

      var cmd = "notify-send -i " + __dirname + "/trt32." + level( data.value ) + ".png '" + title + "' '" + body + "'";
      console.log( cmd );

      exec( cmd, function ( error, stdout, stderr ) {
        // command output is in stdout
      } );
    } );
  }
} );
