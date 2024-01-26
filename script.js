$(document).ready(function() {
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
		var currentImg = adContainer.find('img');

		// If an image already exists, fade it out
		if (currentImg.length) {
			currentImg.addClass('fadeOut').on('animationend', function() {
				// Once fade-out is complete, change the image source and fade it in
				currentImg.off('animationend');
				currentImg.attr('src', adImages[currentAdIndex]).removeClass('fadeOut').addClass('fadeIn');

				// Update the index for the next ad
				currentAdIndex = (currentAdIndex + 1) % adImages.length;
			});
		} else {
			// If no image exists, insert the first ad image
			adContainer.html(`
				<a href="https://www.fuckyoudeki.net" target="_blank">
					<img src="${adImages[currentAdIndex]}" alt="Ad" style="max-width: 100%; height: auto;" class="fadeIn"/>
				</a>
			`);

			// Update the index for the next ad
			currentAdIndex = (currentAdIndex + 1) % adImages.length;
		}

		// Set the timer for the next ad transition
		setTimeout(cycleAds, 5000);
	}

	// Initialize ad rotation
	cycleAds();

	
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
	
	function playNextTrackInLiveMode() {
		// Select the next track in the list, or a random one if we've reached the end
		var nextIndex = (currentTrackIndex + 1) % trackList.length;
		selectTrack(nextIndex, true);
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
				selectTrack(0);
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

			// Wait for the media to be ready to play
			$("#jquery_jplayer_1").bind($.jPlayer.event.loadeddata, function(event) {
				if (isFirstTrack) {
					var duration = event.jPlayer.status.duration;
					var randomStartPosition = Math.random() * duration;
					$(this).jPlayer("play", randomStartPosition);
				} else {
					$(this).jPlayer("play"); // Play from the beginning for subsequent tracks
				}

				// Bind event for when the track ends
				$(this).bind($.jPlayer.event.ended, function() {
					playRandomTrack(currentTrackIndex); // Pass the current index to avoid repeating the same track
				});
			});
		} else {
			// Non-live mode: Start from the beginning
			isLiveMode = false;
			$('.track-item').removeClass('playing').eq(index).addClass('playing');

			// Play the track normally
			$("#jquery_jplayer_1").jPlayer("play");

			// Update time displays on time update event
			$("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) {
				var currentTime = event.jPlayer.status.currentTime;
				var duration = event.jPlayer.status.duration;
				$(".current-time").text(formatTime(currentTime));
				$(".duration").text(formatTime(duration - currentTime));
			});
		}

		$("#header-image").attr("src", track.image);
		updateMediaSession(track.name);
	}



    function updateMediaSession(trackName) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: trackName
            });
        }
    }

	function updateSeekBar(currentTime, duration) {
		var percentage = (currentTime / duration) * 100;
		$(".jp-play-bar").css("width", percentage + "%");
		
		// Check if it's LIVE mode
		if (isLiveMode) {
			$(".current-time").text('LIVE');
			$(".duration").text('LIVE');
		} else {
			$(".current-time").text(formatTime(currentTime));
			$(".duration").text(formatTime(duration - currentTime));
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