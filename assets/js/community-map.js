(function () {
  "use strict";

  // Community map on the home page. Reads organization data (name, city,
  // region, url, lat, lng, icon) from the embedded #affiliations-data
  // JSON script tag rather than an inline JS array, so the data stays in
  // _data/affiliated_organizations.yml as the single source of truth.
  // `icon` is pre-rendered HTML (index.html captures each org's
  // icon.html output at build time via Liquid, since this JS can't call
  // that include directly) — trusted, build-time-generated markup, safe
  // to inject via innerHTML.
  // Requires Leaflet (assets/vendor/leaflet/) to already be loaded.
  var mapEl = document.getElementById("affiliations-map");
  var dataEl = document.getElementById("affiliations-data");

  if (!mapEl || !dataEl || typeof L === "undefined") {
    return;
  }

  var organizations;
  try {
    organizations = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }

  if (!organizations || !organizations.length) {
    return;
  }

  // Explicit rather than relying on Leaflet's own stylesheet-scanning
  // auto-detection, which can miss a self-hosted (non-CDN) install.
  L.Icon.Default.prototype.options.imagePath = mapEl.getAttribute("data-marker-path");

  var map = L.map(mapEl, {
    scrollWheelZoom: false,
  });

  // Scoped to the continental US by default — most affiliated
  // organizations are US institutions, and fitting bounds to every
  // marker (including Eindhoven University of Technology, Netherlands)
  // would zoom out to a transatlantic view. The Eindhoven marker still
  // exists on the map; panning/zooming out reaches it.
  var US_BOUNDS = L.latLngBounds([24.396308, -125], [49.384358, -66.93457]);
  map.fitBounds(US_BOUNDS);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  // US state border lines, drawn under the markers. Data:
  // assets/data/us-states.geojson (vendored locally — see
  // PICKUP_AND_GO.md "Community map" for source/provenance).
  var statesUrl = mapEl.getAttribute("data-states-url");
  if (statesUrl) {
    fetch(statesUrl)
      .then(function (response) {
        return response.ok ? response.json() : null;
      })
      .then(function (geojson) {
        if (!geojson) {
          return;
        }
        L.geoJSON(geojson, {
          style: {
            color: "#767268", // matches --color-border-strong in style.css
            weight: 1,
            fillOpacity: 0,
          },
          interactive: false,
        }).addTo(map);
      })
      .catch(function () {
        // No state-border overlay if the fetch fails — the map (tiles,
        // markers, popups) still works fine without it.
      });
  }

  organizations.forEach(function (org) {
    var marker = L.marker([org.lat, org.lng]).addTo(map);
    var popup = document.createElement("div");
    popup.className = "community-map__popup";

    var link = document.createElement("a");
    link.href = org.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (org.icon) {
      var iconWrap = document.createElement("span");
      iconWrap.className = "community-map__popup-icon";
      iconWrap.innerHTML = org.icon;
      link.appendChild(iconWrap);
    }
    link.appendChild(document.createTextNode(org.name));
    popup.appendChild(link);

    popup.appendChild(document.createElement("br"));
    popup.appendChild(document.createTextNode(org.city + ", " + org.region));

    marker.bindPopup(popup);
  });
})();
