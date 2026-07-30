(function () {
  "use strict";

  var openBtn = document.getElementById("readme-template-open");
  var dialog = document.getElementById("readme-template-dialog");

  if (!openBtn || !dialog) {
    return;
  }

  var closeBtn = document.getElementById("readme-template-dialog-close");
  var copyBtn = document.getElementById("readme-template-copy");
  var copyLabel = document.getElementById("readme-template-copy-label");
  var codeEl = document.getElementById("readme-template-code");

  openBtn.addEventListener("click", function () {
    dialog.showModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });
  }

  // Native <dialog> already closes on Escape; this adds click-outside
  // (on the backdrop) to close too. A click lands with target === dialog
  // only when it's on the dialog element's own box (the backdrop area),
  // never when it bubbles up from a child, so this can't misfire from
  // clicks inside the card.
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  if (copyBtn && copyLabel && codeEl) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(codeEl.textContent).then(function () {
        var original = copyLabel.textContent;
        copyLabel.textContent = "Copied!";
        setTimeout(function () {
          copyLabel.textContent = original;
        }, 1500);
      });
    });
  }
})();
