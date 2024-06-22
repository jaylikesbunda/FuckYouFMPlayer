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
    file: "https://api.plwcse.top/api/get/889c6a63bb21354119d4965fc5e6ff3e",
    image: "https://i.ibb.co/0MkWY9n/ezgif-com-webp-maker-1.webp"
  },
  { 
    name: "FuckYou FM: UTOPIA",
    file: "https://audio.jukehost.co.uk/333kiycgY0x15kAmMujTkbtelYUEntpA",
    image: "https://i.ibb.co/QXb2VRT/ezgif-com-optiwebp-1.webp"
  },
];
// trackManage.js

function initializePlayer() {
    var throttledUpdateSeekBar = _.throttle(function(currentTime, duration) {
        var percentage = (currentTime / duration) * 100;
        $(".jp-play-bar").css("width", percentage + "%");
        $(".current-time").text(formatTime(currentTime));
        $(".duration").text(formatTime(duration - currentTime));
    }, 250);

    $("#jquery_jplayer_1").jPlayer({
        ready: function() {
            updateHeaderImage();
            $(this).jPlayer("setMedia", {
                title: "Your Media Title",
                mp3: "path/to/your/media.mp3"
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
            $("#jquery_jplayer_1").jPlayer("play");
        },
        ended: function() {
            console.log("Playback ended.");
        },
        play: function() {
            console.log("Playback started.");
        },
        pause: function() {
            console.log("Playback paused.");
        },
        stop: function() {
            console.log("Playback stopped.");
            $("#jquery_jplayer_1").jPlayer("clearMedia");
        },
        error: function(event) {
            console.error("jPlayer error: " + event.jPlayer.error.message);
        }
    });

    $(".jp-stop").click(function() {
        $("#jquery_jplayer_1").jPlayer("clearMedia");
        $(".jp-play-bar").css("width", "0%");
        $(".current-time").text("00:00");
        $(".duration").text("00:00");
    });
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Other functions related to track management can be added here

function populateTrackList() {
  const trackSelection = $('#track-selection');

  $('<a>', {
    id: 'live-button',
    class: 'track-item live-track',
    href: '#',
    text: 'LIVE'
  }).on('click', function(e) {
    e.preventDefault();
    activateLiveMode();
    playRandomTrack(-1, true);
    $('.track-item').removeClass('playing');
    $(this).addClass('playing');
  }).prependTo(trackSelection);

  trackList.forEach((track, index) => {
    $('<a>', {
      class: 'track-item',
      href: '#',
      'data-src': track.file,
      'data-image': track.image,
      text: track.name,
      'data-index': index
    }).on('click', function(e) {
      e.preventDefault();
      const index = $(this).data('index');
      selectTrack(index);
    }).appendTo(trackSelection);
  });
}



function updateHeaderImage(trackImage) {
    var defaultImage = "https://i.ibb.co/QXb2VRT/ezgif-com-optiwebp-1.webp"; // Default GIF when no track is selected
    $("#header-image").attr("src", trackImage || defaultImage);
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
  var nextIndex = (index + 1) % trackList.length;
  var nextTrack = trackList[nextIndex];
  console.log("Preloading track:", nextTrack.name);
  $("#jquery_jplayer_1").jPlayer("setMedia", {
    mp3: nextTrack.file
  });
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
    if (remainingTime < 10) {
      playNextTrackInLiveMode();
    }
  });
}

function handleNoTrackSelected() {
  var defaultGIF = "https://i.ibb.co/QXb2VRT/ezgif-com-optiwebp-1.webp";
  $("#header-image").attr("src", defaultGIF);
  $("#jquery_jplayer_1").jPlayer("clearMedia");
  $('.track-item').removeClass('playing');
  $('.current-time, .duration').text('--:--');
}

function playNextTrackInLiveMode() {
  var nextIndex = (currentTrackIndex + 1) % trackList.length;
  if (document.hidden) {
    sendNotificationForLiveMode();
  }
  playTrack(nextIndex, true);
}

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
      updateMediaSession("Live Broadcast", "FUCKYOU CORP");
      $("#jquery_jplayer_1").jPlayer("play");
    } else {
      let uiIndex = index + 1;
      $('.track-item').eq(uiIndex).addClass('playing');
      bindStandardEvents();
      updateMediaSessionWithTrackInfo(index);
    }
    $("#header-image").attr("src", track.image);
  } else {
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

function updateMediaSessionWithTrackInfo(index) {
  if (index !== undefined && index >= 0 && index < trackList.length) {
    var track = trackList[index];
    updateMediaSession(track.name, "FUCKYOU CORP");
  } else {
    updateMediaSession("No track selected", "FUCKYOU CORP");
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

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: trackName || "No track selected",
      artist: artistName || "FUCKYOU CORP",
      artwork: artwork
    });

    navigator.mediaSession.setActionHandler('play', () => $("#jquery_jplayer_1").jPlayer("play"));
    navigator.mediaSession.setActionHandler('pause', () => $("#jquery_jplayer_1").jPlayer("pause"));
    navigator.mediaSession.setActionHandler('previoustrack', () => {});
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playNextTrackInLiveMode();
    });
  }
}
