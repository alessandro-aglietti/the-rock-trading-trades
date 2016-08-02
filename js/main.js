var Notify;

$(function(){
  console.log("onload");

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
    return;
  } else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    gogo();
  }

  $("#magic").on('click', function(){
    $.ajax({
      url : "magic.sw",
      success: function(data){
        console.log(data);
      }
    });
  });

  $("#enable").on('click', function(){
    if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          gogo();
        } else {
          alert("hai bloccato le notifiche scoglio!");
        }
      });
    } else {
      alert("hai bloccato le notifiche scoglio!");
    }
  });
});

function gogo() {
  $("#enable").remove();
  $("#magic").css("display", "block");
  if ('serviceWorker' in navigator) {
   console.log('Service Worker is supported');
   navigator.serviceWorker.register('sw.js').then(function(reg) {
     console.log(':^)', reg);
     // TODO
   }).catch(function(err) {
     console.log(':^(', err);
   });
  }
}
