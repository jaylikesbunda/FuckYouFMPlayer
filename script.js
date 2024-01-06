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
        var trackSelection = $('#track-selection');
        trackList.forEach(function(track, index) {
            $('<a>', {
                'class': 'track-item',
                'href': '#',
                'data-src': track.file,
                'data-image': track.image,
                'text': track.name,
                'click': function(e) {
                    e.preventDefault();
                    selectTrack(index);
                }
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

        $('.jp-progress').mousedown(function(e) {
            isSeeking = true;
            updateSeekBarPosition(e.pageX);
        }).mousemove(function(e) {
            if (isSeeking) {
                updateSeekBarPosition(e.pageX);
            }
        }).mouseup(function(e) {
            if (isSeeking) {
                isSeeking = false;
                updateSeekBarPosition(e.pageX);
            }
        }).on('touchstart', function(e) {
            e.preventDefault();
            isSeeking = true;
            updateSeekBarPosition(e.originalEvent.touches[0].pageX);
        }).on('touchmove', function(e) {
            if (isSeeking) {
                updateSeekBarPosition(e.originalEvent.touches[0].pageX);
            }
        }).on('touchend', function() {
            isSeeking = false;
        });

        // Volume control click
        $('.jp-volume-bar').click(function(e) {
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
        // Optional: Display current time and duration
        $(".current-time").text(formatTime(currentTime));
        $(".duration").text(formatTime(duration));
    }

    function updateSeekBarPosition(pageX) {
        var progressContainer = $(".jp-progress");
        var progressBarOffset = progressContainer.offset().left;
        var progressBarWidth = progressContainer.width();
        var position = pageX - progressBarOffset;
        var percentage = (position / progressBarWidth) * 100;
        $(".jp-play-bar").css("width", percentage + "%");
        $("#jquery_jplayer_1").jPlayer("playHead", percentage);
    }

    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    populateTrackList();
    initializePlayer();
});