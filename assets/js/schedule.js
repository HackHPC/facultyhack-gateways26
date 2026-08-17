(function () {
  "use strict";

  var searchInput = document.getElementById("schedule-search");
  var status = document.getElementById("schedule-count");
  var cards = document.querySelectorAll("#virtual-sessions-timeline .schedule-block");

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
          ? visibleCount + " session" + (visibleCount === 1 ? "" : "s") + " found"
          : "";
      }
    });
  }

  var jumpSelect = document.getElementById("schedule-jump");

  if (jumpSelect) {
    jumpSelect.addEventListener("change", function () {
      var targetId = jumpSelect.value;
      if (!targetId) {
        return;
      }
      var target = document.getElementById(targetId);
      if (target) {
        target.hidden = false;
        target.setAttribute("open", "");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      jumpSelect.selectedIndex = 0;
    });
  }
})();
