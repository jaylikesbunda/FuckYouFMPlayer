function initializePWAInstallation() {
    let deferredPrompt;
  
    function isAndroidDevice() {
      return /Android/i.test(navigator.userAgent);
    }
  
    function isIOSDevice() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
  
    function isRunningAsPWA() {
      return ('matchMedia' in window && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
    }
  
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      if (isAndroidDevice() && !isRunningAsPWA()) {
        deferredPrompt = e;
        showInstallButtonPopup();
      }
    });
  
    function showPopup(popupHTML) {
      $('body').append(popupHTML);
      $('.closePopup').on('click', () => {
        $('.popupContainer').remove();
      });
    }
  
    function showInstallButtonPopup() {
      let popupHTML = `
        <div class="popupContainer" style="position: fixed; inset: 10px; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.7); z-index: 1000;">
          <div style="position: relative; padding: 20px; max-width: 500px; background: #000; border: 2px solid #fff; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; font-family: 'Press Start 2P', cursive;">
            <p style="color: #fff; text-align: center; margin-bottom: 20px;">This feature is required for LIVE mode.</p>
            <button id="installButton" style="padding: 10px 20px; background: #000; color: #fff; border: 2px solid #fff; border-radius: 10px; cursor: pointer; font-family: 'Press Start 2P', cursive;">Install App</button>
            <button class="closePopup" style="margin-top: 0px; background: none; border: none; color: #fff; cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 24px; padding: 10px;">&#10005;</button>
          </div>
        </div>`;
      showPopup(popupHTML);
  
      $('#installButton').on('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          deferredPrompt = null;
          console.log(outcome === 'accepted' ? 'User accepted the install prompt' : 'User dismissed the install prompt');
          $('.popupContainer').remove();
        }
      });
    }
  
    function showImageBasedPWAInstallationPrompt() {
      if (isIOSDevice() && !isRunningAsPWA()) {
        let imageSrc = 'https://i.ibb.co/QKWKWWC/pwa-incentive-2-high-res.webp';
        let popupHTML = `
          <div class="popupContainer" style="position: fixed; inset: 10px; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div style="position: relative; padding: 12px; max-width: 500px; background: #000; border: 1px solid #fff; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center;">
              <img src="${imageSrc}" alt="Install App" style="max-width:95%; margin-bottom: 0px;">
              <button class="closePopup" style="margin-top: 0px; background: none; border: none; color: #fff; cursor: pointer; position: absolute; top: 5px; right: 10px; font-size: 24px; padding: 10px;">&#10005;</button>
            </div>
          </div>`;
        showPopup(popupHTML);
      }
    }
  
    setTimeout(showImageBasedPWAInstallationPrompt, 2000);
  }
  