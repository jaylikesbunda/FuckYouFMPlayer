$(document).ready(function() {
  var isSeeking = false;
  var currentTrackIndex = 0;
  var trackList = [
    { 
      name: "FuckYou FM",
      file: "https://audio.jukehost.co.uk/jdN2TbTn5tl8LDLklLVcpGjtPzkFfpRx",
      image: "https://i.ibb.co/2M3nVrp/348368204-1030155491281535-6750310068sdfsdff33836061-n.jpg"
    },
    { 
      name: "FuckYouFM: UTOPIA",
      file: "https://audio.jukehost.co.uk/SmFrnGF37HsQntp8DW74RAG1LYJboFHy",
      image: "https://i.ibb.co/ssCCtXy/Untitlesaddasdasdcasfd-2.png"
    },
    // Add more tracks with their respective images as needed
  ];

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
					updateSeekBar(event.jPlayer.status.currentTime, event.jPlayer.status.duration);
				}
			}
		});

		// Consolidate progress bar event handlers
		$('.jp-progress').on('mousedown touchstart', function(e) {
			isSeeking = true;
			// Determine the location of the event
			var pageX = e.type === 'mousedown' ? e.pageX : e.originalEvent.touches[0].pageX;
			updateSeekBarPosition(pageX);
		}).on('mousemove touchmove', function(e) {
			if (isSeeking) {
				var pageX = e.type === 'mousemove' ? e.pageX : e.originalEvent.touches[0].pageX;
				updateSeekBarPosition(pageX);
			}
		}).on('mouseup touchend', function(e) {
			if (isSeeking) {
				isSeeking = false;
				// For mouseup, we update the position one last time
				if (e.type === 'mouseup') {
					updateSeekBarPosition(e.pageX);
				}
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
		// Ensure the percentage is between 0 and 100
		percentage = Math.max(0, Math.min(percentage, 100));
		$(".jp-play-bar").css("width", percentage + "%");
		$("#jquery_jplayer_1").jPlayer("playHead", percentage);
		// Synchronize the time display with the seek bar's position
		syncSeekBarAndTime(percentage);
	  }

	  // Synchronizes the seek bar and the displayed time
	  function syncSeekBarAndTime(percentage) {
		var duration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
		var currentTime = duration * (percentage / 100);
		updateSeekBar(currentTime, duration);
	  }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    populateTrackList();
    initializePlayer();
});