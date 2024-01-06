$(document).ready(function() {
    var isSeeking = false;
    var currentTrackIndex = 0;
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
        // Add more tracks as needed
    ];

    // Function to populate the track list in the UI
    function populateTrackList() {
        var trackSelection = $('#track-selection');
        trackList.forEach(function(track, index) {
            $('<a>', {
                'class': 'track-item',
                'href': '#',
                'data-index': index,
                'text': track.name,
                'click': function(e) {
                    e.preventDefault();
                    selectTrack(index);
                }
            }).appendTo(trackSelection);
        });
    }

    // Function to initialize the jPlayer
    function initializePlayer() {
        $("#jquery_jplayer_1").jPlayer({
            ready: function () {
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
            toggleDuration: true
        }).bind($.jPlayer.event.timeupdate, function(event) {
            if (!isSeeking) {
                var percentage = (event.jPlayer.status.currentTime / event.jPlayer.status.duration) * 100;
                $(".jp-play-bar").css("width", percentage + "%");
            }
        });

        // Seeking functionality
        $(".jp-progress").on("mousedown", function(e) {
            isSeeking = true;
            updateSeekPosition(e.pageX);
        }).on("mousemove", function(e) {
            if (isSeeking) {
                updateSeekPosition(e.pageX);
            }
        }).on("mouseup", function() {
            isSeeking = false;
        });

        // Adjust player size on window resize
        $(window).resize(function() {
            $("#jquery_jplayer_1").jPlayer("option", "size", {
                width: "100%",
                height: "auto"
            });
        });
    }

    // Function to handle track selection
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

    // Function to update the media session
    function updateMediaSession(trackName) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: trackName
            });
        }
    }

    // Function to update the seek position
    function updateSeekPosition(pageX) {
        var progressContainer = $(".jp-progress");
        var position = pageX - progressContainer.offset().left;
        var width = progressContainer.width();
        var percentage = (position / width) * 100;
        $(".jp-play-bar").css("width", percentage + "%");
        $("#jquery_jplayer_1").jPlayer("playHead", percentage);
    }

    // Volume control
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

    // Initialize the track list and player
    populateTrackList();
    initializePlayer();
});
