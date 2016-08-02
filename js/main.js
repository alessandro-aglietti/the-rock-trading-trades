var Notify;

$(function(){
  console.log("onload");
  Notify = window.Notify.default;

  if (!Notify.needsPermission) {
    onPermissionGranted();
  }

  $("#enable").on('click', function(){
    if (!Notify.needsPermission) {
      onPermissionGranted();
    } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    } else {
      alert("browser doesn't support notification api, try latest chrome!");
    }
  });
});

function onPermissionGranted() {
    console.log('Permission has been granted by the user');
    $("#enable").remove();
    if ('serviceWorker' in navigator) {
     console.log('Service Worker is supported');
     navigator.serviceWorker.register('js/sw.js').then(function(reg) {
       console.log(':^)', reg);
       // TODO
     }).catch(function(err) {
       console.log(':^(', err);
     });
    } else {
      alert("browser doesn't support service workers, try latest chrome!");
    }
}

function onPermissionDenied() {
    console.warn('Permission has been denied by the user');
}
