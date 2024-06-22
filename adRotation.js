function initializeAdRotation() {
    var adImages = [
      'https://i.ibb.co/N65mPsN/ezgif-com-resize.webp',
      'https://i.ibb.co/2Pm9DdV/luckyliners.webp',
      'https://i.ibb.co/FwMBKHK/Untitled-6.webp',
      'https://i.ibb.co/B2M8PXk/kinder-dark.webp',
      'https://i.ibb.co/7bnZbXP/Untitled-richerthanyou2.png',
      'https://i.ibb.co/RNMrM70/meet-singles-green-new1.png',
    ];
    var currentAdIndex = 0;
  
    function preloadAdImages(images) {
      images.forEach(function(imageUrl) {
        var img = new Image();
        img.src = imageUrl;
      });
    }
  
    function cycleAds() {
      var adContainer = $('#ddd-section');
      var adLink = adContainer.find('a');
      if (adLink.length === 0) {
        adLink = $('<a>', {
          href: "https://www.fuckyoudeki.net",
          target: "_blank"
        }).appendTo(adContainer);
      }
      var currentImg = adLink.find('img');
  
      function insertNewAdImg(src) {
        currentImg.remove();
        $('<img>', {
          src: src,
          alt: 'Ad',
          style: 'max-width: 100%; height: auto; display: none; aspect-ratio: 2.625 / 1;',
        }).appendTo(adLink).fadeIn('slow');
        currentAdIndex = (currentAdIndex + 1) % adImages.length;
      }
  
      if (currentImg.length) {
        currentImg.fadeOut('slow', function() {
          insertNewAdImg(adImages[currentAdIndex]);
        });
      } else {
        insertNewAdImg(adImages[currentAdIndex]);
      }
      setTimeout(cycleAds, 5000);
    }
  
    $(document).ready(function() {
      preloadAdImages(adImages);
      cycleAds();
    });
  }
  