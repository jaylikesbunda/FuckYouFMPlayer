$(document).ready(function() {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
          .then(reg => console.log('Service Worker Registered'))
          .catch(err => console.log('Service Worker Registration Failed', err));
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

  // Adjusting the event handler for the play button
    $(document).on('click', '.jp-play', function(e) {
      // Check if a track is selected by looking for a 'null' or 'undefined' currentTrackIndex
      if (currentTrackIndex === null || typeof currentTrackIndex === 'undefined' || currentTrackIndex < 0) {
        e.preventDefault(); // Prevent the default play action
        // Show the popup
        $('#track-select-popup').stop().fadeIn(500).delay(1500).fadeOut(500);
        console.log("Play button clicked without a track selected. currentTrackIndex:", currentTrackIndex);
      } else {
      // A track is selected, let the jPlayer handle the play action
        console.log("Playing track with index:", currentTrackIndex);
      }
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
		
		// Log the track being played
		console.log("Playing track:", track.name);
		
		// Load and play the specified track
		$("#jquery_jplayer_1").jPlayer("setMedia", {
			mp3: track.file
		}).jPlayer("play");
		
		// Preload the next track unless immediate playback is specified (e.g., for a manual track selection scenario)
		if (!isImmediate) {
			preloadTrack(index);
		}
		
		// Bind to the timeupdate event to prepare for the next track
		$("#jquery_jplayer_1").unbind($.jPlayer.event.timeupdate).bind($.jPlayer.event.timeupdate, function(event) {
			var remainingTime = event.jPlayer.status.duration - event.jPlayer.status.currentTime;
			if (remainingTime < 10) { // 10 seconds before the track ends, transition to the next
				playNextTrackInLiveMode();
			}
		});
	}


	function playNextTrackInLiveMode() {
		// Advance to the next track index, wrapping around if at the end of the track list
		var nextIndex = (currentTrackIndex + 1) % trackList.length;
		
		// Immediately play the next track to maintain the illusion of a continuous live stream
		playTrack(nextIndex, true); // Pass true to indicate immediate play, skipping additional preload
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
		// Clear previous highlights
		$('.track-item').removeClass('playing');

		// Define a default artist name or use a relevant identifier if applicable
		let artistName = "FY INDUSTRIES";

		// Check if a valid index is provided and handle track selection
		if (index !== undefined && index >= 0 && index < trackList.length) {
			currentTrackIndex = index;
			var track = trackList[index];

			// Reset event bindings
			$("#jquery_jplayer_1").unbind($.jPlayer.event.loadeddata)
								  .unbind($.jPlayer.event.ended)
								  .unbind($.jPlayer.event.timeupdate);

			// Set the media
			$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: track.file });

			if (isLive) {
				// Highlight the LIVE button for live mode
				$('#live-button').addClass('playing');
				$('.current-time, .duration').text('LIVE');
				bindLiveEvents(isFirstTrack);
			} else {
				// Highlight the selected track for standard mode
				let uiIndex = index + 1; // Adjust for LIVE button at the top
				$('.track-item').eq(uiIndex).addClass('playing');
				bindStandardEvents();
			}

			// Update cover art with track's image
			$("#header-image").attr("src", track.image);

			// Call updateMediaSession with the selected track's name and a common image link
			updateMediaSession(track.name, artistName);
		} else if (isLive) {
			// Handle live mode specifically if no track is selected
			$('#live-button').addClass('playing');
			$('.current-time, .duration').text('LIVE');
			bindLiveEvents(isFirstTrack);

			// Update media session for live broadcast without a specific track
			updateMediaSession("Live Broadcast", artistName);
		} else {
			// Handle case where no track is selected and not in live mode
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

	// Refactored code to update media session
	function updateMediaSessionWithTrackInfo(index, trackList, defaultGIF) {
		var trackName = index !== undefined ? trackList[index].name : '';
		var trackImage = index !== undefined ? trackList[index].image : defaultGIF;
		updateMediaSession(trackName, "FY INDUSTRIES", trackImage);
	}


	function updateMediaSession(trackName, artistName) {
		// Common image link for live and standard modes
		const imageLink = "https://i.ibb.co/7KjTdQ9/Untitled-1.png";

		if (isLiveMode) {
			// Prevent resetting metadata for each track change in live mode
			if (!window.liveModeInitialized) {
				window.liveModeInitialized = true;

				trackName = "Live Broadcast";
				artistName = "FY INDUSTRIES";

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
		} else {
			// Reset the flag when not in live mode
			window.liveModeInitialized = false;

			trackName = trackName || "No track selected";
			artistName = artistName || "FY INDUSTRIES";

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