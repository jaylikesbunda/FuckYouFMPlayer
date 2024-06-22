$(document).ready(function() {
	registerServiceWorker();
	initializeVolumeControl();
	initializeAdRotation();
	initializePWAInstallation();
	populateTrackList();
	initializePlayer();
	initializeEventListeners();
	preloadTrackImages();
	preloadSocialMediaLinks();
  });
  

  function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
	  navigator.serviceWorker.register('/service-worker.js')
		.then(function(reg) {
		  console.log('Service Worker Registered', reg);
		  requestNotificationPermission();
		})
		.catch(function(err) {
		  console.log('Service Worker Registration Failed', err);
		});
	}
  }
  