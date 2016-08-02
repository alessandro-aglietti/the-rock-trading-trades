var Notify;

$(function(){
  console.log("onload");
  Notify = window.Notify.default;

  if (!Notify.needsPermission) {
    $("#enable").remove();
  }

  $("#enable").on('click', function(){
    if (!Notify.needsPermission) {
      $("#enable").remove();
    } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }
  });

  if ('serviceWorker' in navigator) {
   console.log('Service Worker is supported');
   navigator.serviceWorker.register('js/sw.js').then(function(reg) {
     console.log(':^)', reg);
     // TODO
   }).catch(function(err) {
     console.log(':^(', err);
   });
  }
});

function onPermissionGranted() {
    console.log('Permission has been granted by the user');
    $("#enable").remove();
}

function onPermissionDenied() {
    console.warn('Permission has been denied by the user');
}
