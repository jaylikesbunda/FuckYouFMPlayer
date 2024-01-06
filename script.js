$(document).ready(function() {
  var trackList = [
    { 
      name: "FuckYou FM",
      file: "https://audio.jukehost.co.uk/jdN2TbTn5tl8LDLklLVcpGjtPzkFfpRx",
      image: "https://lh3.googleusercontent.com/9AKnVhbmPuNCPRaV_MfYjTIxqW5XJwJ39qLG3PRB7Yim6loJICpvw3_jK5tdPmtLTelqRmhfY2OUX0Q-HKdF3a3tUTOftzn83uXRD6PeDIZh6nZuris1E4GAiny1UoFWVg=w1280"
    },
    { 
      name: "FuckYouFM: UTOPIA",
      file: "https://audio.jukehost.co.uk/SmFrnGF37HsQntp8DW74RAG1LYJboFHy",
      image: "https://lh5.googleusercontent.com/tBLFarPKk8cgabB-gvN6xEZRYv_8TYA_Wp5FyudPCLk7GBA1PC_IbtXIV6KVsIYiRhSpHd_haxlGimlgbEJvZ0H69dxqnU5tpKCsXFkTSUYaN8TMpnAvDSR7yPNLOCkq3w=w1280"
    },
    // Add more tracks with their respective images as needed
  ];

    // Populate track list
    function populateTrackList() {
        var trackSelection = $('#track-selection');
        trackList.forEach(function(track) {
            var trackItem = $('<a></a>')
                .addClass('track-item')
                .attr('href', '#')
                .attr('data-src', track.file)
                .attr('data-image', track.image)
                .text(track.name);
            trackSelection.append(trackItem);
        });
    }

    // Initialize the player
    function initializePlayer() {
        $("#jquery_jplayer_1").jPlayer({
            ready: function() {
                $(this).jPlayer("setMedia", {
                    mp3: trackList[0].file
                });
                $("#header-image").attr("src", trackList[0].image);
                updateMediaSession(trackList[0].name);
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
                    var percentage = (event.jPlayer.status.currentTime / event.jPlayer.status.duration) * 100;
                    $(".jp-play-bar").css("width", percentage + "%");
                }
            }
        });

        // Seeking functionality
        $(".jp-progress").on("mousedown mousemove mouseup", function(e) {
            if (e.type === 'mousedown') isSeeking = true;
            if (isSeeking) updateSeekPosition(e.pageX);
            if (e.type === 'mouseup') isSeeking = false;
        });

        function updateSeekPosition(pageX) {
            var progressContainer = $(".jp-progress");
            var position = pageX - progressContainer.offset().left;
            var width = progressContainer.width();
            var percentage = (position / width) * 100;
            $(".jp-play-bar").css("width", percentage + "%");
            $("#jquery_jplayer_1").jPlayer("playHead", percentage);
        }
    }

    // Update media session
    function updateMediaSession(trackName) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: trackName,
            });
        }
    }

    // Track selection
    $('#track-selection').on('click', '.track-item', function(e) {
        e.preventDefault();
        var trackFile = $(this).data('src');
        var trackImage = $(this).data('image');
        var trackName = $(this).text();
        $("#jquery_jplayer_1").jPlayer("setMedia", {
            mp3: trackFile
        }).jPlayer("play");
        $("#header-image").attr("src", trackImage);
        updateMediaSession(trackName);
        $('.track-item').removeClass('playing');
        $(this).addClass('playing');
    });

    // Volume controls
    $('.jp-volume-bar').click(function(e) {
        var volumeLevel = e.pageX - $(this).offset().left;
        var volumePercentage = volumeLevel / $(this).width();
        $("#jquery_jplayer_1").jPlayer("volume", volumePercentage);
    });

    $('.jp-mute').click(function() {
        $("#jquery_jplayer_1").jPlayer("mute");
    });

    $('.jp-unmute').click(function() {
        $("#jquery_jplayer_1").jPlayer("unmute");
    });

    // Responsive player
    $(window).resize(function() {
        $("#jquery_jplayer_1").jPlayer("option", "size", {
            width: "100%",
            height: "auto"
        });
    });

    // Initialize the track list and player
    populateTrackList();
    initializePlayer();
});