function initializeEventListeners() {
    var isSeeking = false;

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
            var progressContainer = $(".jp-progress");
            var progressBarWidth = progressContainer.width();
            var progressBarOffset = progressContainer.offset().left;
            var position = pageX - progressBarOffset;
            var percentage = (position / progressBarWidth) * 100;
            percentage = Math.max(0, Math.min(percentage, 100));
            $("#jquery_jplayer_1").jPlayer("playHead", percentage);
        }
    });

    $('#disclaimer-toggle').click(function() {
        $('#disclaimer-content').slideToggle('slow', function() {
            if ($('#disclaimer-content').is(":visible")) {
                $('#disclaimer-content').get(0).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    $('#other-places-toggle').click(function() {
        var otherPlacesBox = $('#other-places-box');
        if (otherPlacesBox.is(':visible')) {
            otherPlacesBox.hide();
        } else {
            otherPlacesBox.show();
            otherPlacesBox.get(0).scrollIntoView({ behavior: 'smooth' });
        }
    });

    $('#social-media-toggle').click(function() {
        var socialMediaBox = $('#social-media-box');
        if (socialMediaBox.is(':visible')) {
            socialMediaBox.hide();
        } else {
            socialMediaBox.show();
            socialMediaBox.get(0).scrollIntoView({ behavior: 'smooth' });
        }
    });

    $('.jp-play').on('click', function(e) {
        if (currentTrackIndex === null || typeof currentTrackIndex === 'undefined' || currentTrackIndex < 0) {
            e.preventDefault();
            var popupContent = "<div style='color: #fff; background-color: #000; padding: 5px; border-radius: 8px; text-align: center; max-width: 300px; margin: 20px auto;'>no track selected.</div>";
            $('#track-select-popup').html(popupContent).fadeIn(500).delay(3000).fadeOut(500);
        } else {
            console.log("Playing track with index:", currentTrackIndex);
        }
    });
}