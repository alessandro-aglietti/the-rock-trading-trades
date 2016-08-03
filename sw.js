importScripts("js/vendor/pusher.min.js");

var pusher;
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

function pusherr(){
  if( !pusher ) {
    pusher = new Pusher('8458eb6fbd288f0cf3d8', {
      encrypted: true
    });

    var channel = pusher.subscribe('currency');
    channel.bind('last_trade', function(data) {
      console.log(data);
      if ( data.symbol === "BTCEUR") {
        var title = data.value + "€ ~ " + last_ten_avg(data.value) + "€";
        self.registration.showNotification(title, {
          body: data.volume + "€ per " + data.quantity + "BTC",
          icon: "apple-touch-icon.png",
          tag: "new-trade"
        });
      }
    });
  }
}

console.log('Started', self);

self.addEventListener('install', function(event) {
  //self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  if (/magic/.test(event.request.url)) {
    pusherr();
    event.respondWith(
      new Response('magic goes here', {
       headers: { 'Content-Type': 'text/plain' }
     })
    );
  }
});

pusherr();
