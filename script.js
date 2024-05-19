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

  
	(function() {
		// Enhanced Volume and Mute Control Functionality with Smooth Interaction
		var volumeBar = $('.jp-volume-bar');
		var jPlayer = $("#jquery_jplayer_1");

		// Function to check if the device is mobile
		function isMobileDevice() {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		}

		// Initialize isMuted based on the player's current muted state or a default value
		var isMuted = jPlayer.data().jPlayer && jPlayer.data().jPlayer.status.muted;

		function setVolume(volumeLevel, updateMuteState = true) {
			$('.jp-volume-bar-value').width(volumeLevel * 100 + '%');
			jPlayer.jPlayer("volume", volumeLevel);
			
			// Update mute state if necessary
			if (updateMuteState) {
				isMuted = volumeLevel === 0;
			}
			updateVolumeUI(volumeLevel);
		}

		function updateVolumeUI(volumeLevel) {
			// Hide volume controls on mobile devices
			if (isMobileDevice()) {
				$('.jp-volume-controls').hide();
			} else {
				$('.jp-mute').toggle(isMuted || volumeLevel === 0);
				$('.jp-unmute').toggle(!isMuted && volumeLevel > 0);
			}
		}

		var dragging = false;
		function handleVolumeChange(e) {
			if (!dragging) return;
			requestAnimationFrame(function() {
				var volumeBarOffset = volumeBar.offset().left;
				var volumeBarWidth = volumeBar.width();
				var pageX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
				var clickPositionX = pageX - volumeBarOffset;
				var volumeLevel = Math.max(0, Math.min(clickPositionX / volumeBarWidth, 1));
				setVolume(volumeLevel, false);
			});
		}

		volumeBar.on('mousedown touchstart', function(e) {
			if (isMobileDevice()) return; // Prevent interaction on mobile devices
			e.preventDefault();
			dragging = true;
			handleVolumeChange(e);

			$(document).on('mousemove.vol touchmove.vol', handleVolumeChange)
					   .one('mouseup touchend', function() {
						   dragging = false;
						   $(document).off('.vol');
					   });
		});

		function toggleMute() {
			isMuted = !isMuted;
			jPlayer.jPlayer(isMuted ? "mute" : "unmute");
			// Directly reflect mute state change without waiting for player update
			updateVolumeUI(isMuted ? 0 : jPlayer.data().jPlayer.options.volume);
		}

		// Ensure volume and mute state are accurately initialized
		$(document).ready(function() {
			var initialVolume = jPlayer.data().jPlayer ? jPlayer.data().jPlayer.options.volume : 0.8;
			// Correctly initialize the state for mobile devices
			if (isMobileDevice()) {
				$('.jp-volume-controls').hide();
			} else {
				setVolume(isMuted ? 0 : initialVolume, !isMuted);
			}
		});

		$('.jp-mute, .jp-unmute').click(toggleMute);
	})();


 
  var isLiveMode = false;
  var isSeeking = false;
  var currentTrackIndex = null;
  var trackList = [
    { 
      name: "FuckYou FM",
      file: "https://audio.jukehost.co.uk/XxP4grpUn8HB5tHZBLMdqFEUCbRIyCW7",
      image: "https://i.ibb.co/QXb2VRT/ezgif-com-optiwebp-1.webp"
    },
    { 
      name: "FuckYou FM 2",
      file: "https://audio.jukehost.co.uk/Zrm4Ic3XvCtsfbVzsKI1e7NmhAsorKJk",
      image: "https://i.ibb.co/s35zvp3/ezgif-com-webp-maker.webp"
    },
    { 
      name: "FuckYou FM 3",
      file: "https://api.pillowcase.su/api/get/5ccac8556a90935cabd9126f3ddf09ea",
      image: "https://i.ibb.co/0MkWY9n/ezgif-com-webp-maker-1.webp"
    },
  ];

	// Ad rotation functionality
	var adImages = [
		'https://i.ibb.co/N65mPsN/ezgif-com-resize.webp',
		'https://i.ibb.co/2Pm9DdV/luckyliners.webp',
		'https://i.ibb.co/FwMBKHK/Untitled-6.webp',
		'https://i.ibb.co/B2M8PXk/kinder-dark.webp',
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
				style: 'max-width: 100%; height: auto; display: none; aspect-ratio: 2.625 / 1;', // Start with display:none
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


	$(document).ready(function () {
		let deferredPrompt;

		function isAndroidDevice() {
			return /Android/i.test(navigator.userAgent);
		}

		function isIOSDevice() {
			return /iPhone|iPad|iPod/i.test(navigator.userAgent);
		}

		function isRunningAsPWA() {
			return ('matchMedia' in window && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
		}

		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
			if (isAndroidDevice() && !isRunningAsPWA()) {
				deferredPrompt = e; // Stash the event so it can be triggered later.
				showInstallButtonPopup(); // Show the install button popup for Android
			}
		});

		function showPopup(popupHTML) {
			$('body').append(popupHTML);
			$('.closePopup').on('click', () => {
				$('.popupContainer').remove();
			});
		}

		function showInstallButtonPopup() {
			let popupHTML = `
			<div class="popupContainer" style="position: fixed; inset: 10px; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.7); z-index: 1000;">
				<div style="position: relative; padding: 20px; max-width: 500px; background: #000; border: 2px solid #fff; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; font-family: 'Press Start 2P', cursive;">
					 <p style="color: #fff; text-align: center; margin-bottom: 20px;">This feature is required for LIVE mode.</p>
					 <button id="installButton" style="padding: 10px 20px; background: #000; color: #fff; border: 2px solid #fff; border-radius: 10px; cursor: pointer; font-family: 'Press Start 2P', cursive;">Install App</button>
					 <button class="closePopup" style="margin-top: 0px; background: none; border: none; color: #fff; cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 24px; padding: 10px;">&#10005;</button>
				 </div>
			</div>`;
			showPopup(popupHTML);

			$('#installButton').on('click', async () => {
				if (deferredPrompt) {
					deferredPrompt.prompt();
					const { outcome } = await deferredPrompt.userChoice;
					deferredPrompt = null;
					console.log(outcome === 'accepted' ? 'User accepted the install prompt' : 'User dismissed the install prompt');
					$('.popupContainer').remove();
				}
			});
		}

		function showImageBasedPWAInstallationPrompt() {
			if (isIOSDevice() && !isRunningAsPWA()) {
				let imageSrc = 'https://i.ibb.co/QKWKWWC/pwa-incentive-2-high-res.webp';
				let popupHTML = `
				<div class="popupContainer" style="position: fixed; inset: 10px; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
					<div style="position: relative; padding: 12px; max-width: 500px; background: #000; border: 1px solid #fff; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center;">
						<img src="${imageSrc}" alt="Install App" style="max-width:95%; margin-bottom: 0px;">
						<button class="closePopup" style="margin-top: 0px; background: none; border: none; color: #fff; cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 24px; padding: 10px;">&#10005;</button>
					</div>
				</div>`;
				showPopup(popupHTML);
			}
		}

		// Delay for simulating similar behavior as Android for consistency
		setTimeout(showImageBasedPWAInstallationPrompt, 2000);
	});




	function updateHeaderImage(trackImage) {
		var defaultImage = "https://i.ibb.co/QXb2VRT/ezgif-com-optiwebp-1.webp"; // Default GIF when no track is selected
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
			// Activate live mode and start playing a random track immediately when LIVE is clicked
			activateLiveMode();
			playRandomTrack(-1, true); // Ensures playback begins with user interaction
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
				selectTrack(index); // Select the track and play it
			}).appendTo(trackSelection);
		});
	}
	


	function activateLiveMode() {
		isLiveMode = true;
		playRandomTrack(-1, true);
	}
	
	function playRandomTrack(excludeIndex, isFirstTrack = false) {
		var randomTrackIndex;
		do {
			randomTrackIndex = Math.floor(Math.random() * trackList.length);
		} while (randomTrackIndex === excludeIndex);
	
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

	// Refactored code for when no track is selected
	function handleNoTrackSelected() {
		var defaultGIF = "https://i.ibb.co/QXb2VRT/ezgif-com-optiwebp-1.webp";
		$("#header-image").attr("src", defaultGIF);
		$("#jquery_jplayer_1").jPlayer("clearMedia");
		$('.track-item').removeClass('playing');
		$('.current-time, .duration').text('--:--');
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
    // Throttled function to update the seek bar efficiently
    var throttledUpdateSeekBar = _.throttle(function(currentTime, duration) {
        var percentage = (currentTime / duration) * 100;
        $(".jp-play-bar").css("width", percentage + "%");
        $(".current-time").text(formatTime(currentTime));
        $(".duration").text(formatTime(duration - currentTime));
    }, 250);

    // Initialize the jPlayer with the desired settings
    $("#jquery_jplayer_1").jPlayer({
        ready: function() {
            updateHeaderImage(); // Initial header image update
            // Set media source here if needed
            $(this).jPlayer("setMedia", {
                title: "Your Media Title",
                mp3: "path/to/your/media.mp3" // Replace with actual media path
            });
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
                $(".current-time, .duration").text('LIVE').show();
                $(".jp-seek-bar, .jp-play-bar").hide();
            } else {
                if (!isSeeking) {
                    throttledUpdateSeekBar(event.jPlayer.status.currentTime, event.jPlayer.status.duration);
                }
            }
        },
        canplay: function(event) {
            $("#jquery_jplayer_1").jPlayer("play"); // Automatically start playback
        },
        ended: function() {
            // Handle what happens when playback ends
            console.log("Playback ended.");
        },
        play: function() {
            // Handle play event
            console.log("Playback started.");
        },
        pause: function() {
            // Handle pause event
            console.log("Playback paused.");
        },
        stop: function() {
            // Handle stop event
            console.log("Playback stopped.");
            $("#jquery_jplayer_1").jPlayer("clearMedia"); // Clear the media to ensure it stops
        },
        error: function(event) {
            console.error("jPlayer error: " + event.jPlayer.error.message);
        }
    });

    // Custom stop button functionality
    $(".jp-stop").click(function() {
        $("#jquery_jplayer_1").jPlayer("clearMedia"); // Clear the media to ensure it stops
        $(".jp-play-bar").css("width", "0%"); // Reset the play bar
        $(".current-time").text("00:00"); // Reset current time display
        $(".duration").text("00:00"); // Reset duration display
    });
}

	

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
			$('#disclaimer-content').slideToggle('slow', function() {
				if ($('#disclaimer-content').is(":visible")) {
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
			
			var progressContainer = $(".jp-progress");
			var progressBarWidth = progressContainer.width();
			var progressBarOffset = progressContainer.offset().left;
			var position = pageX - progressBarOffset;
			var percentage = (position / progressBarWidth) * 100;
			percentage = Math.max(0, Math.min(percentage, 100));

			$("#jquery_jplayer_1").jPlayer("playHead", percentage);
		}
	});

	// Prepopulate the other places box
	var otherPlacesBox = document.getElementById('other-places-box');
	var places = [
		{ url: 'https://music.apple.com/au/album/f-u-fm-2/1731257521', img: 'https://i.ibb.co/nCqtTsq/Apple-Music-4.webp', alt: 'Apple Music' },
		{ url: 'https://www.deezer.com/us/playlist/12386040983', img: 'https://i.ibb.co/PF1VCYb/6297981ce01809629f11358d.webp', alt: 'Deezer' },
		{ url: 'https://open.spotify.com/playlist/4JtgKIx9yeoGG8YExRf9Ub?si=0724cb01a4ce446e', img: 'https://i.ibb.co/pwJMn08/6297981ce01809629fasdasda11358d.webp', alt: 'Spotify' },
	];
	var otherPlacesContent = places.map(function(place) {
		return `<a href="${place.url}" target="_blank"><img src="${place.img}" alt="${place.alt}" style="width: 100px; height: auto; margin: 10px;"></a>`;
	}).join('');
	otherPlacesBox.innerHTML = otherPlacesContent;

	// Prepopulate the social media box
	var socialMediaBox = document.getElementById('social-media-box');
	var socialMediaLinks = [
		{ url: 'https://discord.gg/mWhBXcNATq', img: 'https://i.ibb.co/FxnLhYc/discordpng.png', alt: 'Discord' },
		{ url: 'https://www.instagram.com/fuckyoucorp/', img: 'https://i.ibb.co/qCQK5f9/igpng.png', alt: 'Instagram' },
		// Add more social media links as needed
	];
	var socialMediaContent = socialMediaLinks.map(function(link) {
		return `<a href="${link.url}" target="_blank"><img src="${link.img}" alt="${link.alt}" style="width: 32px; height: 32px; margin: 10px;"></a>`;
	}).join('');
	socialMediaBox.innerHTML = socialMediaContent;

	// Event listener for other places toggle
	document.getElementById('other-places-toggle').addEventListener('click', function() {
		if (otherPlacesBox.style.display === 'none' || !otherPlacesBox.style.display) {
			otherPlacesBox.style.display = 'block';
			otherPlacesBox.scrollIntoView({ behavior: 'smooth' });
		} else {
			otherPlacesBox.style.display = 'none';
		}
	});

	// Event listener for social media toggle
	document.getElementById('social-media-toggle').addEventListener('click', function() {
		if (socialMediaBox.style.display === 'none' || !socialMediaBox.style.display) {
			socialMediaBox.style.display = 'block';
			socialMediaBox.scrollIntoView({ behavior: 'smooth' });
		} else {
			socialMediaBox.style.display = 'none';
		}
	});



	function selectTrack(index, isLive = false, isFirstTrack = false) {
		$('.track-item').removeClass('playing');
		window.isLiveMode = isLive;
		var track = trackList[index];
	
		if (index !== undefined && index >= 0 && index < trackList.length) {
			currentTrackIndex = index;
	
			$("#jquery_jplayer_1")
				.unbind($.jPlayer.event.loadeddata)
				.unbind($.jPlayer.event.ended)
				.unbind($.jPlayer.event.timeupdate)
				.jPlayer("setMedia", { mp3: track.file });
	
			if (isLive) {
				$('#live-button').addClass('playing');
				$('.current-time, .duration').text('LIVE');
				bindLiveEvents(isFirstTrack);
				updateMediaSession("Live Broadcast", "FY INDUSTRIES");
				$("#jquery_jplayer_1").jPlayer("play"); // Ensure playback starts immediately in live mode
			} else {
				let uiIndex = index + 1;
				$('.track-item').eq(uiIndex).addClass('playing');
				bindStandardEvents(); // Immediate playback control for iOS
				updateMediaSessionWithTrackInfo(index);
			}
	
			// Update the header image for the selected track
			$("#header-image").attr("src", track.image);
		} else {
			handleNoTrackSelected();
		}
	}
	
	
	






	function bindLiveEvents(isFirstTrack) {
		$("#jquery_jplayer_1").bind($.jPlayer.event.loadeddata, function(event) {
			var duration = event.jPlayer.status.duration;
			var randomStartPosition = isFirstTrack ? Math.random() * duration : 0;
			$(this).jPlayer("play", randomStartPosition); // Immediate play at random position
	
			$(this).bind($.jPlayer.event.ended, function() {
				playRandomTrack(currentTrackIndex); // Loop or transition to another track
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


	$(document).ready(function() {
		$('.jp-play').on('click', function(e) {
			// Check if a track has been selected by also checking for null
			if (currentTrackIndex === null || typeof currentTrackIndex === 'undefined' || currentTrackIndex < 0) {
				e.preventDefault(); // Prevent the default action of playing
				
				// Define the popup content with updated styles for black background, white text, and white border
				var popupContent = "<div style='color: #fff; background-color: #000; padding: 5px; border-radius: 8px; text-align: center; max-width: 300px; margin: 20px auto;'>no track selected.</div>";

				// Display the popup message
				$('#track-select-popup').html(popupContent).fadeIn(500).delay(3000).fadeOut(500);
			} else {
				// A track has been selected, proceed with playing
				console.log("Playing track with index:", currentTrackIndex);
				// Additional logic to play the selected track can go here
			}
		});

		// Other initialization code as needed
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