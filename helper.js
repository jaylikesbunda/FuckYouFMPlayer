// Helper function to format time in MM:SS format
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// Function to update the seek bar based on current playback time
function updateSeekBar(currentTime, duration) {
    if (isLiveMode) {
        $(".jp-seek-bar, .jp-play-bar").css("width", "100%");
        $(".current-time, .duration").text('LIVE').show();
    } else {
        let percentage = (currentTime / duration) * 100;
        $(".jp-seek-bar").show();
        $(".jp-play-bar").css("width", percentage + "%");
        $(".current-time").text(formatTime(currentTime));
        $(".duration").text(formatTime(duration - currentTime));
    }
}

// Function to handle seek bar position updates based on user interaction
function updateSeekBarPosition(pageX) {
    if (!isLiveMode) {
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

// Function to sync the seek bar and playback time
function syncSeekBarAndTime(percentage) {
    if (!isLiveMode) {
        var duration = $("#jquery_jplayer_1").data("jPlayer").status.duration;
        var seekPosition = (percentage / 100) * duration;
        $("#jquery_jplayer_1").jPlayer("playHead", percentage);
    }
}

// Initialize event listeners for seek bar interaction
function initializeSeekBar() {
    var isSeeking = false;
    var lastUpdateTime = 0;

    // Throttle updates to avoid frequent updates
    function throttledUpdateSeekBar(currentTime, duration) {
        var now = Date.now();
        if (now - lastUpdateTime > 250) { // Update every 250ms
            updateSeekBar(currentTime, duration);
            lastUpdateTime = now;
        }
    }

    $('.jp-progress').on('mousedown touchstart', function(e) {
        isSeeking = true;
        var pageX = e.type === 'mousedown' ? e.pageX : e.originalEvent.touches[0].pageX;
        updateSeekBarPosition(pageX);
        e.preventDefault();
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
        }
    });

    $("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) {
        if (!isSeeking) {
            throttledUpdateSeekBar(event.jPlayer.status.currentTime, event.jPlayer.status.duration);
        }
    });
}

// Call this function to initialize the seek bar event listeners
initializeSeekBar();
