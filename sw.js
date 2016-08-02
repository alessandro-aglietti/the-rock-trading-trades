importScripts("js/vendor/pusher.min.js");

function pusherr(){
  var pusher = new Pusher('8458eb6fbd288f0cf3d8', {
    encrypted: true
  });

  var channel = pusher.subscribe('currency');
  channel.bind('new_offer', function(data) {
    console.log(data);
    if ( data.symbol === "BTCEUR") {
      var text = data.type + " " + data.value;
      self.registration.showNotification(text, {
        body: text,
        icon: "apple-touch-icon.png",
        tag: "new-trade"
      });
    }
  });
}

console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});
self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  if (/\.sw$/.test(event.request.url)) {
    pusherr();
    event.respondWith(
      new Response('magic goes here', {
       headers: { 'Content-Type': 'text/plain' }
     })
    );
  }
});

pusherr();
