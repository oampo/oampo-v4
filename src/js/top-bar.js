function topBar(bar, turnerImage, bigJoeImage, turnerButton, bigJoeButton) {

  function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  let turnerOpen = false;
  let bigJoeOpen = false;
  let transitioning = false;

  bar.addEventListener("transitionstart", () => transitioning = true);
  bar.addEventListener("transitionend", () => transitioning = false);

  turnerButton.addEventListener("click", () => {
    if (transitioning) {
      return;
    }

    if (!turnerOpen && !bigJoeOpen) {
      bar.classList.add("top-bar-open");
      turnerOpen = true;
      bigJoeImage.classList.remove("top-bar-image-open");
      turnerImage.classList.add("top-bar-image-open");
      scrollToTop();
    } else if (turnerOpen) {
      bar.classList.remove("top-bar-open");
      turnerOpen = false;
    } else if (bigJoeOpen) {
      const callback = () => {
        bar.classList.add("top-bar-open");
        turnerOpen = true;
        bigJoeOpen = false;
        bigJoeImage.classList.remove("top-bar-image-open");
        turnerImage.classList.add("top-bar-image-open");
        bar.removeEventListener("transitionend", callback);
      };
      bar.addEventListener("transitionend", callback);
      bar.classList.remove("top-bar-open");
      scrollToTop();
    }
  });
  bigJoeButton.addEventListener("click", () => {
    if (transitioning) {
      return;
    }

    if (!turnerOpen && !bigJoeOpen) {
      bar.classList.add("top-bar-open");
      bigJoeOpen = true;
      turnerImage.classList.remove("top-bar-image-open");
      bigJoeImage.classList.add("top-bar-image-open");
      scrollToTop();
    } else if (bigJoeOpen) {
      bar.classList.remove("top-bar-open");
      bigJoeOpen = false;
    } else if (turnerOpen) {
      bar.classList.remove("top-bar-open");
      const callback = () => {
        bar.classList.add("top-bar-open");
        bigJoeOpen = true;
        turnerOpen = false;
        turnerImage.classList.remove("top-bar-image-open");
        bigJoeImage.classList.add("top-bar-image-open");
        bar.removeEventListener("transitionend", callback);
      };
      bar.addEventListener("transitionend", callback);
      bar.classList.remove("top-bar-open");
      scrollToTop();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const bar = document.getElementsByClassName("top-bar")[0];
  const turnerImage = document.getElementById("turner-image");
  const turnerButton = document.getElementById("turner-button");
  const bigJoeImage = document.getElementById("big-joe-image");
  const bigJoeButton = document.getElementById("big-joe-button");
  topBar(bar, turnerImage, bigJoeImage, turnerButton, bigJoeButton);
});
