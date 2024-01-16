$(document).ready(function() {
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


    function selectTrack(index) {
        currentTrackIndex = index;
        var track = trackList[index];
        $("#jquery_jplayer_1").jPlayer("setMedia", {
            mp3: track.file
        }).jPlayer("play");
        $("#header-image").attr("src", track.image);
        updateMediaSession(track.name);
        $('.track-item').removeClass('playing').eq(index).addClass('playing');
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
		$(".current-time").text(formatTime(currentTime));
		$(".duration").text(formatTime(duration - currentTime));
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


    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    populateTrackList();
    initializePlayer();
});