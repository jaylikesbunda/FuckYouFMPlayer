$(document).ready(function() {
  var isSeeking = false;
  var currentTrackIndex = 0;
  var trackList = [
    { 
      name: "FuckYou FM",
      file: "https://audio.jukehost.co.uk/jdN2TbTn5tl8LDLklLVcpGjtPzkFfpRx",
      image: "https://i.ibb.co/NntjkN1/moshed-01-09-15-1-39.gif"
    },
    { 
      name: "FuckYou FM: UTOPIA",
      file: "https://audio.jukehost.co.uk/SmFrnGF37HsQntp8DW74RAG1LYJboFHy",
      image: "https://i.ibb.co/ssCCtXy/Untitlesaddasdasdcasfd-2.png"
    },
    { 
      name: "FuckYou FM 2: DEMO",
      file: "https://audio.jukehost.co.uk/IjxTCPVVoFcxZQ8QVVqnnLYXxOLOLQia",
      image: "https://i.ibb.co/NntjkN1/moshed-01-09-15-1-39.gif"
    },
  ];

  // Ad rotation functionality
  var adImages = [
    'https://i.ibb.co/6gV20KW/Untitled-3.gif',
    // Add more ad image links as needed
  ];

  var currentAdIndex = 0;

    function cycleAds() {
        $('#ad-section').html(`<img src="${adImages[currentAdIndex]}" alt="Ad" style="max-width: 100%; height: auto;"/>`);
        currentAdIndex = (currentAdIndex + 1) % adImages.length;
        setTimeout(cycleAds, 5000); // Rotate ads every 5 seconds
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
		$('.jp-volume-bar').on('click', function(e) {
			var volumeLevel = e.pageX - $(this).offset().left;
			var volumePercentage = volumeLevel / $(this).width();
			$("#jquery_jplayer_1").jPlayer("volume", volumePercentage);
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