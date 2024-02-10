$(document).ready(function() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
          .then(reg => console.log('Service Worker Registered'))
          .catch(err => console.log('Service Worker Registration Failed', err));
  }
    
  var isLiveMode = false;
  var isSeeking = false;
  var currentTrackIndex = 0;
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
      image: "https://i.ibb.co/cDG2Mcz/fuckyoufm-22.gif"
    },
  ];

	// Ad rotation functionality
	var adImages = [
		'https://i.ibb.co/6gV20KW/Untitled-3.gif',
		'https://i.ibb.co/R49K61Q/Untitled-5.png',
		'https://i.ibb.co/M2k4nh6/Untitled-6.png',
		// Add more ad image links as needed
	];

	var currentAdIndex = 0;

	function cycleAds() {
		var adContainer = $('#ddd-section');
		var adLink = adContainer.find('a');

		// Ensure there's an <a> tag inside adContainer; if not, create it
		if (adLink.length === 0) {
			adLink = $('<a>', {
				href: "https://www.fuckyoudeki.net",
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

	// Initialize ad rotation
	$(document).ready(function() {
		cycleAds();
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
		}).on('click', (e) => {
			e.preventDefault();
			activateLiveMode();
		}).prependTo(trackSelection);

		// Add other tracks to the list
		trackList.forEach((track, index) => {
			$('<a>', {
				'class': 'track-item',
				'href': '#',
				'data-src': track.file,
				'data-image': track.image,
				'text': track.name
			}).on('click', (e) => {
				e.preventDefault();
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
		var nextTrack = trackList[index];
		console.log("Preloading track:", nextTrack.name);
		// This example assumes the player can preload by setting a 'preload' source
		// Adjust based on your player's API
		$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: nextTrack.file }).jPlayer("load");
	}

	function playNextTrackInLiveMode() {
		var nextIndex = (currentTrackIndex + 1) % trackList.length;
		// Preload the next track
		preloadTrack(nextIndex);
		// Delay actual play to give time for preload - adjust based on actual needs
		setTimeout(function() {
			selectTrack(nextIndex, true);
		}, 100); // 100ms delay for demonstration purposes
	}

	function playAllTracksSequentially(index) {
		if (index >= trackList.length) {
			index = 0; // Loop back to the first track
		}
		selectTrack(index, true); // The second parameter indicates it's from LIVE mode

		$("#jquery_jplayer_1").unbind($.jPlayer.event.ended).bind($.jPlayer.event.ended, function() {
			playAllTracksSequentially(index + 1); // Play the next track after the current one ends
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
				if (!isSeeking) {
					var currentTime = event.jPlayer.status.currentTime;
					var duration = event.jPlayer.status.duration;
					var percentage = (currentTime / duration) * 100;

					// Update the seek bar
					$(".jp-play-bar").css("width", percentage + "%");

					// Update the time display
					$(".current-time").text(formatTime(currentTime));
					$(".duration").text(formatTime(duration - currentTime));
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
				$('#disclaimer-content').slideToggle('slow'); // 'fast' can be changed to 'slow' or specific milliseconds
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


		// Volume control
		$('.jp-volume-bar').on('mousedown', function(e) {
			var volumeBar = $(this);
			var updateVolume = function(e) {
				var volumeBarOffset = volumeBar.offset();
				var volumeBarWidth = volumeBar.width();
				var clickPositionX = e.pageX - volumeBarOffset.left;
				var volumeLevel = clickPositionX / volumeBarWidth;
				volumeLevel = Math.max(0, Math.min(volumeLevel, 1)); // Ensure within 0-1 range
				$('.jp-volume-bar-value').width(volumeLevel * 100 + '%');
				$("#jquery_jplayer_1").jPlayer("volume", volumeLevel);
			};

			updateVolume(e);

			$(document).on('mousemove.vol', function(e) {
				updateVolume(e);
			}).on('mouseup.vol', function() {
				$(document).off('.vol');
			});

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
		// Check if a valid index is provided
		if (index !== undefined && index >= 0 && index < trackList.length) {
			currentTrackIndex = index;
			var track = trackList[index];

			// Reset event bindings
			$("#jquery_jplayer_1").unbind($.jPlayer.event.loadeddata).unbind($.jPlayer.event.ended).unbind($.jPlayer.event.timeupdate);

			// Set the media
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: track.file });

			if (isLive) {
				// Highlight LIVE button and display 'LIVE' instead of time
				$('.track-item').removeClass('playing');
				$('#live-button').addClass('playing');
				$('.current-time, .duration').text('LIVE');

				$("#jquery_jplayer_1").bind($.jPlayer.event.loadeddata, function(event) {
					var duration = event.jPlayer.status.duration;
					var randomStartPosition = isFirstTrack ? Math.random() * duration : 0;
					$(this).jPlayer("play", randomStartPosition);

					$(this).bind($.jPlayer.event.ended, function() {
						playRandomTrack(currentTrackIndex);
					});
				});
			} else {
				// Non-live mode: Start from the beginning
				$('.track-item').removeClass('playing').eq(index).addClass('playing');
				$("#jquery_jplayer_1").jPlayer("play");

				$("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) {
					var currentTime = event.jPlayer.status.currentTime;
					var duration = event.jPlayer.status.duration;
					$(".current-time").text(formatTime(currentTime));
					$(".duration").text(formatTime(duration - currentTime));
				});
			}

			// Update cover art with track's image
			$("#header-image").attr("src", track.image);
		} else {
			// No track is selected, show default GIF
			var defaultGIF = "https://i.ibb.co/fHDSnRP/fuckyoufm-1.gif";
			$("#header-image").attr("src", defaultGIF);
			// Ensure no track is playing
			$("#jquery_jplayer_1").jPlayer("clearMedia");
			// Update UI to reflect no selection
			$('.track-item').removeClass('playing');
			$('.current-time, .duration').text('--:--');
		}

		// This function needs to be called regardless of whether a track is selected or not
		updateMediaSession(index !== undefined ? trackList[index].name : '', "FY INDUSTRIES", index !== undefined ? trackList[index].image : defaultGIF);
	}

	function updateMediaSession(trackName, artistName, imageLink) {
		// Adjust parameters for live mode
		if (isLiveMode) {
			// Check if live mode is already initialized to avoid resetting metadata unnecessarily
			if (!window.liveModeInitialized) {
				// Mark live mode as initialized to prevent further updates
				window.liveModeInitialized = true;

				// Set live-specific metadata
				trackName = "Live Broadcast";
				artistName = "FY INDUSTRIES Live";
				imageLink = imageLink || "https://i.ibb.co/7KjTdQ9/Untitled-1.png"; // Fallback to a default live image if none provided

				navigator.mediaSession.metadata = new MediaMetadata({
					title: trackName,
					artist: artistName,
					artwork: [
						{ src: imageLink, sizes: '96x96', type: 'image/png' },
						{ src: imageLink, sizes: '128x128', type: 'image/png' },
						{ src: imageLink, sizes: '192x192', type: 'image/png' },
						{ src: imageLink, sizes: '256x256', type: 'image/png' },
						{ src: imageLink, sizes: '384x384', type: 'image/png' },
						{ src: imageLink, sizes: '512x512', type: 'image/png' },
					]
				});
			}
			// No else block here to avoid resetting metadata every time a new track starts in live mode
		} else {
			// Reset the live mode initialization flag when not in live mode
			window.liveModeInitialized = false;

			// Define default values for parameters if not in live mode
			trackName = trackName || "No track selected";
			artistName = artistName || "FY INDUSTRIES";
			imageLink = imageLink || "https://i.ibb.co/7KjTdQ9/Untitled-1.png"; // Default image link if none provided

			navigator.mediaSession.metadata = new MediaMetadata({
				title: trackName,
				artist: artistName,
				artwork: [
					{ src: imageLink, sizes: '96x96', type: 'image/png' },
					{ src: imageLink, sizes: '128x128', type: 'image/png' },
					{ src: imageLink, sizes: '192x192', type: 'image/png' },
					{ src: imageLink, sizes: '256x256', type: 'image/png' },
					{ src: imageLink, sizes: '384x384', type: 'image/png' },
					{ src: imageLink, sizes: '512x512', type: 'image/png' },
				]
			});
		}

		// Setup or reset action handlers
		navigator.mediaSession.setActionHandler('play', () => $("#jquery_jplayer_1").jPlayer("play"));
		navigator.mediaSession.setActionHandler('pause', () => $("#jquery_jplayer_1").jPlayer("pause"));
		navigator.mediaSession.setActionHandler('previoustrack', () => {
			// Implement previous track logic here for live mode if applicable
		});
		navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrackInLiveMode());
	}






	function updateSeekBar(currentTime, duration) {
		if (isLiveMode) {
			// Hide seek bar and time indicators in live mode
			$(".jp-seek-bar").hide(); // Assuming you have a seek bar class to hide
			$(".jp-play-bar").css("width", "100%"); // You might choose to keep this full or hide it too
			$(".current-time, .duration").text('LIVE').hide(); // Optionally hide these if you prefer
		} else {
			// Show and update seek bar in non-live mode
			$(".jp-seek-bar").show(); // Show the seek bar again when not in live mode
			$(".jp-play-bar").css("width", percentage + "%");
			$(".current-time").text(formatTime(currentTime)).show();
			$(".duration").text(formatTime(duration - currentTime)).show();
		}
	}



	function updateSeekBarPosition(pageX) {
		var progressContainer = $(".jp-progress");
		var progressBarWidth = progressContainer.width();
		var progressBarOffset = progressContainer.offset().left;
		var position = pageX - progressBarOffset;
		var percentage = (position / progressBarWidth) * 100;
		percentage = Math.max(0, Math.min(percentage, 100));

		// Update the seek bar's width
		$(".jp-play-bar").css("width", percentage + "%");

		// Temporarily update the time display with the seek bar's position
		syncSeekBarAndTime(percentage, true);
	}
	function syncSeekBarAndTime(percentage, isTemporary) {
		var duration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
		var currentTime = duration * (percentage / 100);

		// Update the time display only if it's a temporary change (user interaction)
		if (isTemporary) {
			updateSeekBar(currentTime, duration);
		} else {
			// Update the playback head only if the change is permanent (after user interaction ends)
			$("#jquery_jplayer_1").jPlayer("playHead", percentage);
		}
	}


	// Additional helper function for formatting time
	function formatTime(seconds) {
		var minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}

    populateTrackList();
    initializePlayer();
});