function preloadTrackImages() {
    var otherPlacesBox = document.getElementById('other-places-box');
    var places = [
      { url: 'https://music.apple.com/au/album/f-u-fm-2/1731257521', img: 'https://i.ibb.co/nCqtTsq/Apple-Music-4.webp', alt: 'Apple Music' },
      { url: 'https://www.deezer.com/us/playlist/12386040983', img: 'https://i.ibb.co/PF1VCYb/6297981ce01809629f11358d.webp', alt: 'Deezer' },
      { url: 'https://open.spotify.com/playlist/4JtgKIx9yeoGG8YExRf9Ub?si=0724cb01a4ce446e', img: 'https://i.ibb.co/pwJMn08/6297981ce01809629fasdasda11358d.webp', alt: 'Spotify' },
    ];
    var otherPlacesContent = places.map(function(place) {
      return `<a href="${place.url}" target="_blank"><img src="${place.img}" alt="${place.alt}" style="width: 100px; height: auto; margin: 10px;"></a>`;
    }).join('');
    otherPlacesBox.innerHTML = otherPlacesContent;
  }
  
  function preloadSocialMediaLinks() {
    var socialMediaBox = document.getElementById('social-media-box');
    var socialMediaLinks = [
      { url: 'https://discord.gg/mWhBXcNATq', img: 'https://i.ibb.co/FxnLhYc/discordpng.png', alt: 'Discord' },
      { url: 'https://www.instagram.com/fuckyoucorp/', img: 'https://i.ibb.co/qCQK5f9/igpng.png', alt: 'Instagram' },
    ];
    var socialMediaContent = socialMediaLinks.map(function(link) {
      return `<a href="${link.url}" target="_blank"><img src="${link.img}" alt="${link.alt}" style="width: 32px; height: 32px; margin: 10px;"></a>`;
    }).join('');
    socialMediaBox.innerHTML = socialMediaContent;
  }
  