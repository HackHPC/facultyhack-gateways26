(function () {
  "use strict";

  var searchInput = document.getElementById("resource-search");
  var jumpSelect = document.getElementById("resource-jump");
  var status = document.getElementById("resource-count");
  var items = document.querySelectorAll(".resource-item");
  var categories = document.querySelectorAll(".resource-category");

  if (!searchInput || !items.length) {
    return;
  }

  function filterResources() {
    var query = searchInput.value.trim().toLowerCase();
    var visibleCount = 0;

    items.forEach(function (item) {
      var matches = !query || item.textContent.toLowerCase().indexOf(query) !== -1;
      item.hidden = !matches;
      if (matches) {
        visibleCount++;
      }
    });

    categories.forEach(function (section) {
      var hasVisibleItem = section.querySelectorAll(".resource-item:not([hidden])").length > 0;
      section.hidden = query.length > 0 && !hasVisibleItem;
    });

    if (status) {
      status.textContent = query
        ? visibleCount + " resource" + (visibleCount === 1 ? "" : "s") + " found"
        : "";
    }
  }

  searchInput.addEventListener("input", filterResources);

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
