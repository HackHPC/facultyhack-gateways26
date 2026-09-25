(function () {
  "use strict";

  var track = document.getElementById("gallery-carousel-track");
  var slides = track ? Array.prototype.slice.call(track.children) : [];

  if (!track || !slides.length) {
    return;
  }

  var prevButton = document.getElementById("gallery-prev");
  var nextButton = document.getElementById("gallery-next");
  var playPauseButton = document.getElementById("gallery-play-pause");
  var status = document.getElementById("gallery-status");
  var thumbButtons = document.querySelectorAll("[data-gallery-index]");
  var carousel = document.querySelector(".gallery-carousel");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var AUTOPLAY_DELAY = 6000;
  var currentIndex = 0;
  var timer = null;
  var playing = !prefersReducedMotion;

  function updateStatus() {
    if (status) {
      status.textContent = "Photo " + (currentIndex + 1) + " of " + slides.length;
    }
  }

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

    slides.forEach(function (slide, i) {
      if (i === currentIndex) {
        slide.setAttribute("aria-current", "true");
      } else {
        slide.removeAttribute("aria-current");
      }
    });

    thumbButtons.forEach(function (button) {
      var isActive = Number(button.getAttribute("data-gallery-index")) === currentIndex;
      button.classList.toggle("gallery-thumbnails__button--active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });

    updateStatus();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    timer = window.setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function setPlaying(next) {
    playing = next;
    if (playPauseButton) {
      var icon = playPauseButton.querySelector("i");
      playPauseButton.setAttribute("aria-pressed", playing ? "false" : "true");
      playPauseButton.querySelector(".visually-hidden").textContent = playing
        ? "Pause automatic rotation"
        : "Resume automatic rotation";
      if (icon) {
        icon.className = playing ? "fa-solid fa-pause" : "fa-solid fa-play";
      }
    }
    if (playing) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  }

  if (prevButton) {
    prevButton.addEventListener("click", function () {
      prev();
      if (playing) {
        startAutoplay();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      next();
      if (playing) {
        startAutoplay();
      }
    });
  }

  if (playPauseButton) {
    playPauseButton.addEventListener("click", function () {
      setPlaying(!playing);
    });
  }

  thumbButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      goTo(Number(button.getAttribute("data-gallery-index")));
      carousel.scrollIntoView({ behavior: "smooth", block: "start" });
      if (playing) {
        startAutoplay();
      }
    });
  });

  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", function () {
      if (playing) {
        startAutoplay();
      }
    });
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", function () {
      if (playing) {
        startAutoplay();
      }
    });
  }

  goTo(0);
  setPlaying(playing);
})();
