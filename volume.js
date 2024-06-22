function initializeVolumeControl() {
    var volumeBar = $('.jp-volume-bar');
    var jPlayer = $("#jquery_jplayer_1");
    var isMuted = jPlayer.data().jPlayer && jPlayer.data().jPlayer.status.muted;
    var dragging = false;
  
    function isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  
    function setVolume(volumeLevel, updateMuteState = true) {
      $('.jp-volume-bar-value').width(volumeLevel * 100 + '%');
      jPlayer.jPlayer("volume", volumeLevel);
      if (updateMuteState) isMuted = volumeLevel === 0;
      updateVolumeUI(volumeLevel);
    }
  
    function updateVolumeUI(volumeLevel) {
      if (isMobileDevice()) {
        $('.jp-volume-controls').hide();
      } else {
        $('.jp-mute').toggle(isMuted || volumeLevel === 0);
        $('.jp-unmute').toggle(!isMuted && volumeLevel > 0);
      }
    }
  
    function handleVolumeChange(e) {
      if (!dragging) return;
      requestAnimationFrame(function() {
        var volumeBarOffset = volumeBar.offset().left;
        var volumeBarWidth = volumeBar.width();
        var pageX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
        var clickPositionX = pageX - volumeBarOffset;
        var volumeLevel = Math.max(0, Math.min(clickPositionX / volumeBarWidth, 1));
        setVolume(volumeLevel, false);
      });
    }
  
    volumeBar.on('mousedown touchstart', function(e) {
      if (isMobileDevice()) return;
      e.preventDefault();
      dragging = true;
      handleVolumeChange(e);
      $(document).on('mousemove.vol touchmove.vol', handleVolumeChange)
        .one('mouseup touchend', function() {
          dragging = false;
          $(document).off('.vol');
        });
    });
  
    function toggleMute() {
      isMuted = !isMuted;
      jPlayer.jPlayer(isMuted ? "mute" : "unmute");
      updateVolumeUI(isMuted ? 0 : jPlayer.data().jPlayer.options.volume);
    }
  
    $(document).ready(function() {
      var initialVolume = jPlayer.data().jPlayer ? jPlayer.data().jPlayer.options.volume : 0.8;
      if (isMobileDevice()) {
        $('.jp-volume-controls').hide();
      } else {
        setVolume(isMuted ? 0 : initialVolume, !isMuted);
      }
    });
  
    $('.jp-mute, .jp-unmute').click(toggleMute);
  }
  