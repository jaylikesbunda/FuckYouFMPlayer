function sendNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Continue Listening?", {
        body: "Click here to keep enjoying our music stream!",
        icon: "/path/to/your/icon.png",
        tag: "continue-listening"
      });
  
      notification.onclick = function() {
        window.focus();
      };
    }
  }
  
  function sendNotificationForLiveMode() {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Live Mode is On!", {
        body: "Tap to keep listening to the next track.",
        icon: "/path/to/icon.png",
        tag: "live-mode-notification"
      });
  
      notification.onclick = function() {
        window.focus();
      };
    }
  }
  