(function () {
  "use strict";

  // Share menu. Prefers the native OS share sheet (Web Share API) where
  // available — that's the "pick where to share it" context window on
  // supporting browsers/devices. Falls back to a small custom popup menu
  // (X, Facebook, LinkedIn, Email, Copy Link) elsewhere, since there's no
  // backend here to build a real share-redirect service. Page-agnostic:
  // works anywhere a `[data-share-url]` button and the shared `#share-menu`
  // markup (see _includes/share-menu.html) both exist. Targets the data
  // attribute rather than a class so callers are free to style their own
  // trigger button however fits the context (see resource-item.html's
  // `.resource-share` icon button vs. deliverables.html's full `.button`).
  var shareButtons = document.querySelectorAll("[data-share-url]");
  var shareMenu = document.getElementById("share-menu");

  if (!shareButtons.length || !shareMenu) {
    return;
  }

  var shareTitle = document.getElementById("share-menu-title");
  var shareLinkX = document.getElementById("share-link-x");
  var shareLinkFacebook = document.getElementById("share-link-facebook");
  var shareLinkLinkedIn = document.getElementById("share-link-linkedin");
  var shareLinkEmail = document.getElementById("share-link-email");
  var shareLinkCopy = document.getElementById("share-link-copy");
  var activeShareButton = null;

  function closeShareMenu() {
    shareMenu.hidden = true;
    if (activeShareButton) {
      activeShareButton.setAttribute("aria-expanded", "false");
      activeShareButton.focus();
    }
    activeShareButton = null;
  }

  function openShareMenu(button) {
    var name = button.getAttribute("data-share-name");
    var url = button.getAttribute("data-share-url");

    shareTitle.textContent = "Share " + name;
    shareLinkX.href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(name);
    shareLinkFacebook.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
    shareLinkLinkedIn.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
    shareLinkEmail.href = "mailto:?subject=" + encodeURIComponent(name) + "&body=" + encodeURIComponent(url);

    shareLinkCopy.onclick = function () {
      var originalText = "Copy link";
      navigator.clipboard.writeText(url).then(function () {
        shareLinkCopy.lastChild.textContent = " Copied!";
        setTimeout(function () {
          shareLinkCopy.lastChild.textContent = " " + originalText;
        }, 1500);
      });
    };

    shareMenu.hidden = false;
    button.setAttribute("aria-expanded", "true");
    activeShareButton = button;

    var rect = button.getBoundingClientRect();
    shareMenu.style.top = window.scrollY + rect.bottom + 4 + "px";
    shareMenu.style.left = window.scrollX + rect.left + "px";

    var firstFocusable = shareMenu.querySelector("a, button");
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  shareButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();

      if (navigator.share) {
        navigator
          .share({
            title: button.getAttribute("data-share-name"),
            url: button.getAttribute("data-share-url"),
          })
          .catch(function () {
            // User cancelled the native share sheet, or it failed —
            // nothing to do, the page state is unchanged either way.
          });
        return;
      }

      if (activeShareButton === button) {
        closeShareMenu();
      } else {
        openShareMenu(button);
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!shareMenu.hidden && !shareMenu.contains(event.target)) {
      closeShareMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !shareMenu.hidden) {
      closeShareMenu();
    }
  });
})();
