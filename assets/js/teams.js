(function () {
  "use strict";

  var searchInput = document.getElementById("teams-search");
  var status = document.getElementById("teams-count");
  var cards = document.querySelectorAll(".teams-card");

  if (searchInput && cards.length) {
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matches = !query || card.textContent.toLowerCase().indexOf(query) !== -1;
        card.hidden = !matches;
        if (matches) {
          visibleCount++;
        }
      });

      if (status) {
        status.textContent = query
          ? visibleCount + " team" + (visibleCount === 1 ? "" : "s") + " found"
          : "";
      }
    });
  }

  var jumpSelect = document.getElementById("teams-jump");

  if (jumpSelect) {
    jumpSelect.addEventListener("change", function () {
      var targetId = jumpSelect.value;
      if (!targetId) {
        return;
      }
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      jumpSelect.selectedIndex = 0;
    });
  }
})();
