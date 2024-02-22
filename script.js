$(document).ready(function() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
          .then(function(reg) {
              console.log('Service Worker Registered', reg);

              // After Service Worker registration, request notification permission
              requestNotificationPermission();
          })
          .catch(function(err) {
              console.log('Service Worker Registration Failed', err);
          });
  }

  function requestNotificationPermission() {
      // Check if the Notifications API is supported
      if ("Notification" in window) {
          // Request permission from the user
          Notification.requestPermission().then(function(permission) {
              console.log("Notification permission status:", permission);
              if (permission === "granted") {
                  console.log("Notifications granted");
                  // You can now send notifications
              }
          });
      } else {
          console.log("This browser does not support notifications.");
      }
  }
 
  var isLiveMode = false;
  var isSeeking = false;
  var currentTrackIndex = null;
  var trackList = [
    { 
      name: "FuckYou FM: REMASTERED",
      file: "https://audio.jukehost.co.uk/XxP4grpUn8HB5tHZBLMdqFEUCbRIyCW7",
      image: "https://i.ibb.co/fHDSnRP/fuckyoufm-1.gif"
    },
    { 
      name: "FuckYou FM: UTOPIA",
      file: "https://audio.jukehost.co.uk/SmFrnGF37HsQntp8DW74RAG1LYJboFHy",
      image: "https://i.ibb.co/ssCCtXy/Untitlesaddasdasdcasfd-2.png"
    },
    { 
      name: "FuckYou FM 2",
      file: "https://audio.jukehost.co.uk/Zrm4Ic3XvCtsfbVzsKI1e7NmhAsorKJk",
      image: "https://i.ibb.co/7NDmYcg/Sequence01-ezgif-com-optimize.gif"
    },
  ];

	// Ad rotation functionality
	var adImages = [
		'https://i.ibb.co/6gV20KW/Untitled-3.gif',
		'https://i.ibb.co/R49K61Q/Untitled-5.png',
		'https://i.ibb.co/M2k4nh6/Untitled-6.png',
		'https://i.ibb.co/WvHDtR8/untitled8-min.gif',
		// Add more ad image links as needed
	];

	var currentAdIndex = 0;

	// Preload images
	function preloadAdImages(images) {
		images.forEach(function(imageUrl) {
			var img = new Image();
			img.src = imageUrl;
		});
	}

	function cycleAds() {
		var adContainer = $('#ddd-section');
		var adLink = adContainer.find('a');

		// Ensure there's an <a> tag inside adContainer; if not, create it
		if (adLink.length === 0) {
			adLink = $('<a>', {
				href: "https://www.fuckyoudeki.net", // Note: Please replace the placeholder URL with your desired link
				target: "_blank"
			}).appendTo(adContainer);
		}

		var currentImg = adLink.find('img');

		// Function to create and insert a new ad image
		function insertNewAdImg(src) {
			// Remove any existing image
			currentImg.remove();

			// Insert new image with fadeIn effect
			$('<img>', {
				src: src,
				alt: 'Ad',
				style: 'max-width: 100%; height: auto; display: none;', // Start with display:none
			}).appendTo(adLink).fadeIn('slow');

			// Update the index for the next ad, ensuring a cycle through the adImages array
			currentAdIndex = (currentAdIndex + 1) % adImages.length;
		}

		// If an image already exists, fade it out before inserting a new one
		if (currentImg.length) {
			currentImg.fadeOut('slow', function() {
				insertNewAdImg(adImages[currentAdIndex]);
			});
		} else {
			// Directly insert and show the first ad image without fading
			insertNewAdImg(adImages[currentAdIndex]);
		}

		// Set the timer for the next ad transition
		setTimeout(cycleAds, 5000);
	}

	// Initialize ad rotation and preload images
	$(document).ready(function() {
		preloadAdImages(adImages); // Preload all ad images
		cycleAds();
	});



	$(document).ready(function() {
	  // Function to detect if the app is running as a PWA
	  function isRunningAsPWA() {
		return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone === true);
	  }

	  // Function to detect the user's operating system
	  function getUserOS() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		if (/android/i.test(userAgent)) {
		  return "Android";
		}
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		  return "iOS";
		}
		return "other";
	  }

	  // Only show the PWA installation prompt if not running as a PWA
	  if (!isRunningAsPWA()) {
		// Delay the PWA installation prompt slightly after the site loads
		setTimeout(function() {
		  var os = getUserOS(); // Get the user's OS
		  // Decide on the popup content based on the user's OS
		  if (os === 'Android' || os === 'iOS') {
			var imageSrc = os === 'Android' ? 'https://i.ibb.co/rGmMKYT/Screenshot-2024-02-17-080801.png' : 'https://i.ibb.co/rGmMKYT/Screenshot-2024-02-17-080801.png';
			var popupContent = "<img src='" + imageSrc + "' alt='Install App' style='max-width:100%;height:auto;'>";
			// Show the PWA installation prompt
			$('#track-select-popup').html(popupContent).stop().fadeIn(500).delay(9000).fadeOut(500);
		  }
		}, 2000); // 2 seconds delay
	  }

	  // Event handler for playing a track
	  $(document).on('click', '.jp-play', function(e) {
		// Assuming `currentTrackIndex` is defined elsewhere in your script
		if (typeof currentTrackIndex === 'undefined' || currentTrackIndex < 0) {
		  e.preventDefault(); // Prevent the default play action
		  // Popup content when no track is selected
		  var popupContent = "No track selected.";
		  // Display the popup
		  $('#track-select-popup').html(popupContent).stop().fadeIn(500).delay(1500).fadeOut(500);
		} else {
		  // A track is selected, let the jPlayer handle the play action normally
		  console.log("Playing track with index:", currentTrackIndex);
		}
	  });
	});





	function updateHeaderImage(trackImage) {
		var defaultImage = "https://i.ibb.co/fHDSnRP/fuckyoufm-1.gif"; // Default GIF when no track is selected
		$("#header-image").attr("src", trackImage || defaultImage);
	}

	
	function populateTrackList() {
		const trackSelection = $('#track-selection');

		// Prepend the LIVE button at the top of the track list
		$('<a>', {
			'id': 'live-button',
			'class': 'track-item live-track',
			'href': '#',
			'text': 'LIVE'
		}).on('click', function(e) {
			e.preventDefault();
			activateLiveMode();
			$('.track-item').removeClass('playing'); // Remove playing class from all tracks
			$(this).addClass('playing'); // Highlight the LIVE button
		}).prependTo(trackSelection);

		// Add other tracks to the list
		trackList.forEach((track, index) => {
			$('<a>', {
				'class': 'track-item',
				'href': '#',
				'data-src': track.file,
				'data-image': track.image,
				'text': track.name,
				'data-index': index // Add a data attribute to identify the track
			}).on('click', function(e) {
				e.preventDefault();
				const index = $(this).data('index'); // Retrieve the index of the clicked track
				selectTrack(index);
			}).appendTo(trackSelection);
		});
	}


	function activateLiveMode() {
		isLiveMode = true; // Set live mode to true
		playRandomTrack(-1, true); // -1 indicates no track to exclude, true for isFirstTrack
	}

	function playRandomTrack(excludeIndex, isFirstTrack = false) {
		var randomTrackIndex;
		do {
			randomTrackIndex = Math.floor(Math.random() * trackList.length);
		} while (randomTrackIndex === excludeIndex); // Ensure the new track is not the same as the excludeIndex

		selectTrack(randomTrackIndex, true, isFirstTrack);
	}
	
	function preloadTrack(index) {
		// Calculate the next index, ensuring it wraps around to the start of the playlist if needed
		var nextIndex = (index + 1) % trackList.length;
		var nextTrack = trackList[nextIndex];
		
		// Log the track being preloaded for debugging purposes
		console.log("Preloading track:", nextTrack.name);
		
		// Preload the next track. In this context, we're preparing the next track's information.
		// Actual preloading in browsers can vary in behavior.
		$("#jquery_jplayer_1").jPlayer("setMedia", {
			mp3: nextTrack.file // Adjust according to the audio format
		});
		// Note: This does not start playback. It just prepares the next track.
	}

	function playTrack(index, isImmediate = false) {
		var track = trackList[index];
		currentTrackIndex = index;
		
		console.log("Playing track:", track.name);
		
		$("#jquery_jplayer_1").jPlayer("setMedia", {
			mp3: track.file
		}).jPlayer("play");
		
		if (!isImmediate) {
			preloadTrack(index);
		}
		
		$("#jquery_jplayer_1").unbind($.jPlayer.event.timeupdate).bind($.jPlayer.event.timeupdate, function(event) {
			var remainingTime = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
			// If there's less than 10 seconds remaining, prepare to transition
			if (remainingTime < 10) {
				playNextTrackInLiveMode();
			}
		});
	}



	function playNextTrackInLiveMode() {
		var nextIndex = (currentTrackIndex + 1) % trackList.length;
		
		// Determine if the notification should be sent (e.g., app is in the background)
		if (document.hidden) {
			sendNotificationForLiveMode();
		}
		
		playTrack(nextIndex, true); // Play the next track immediately, skipping preload
	}



	function sendNotification() {
		// Check if Notification API is supported and permissions are granted
		if ("Notification" in window && Notification.permission === "granted") {
			const notification = new Notification("Continue Listening?", {
				body: "Click here to keep enjoying our music stream!",
				icon: "/path/to/your/icon.png", // Optional: Path to an icon
				tag: "continue-listening" // Optional: A tag to prevent multiple instances of the same notification
			});

			// Optional: Handle the click event on the notification
			notification.onclick = function () {
				window.focus(); // Focus the window on click if applicable
				// You can also navigate to a specific URL or perform other actions here
			};
		}
	}

	function sendNotificationForLiveMode() {
		if ("Notification" in window && Notification.permission === "granted") {
			const notification = new Notification("Live Mode is On!", {
				body: "Tap to keep listening to the next track.",
				icon: "/path/to/icon.png",
				tag: "live-mode-notification"
			});

			notification.onclick = function() {
				window.focus(); // Attempt to bring the web app back to focus
				// Direct playback control might not work if the page is not in focus
			};
		}
	}



	function playAllTracksSequentially(index = 0) {
		if (index >= trackList.length) {
			index = 0; // Loop back to the first track for a continuous experience
		}
		selectTrack(index); // Auto-selecting tracks simulates a live playlist
		
		$("#jquery_jplayer_1").unbind($.jPlayer.event.ended).bind($.jPlayer.event.ended, function() {
			playAllTracksSequentially(index + 1);
		});
	}



	function initializePlayer() {
		// Here is the throttled function
		var throttledUpdateSeekBar = _.throttle(function(currentTime, duration) {
			var percentage = (currentTime / duration) * 100;
			$(".jp-play-bar").css("width", percentage + "%");
			$(".current-time").text(formatTime(currentTime));
			$(".duration").text(formatTime(duration - currentTime));
		}, 250); // Throttle updates to every 250 milliseconds

		$("#jquery_jplayer_1").jPlayer({
			ready: function() {
			updateHeaderImage();
			},
			swfPath: "/js",
			supplied: "mp3",
			cssSelectorAncestor: "#jp_container_1",
			useStateClassSkin: true,
			autoBlur: false,
			smoothPlayBar: true,
			keyEnabled: true,
			remainingDuration: true,
			toggleDuration: true,
			timeupdate: function(event) {
			  if (isLiveMode) {
				// Live mode: Update UI to reflect live broadcast without showing seek bar
				$(".current-time, .duration").text('LIVE');
				$(".jp-seek-bar, .jp-play-bar").hide(); // Hide seek bar elements
			  } else {
				// Regular playback: Update seek bar and time info
				if (!isSeeking) {
				  var currentTime = event.jPlayer.status.currentTime;
				  var duration = event.jPlayer.status.duration;
				  var percentage = (currentTime / duration) * 100;
				  $(".jp-play-bar").css("width", percentage + "%");
				  $(".current-time").text(formatTime(currentTime));
				  $(".duration").text(formatTime(duration - currentTime));
				}
			  }
			}
		});

		$('.jp-progress').on('mousedown touchstart', function(e) {
			isSeeking = true;
			var pageX = e.type === 'mousedown' ? e.pageX : e.originalEvent.touches[0].pageX;
			updateSeekBarPosition(pageX);
			e.preventDefault(); // Prevent default text selection behavior
		});


		$(document).on('mousemove touchmove', function(e) {
			if (isSeeking) {
				var pageX = e.type === 'mousemove' ? e.pageX : (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX);
				updateSeekBarPosition(pageX);
			}
		});
		
		
		$(document).ready(function() {
			$('#disclaimer-toggle').click(function() {
				// Toggle visibility with slide animation
				$('#disclaimer-content').slideToggle('slow', function() {
					// This callback function executes after the sliding is complete
					// Check if the disclaimer content is now visible
					if ($('#disclaimer-content').is(":visible")) {
						// Scroll to the disclaimer content smoothly
						$('#disclaimer-content').get(0).scrollIntoView({
							behavior: 'smooth',
							block: 'start'
						});
					}
				});
			});
		});


		$(document).on('mouseup touchend', function(e) {
			if (isSeeking) {
				isSeeking = false;
				var pageX = e.type === 'mouseup' ? e.pageX : (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX);
				updateSeekBarPosition(pageX);

				// Calculate final percentage and update playback position
				var progressContainer = $(".jp-progress");
				var progressBarWidth = progressContainer.width();
				var progressBarOffset = progressContainer.offset().left;
				var position = pageX - progressBarOffset;
				var percentage = (position / progressBarWidth) * 100;
				percentage = Math.max(0, Math.min(percentage, 100));

				// Finalize the seek operation
				$("#jquery_jplayer_1").jPlayer("playHead", percentage);
				syncSeekBarAndTime(percentage, false);
			}
		});


		document.getElementById('other-places-toggle').addEventListener('click', function() {
			var otherPlacesBox = document.getElementById('other-places-box');
			// Toggle visibility
			if (otherPlacesBox.style.display === 'none' || !otherPlacesBox.style.display) {
				otherPlacesBox.style.display = 'block';
				
				// Check if the box is empty before adding content
				if (otherPlacesBox.innerHTML.trim() === '') {
					// Define your links and images
					var places = [
						{ url: 'https://music.apple.com/au/album/f-u-fm-2/1731257521', img: 'https://i.ibb.co/CQYBsCK/Apple-Music-4.png', alt: 'Apple Music' },
						{ url: 'https://www.deezer.com/us/playlist/12386040983', img: 'https://i.ibb.co/j5fs585/6297981ce01809629f11358d.png', alt: 'Deezer' },
						{ url: 'https://open.spotify.com/playlist/4JtgKIx9yeoGG8YExRf9Ub?si=0724cb01a4ce446e', img: 'https://i.ibb.co/RHgcdxG/6297981ce01809629fasdasda11358d.png', alt: 'Spotify' },
						// Add more sites and logos as needed
					];

					// Generate HTML content for links and images
					var content = places.map(function(place) {
						return '<a href="' + place.url + '" target="_blank"><img src="' + place.img + '" alt="' + place.alt + '" style="width: 100px; height: auto; margin: 10px;"></a>';
					}).join('');

					// Insert content into the box
					otherPlacesBox.innerHTML = content;
				}

				// Scroll into view after content is added
				otherPlacesBox.scrollIntoView({ behavior: 'smooth' });
			} else {
				otherPlacesBox.style.display = 'none';
			}
		});


		// Volume control
		$('.jp-volume-bar').on('mousedown', function(e) {
			var volumeBar = $(this);
			var isDragging = false;
			var volumeBarOffset = volumeBar.offset();
			var volumeBarWidth = volumeBar.width();

			var updateVolume = function(e) {
				if (!isDragging) return;
				requestAnimationFrame(function() { // Smooth animation
					var clickPositionX = e.pageX - volumeBarOffset.left;
					var volumeLevel = clickPositionX / volumeBarWidth;
					volumeLevel = Math.max(0, Math.min(volumeLevel, 1)); // Ensure within 0-1 range
					$('.jp-volume-bar-value').width(volumeLevel * 100 + '%');
					$("#jquery_jplayer_1").jPlayer("volume", volumeLevel);
				});
			};

			var startDragging = function(e) {
				isDragging = true;
				updateVolume(e);
			};

			var stopDragging = function() {
				if (isDragging) {
					$(document).off('.vol');
					isDragging = false;
				}
			};

			$(document).on('mousemove.vol', updateVolume).on('mouseup.vol', stopDragging);
			startDragging(e);

			e.preventDefault(); // Prevent default drag behavior
		});

		// Mute and unmute controls
		$('.jp-mute').click(function() {
			$("#jquery_jplayer_1").jPlayer("mute");
		});

		$('.jp-unmute').click(function() {
			$("#jquery_jplayer_1").jPlayer("unmute");
		});

		// Responsive resize
		$(window).resize(function() {
			$("#jquery_jplayer_1").jPlayer("option", "size", {
				width: "100%",
				height: "auto"
			});
		});
	}



	function selectTrack(index, isLive = false, isFirstTrack = false) {
		$('.track-item').removeClass('playing');

		// Set isLiveMode based on isLive parameter
		window.isLiveMode = isLive;

		if (index !== undefined && index >= 0 && index < trackList.length) {
			currentTrackIndex = index;
			var track = trackList[index];

			$("#jquery_jplayer_1").unbind($.jPlayer.event.loadeddata)
								  .unbind($.jPlayer.event.ended)
								  .unbind($.jPlayer.event.timeupdate)
								  .jPlayer("setMedia", { mp3: track.file });

			if (isLive) {
				$('#live-button').addClass('playing');
				$('.current-time, .duration').text('LIVE');
				bindLiveEvents(isFirstTrack);
				updateMediaSession("Live Broadcast", "FY INDUSTRIES"); // Update for live mode explicitly
			} else {
				let uiIndex = index + 1;
				$('.track-item').eq(uiIndex).addClass('playing');
				bindStandardEvents();
				updateMediaSessionWithTrackInfo(index); // Use the dedicated function for standard tracks
			}

			$("#header-image").attr("src", track.image);
		} else if (isLive) {
			$('#live-button').addClass('playing');
			$('.current-time, .duration').text('LIVE');
			bindLiveEvents(isFirstTrack);
			updateMediaSession("Live Broadcast", "FY INDUSTRIES");
		} else {
			handleNoTrackSelected();
		}
	}







	function bindLiveEvents(isFirstTrack) {
		$("#jquery_jplayer_1").bind($.jPlayer.event.loadeddata, function(event) {
			var duration = event.jPlayer.status.duration;
			var randomStartPosition = isFirstTrack ? Math.random() * duration : 0;
			$(this).jPlayer("play", randomStartPosition);

			$(this).bind($.jPlayer.event.ended, function() {
				playRandomTrack(currentTrackIndex);
			});
		});
	}

	function bindStandardEvents() {
		$("#jquery_jplayer_1").jPlayer("play");
		$("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) {
			var currentTime = event.jPlayer.status.currentTime;
			var duration = event.jPlayer.status.duration;
			$(".current-time").text(formatTime(currentTime));
			$(".duration").text(formatTime(duration - currentTime));
		});
	}

	// Refactored code for when no track is selected
	function handleNoTrackSelected() {
		var defaultGIF = "https://i.ibb.co/fHDSnRP/fuckyoufm-1.gif";
		$("#header-image").attr("src", defaultGIF);
		$("#jquery_jplayer_1").jPlayer("clearMedia");
		$('.track-item').removeClass('playing');
		$('.current-time, .duration').text('--:--');
	}

	function updateMediaSessionWithTrackInfo(index) {
		// This check ensures that we have a valid track index and that the trackList is defined
		if (index !== undefined && index >= 0 && index < trackList.length) {
			var track = trackList[index];
			// Update media session with track details
			updateMediaSession(track.name, "FY INDUSTRIES");
		} else {
			// Default message when no track is selected or available
			updateMediaSession("No track selected", "FY INDUSTRIES");
		}
	}

	function updateMediaSession(trackName, artistName) {
		const imageLink = "https://i.ibb.co/7KjTdQ9/Untitled-1.png";
		const artwork = [
			{ src: imageLink, sizes: '96x96', type: 'image/png' },
			{ src: imageLink, sizes: '128x128', type: 'image/png' },
			{ src: imageLink, sizes: '192x192', type: 'image/png' },
			{ src: imageLink, sizes: '256x256', type: 'image/png' },
			{ src: imageLink, sizes: '384x384', type: 'image/png' },
			{ src: imageLink, sizes: '512x512', type: 'image/png' },
		];

		if (isLiveMode && !window.liveModeInitialized) {
			window.liveModeInitialized = true;
			trackName = "Live Broadcast";
		} else if (!isLiveMode) {
			window.liveModeInitialized = false;
		}

		// Update or initialize media session metadata
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: trackName || "No track selected",
				artist: artistName || "FY INDUSTRIES",
				artwork: artwork
			});

			// Define action handlers
			navigator.mediaSession.setActionHandler('play', () => $("#jquery_jplayer_1").jPlayer("play"));
			navigator.mediaSession.setActionHandler('pause', () => $("#jquery_jplayer_1").jPlayer("pause"));
			navigator.mediaSession.setActionHandler('previoustrack', () => {
				// Implement or adjust previous track logic for live mode if needed
			});
			navigator.mediaSession.setActionHandler('nexttrack', () => {
				// Implement or adjust next track logic for live mode
				playNextTrackInLiveMode();
			});
		}
	}





	function updateSeekBar(currentTime, duration) {
		if (isLiveMode) {
			// In live mode, indicate the live status and ensure the seek bar is full but not interactive.
			$(".jp-seek-bar, .jp-play-bar").css("width", "100%");
			$(".current-time, .duration").text('LIVE').show();
		} else {
			// In non-live mode, update the seek bar and time displays based on the current playback position.
			let percentage = (currentTime / duration) * 100;
			$(".jp-seek-bar").show();
			$(".jp-play-bar").css("width", percentage + "%");
			$(".current-time").text(formatTime(currentTime));
			$(".duration").text(formatTime(duration - currentTime));
		}
	}

	function updateSeekBarPosition(pageX) {
		if (!isLiveMode) { // Only allow seek bar updates in non-live mode.
			var progressContainer = $(".jp-progress");
			var progressBarWidth = progressContainer.width();
			var progressBarOffset = progressContainer.offset().left;
			var clickPosition = pageX - progressBarOffset;
			var percentage = (clickPosition / progressBarWidth) * 100;
			percentage = Math.max(0, Math.min(percentage, 100));
			
			$(".jp-play-bar").css("width", percentage + "%");
			syncSeekBarAndTime(percentage);
		}
	}

	function syncSeekBarAndTime(percentage) {
		if (!isLiveMode) {
			var duration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
			var seekPosition = (percentage / 100) * duration;
			$("#jquery_jplayer_1").jPlayer("playHead", percentage); // Seek to the new position.
			// The time update will be handled by the jPlayer's "timeupdate" event.
		}
	}

	$(document).on('mouseup touchend', function(e) {
		if (isSeeking && !isLiveMode) { // Finalize seeking only in non-live mode.
			isSeeking = false;
			var pageX = e.type === 'mouseup' ? e.pageX : (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX);
			updateSeekBarPosition(pageX);
		}
	});

	$('.jp-progress').on('mousedown touchstart', function(e) {
		if (!isLiveMode) { // Start seeking only in non-live mode.
			isSeeking = true;
			updateSeekBarPosition(e.pageX);
			e.preventDefault();
		}
	});

	$(document).on('mousemove touchmove', function(e) {
		if (isSeeking && !isLiveMode) {
			var pageX = e.type === 'mousemove' ? e.pageX : e.originalEvent.touches[0].pageX;
			updateSeekBarPosition(pageX);
		}
	});



	// Additional helper function for formatting time
	function formatTime(seconds) {
		var minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}

    populateTrackList();
    initializePlayer();


});