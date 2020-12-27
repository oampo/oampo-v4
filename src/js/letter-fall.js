function letterFall(element) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.zIndex = -1;
  canvas.style.top = "0";
  canvas.style.left = "0";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");

  let filling = false;
  let clearing = false;
  let fillPosition = 0;
  let clearPositions = [];
  const deltaPosition = 8;

  let hue = 0;
  const deltaHue = 4;

  function render() {
    const canvasHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const canvasWidth = Math.max(
      document.body.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.clientWidth,
      document.documentElement.scrollWidth,
      document.documentElement.offsetWidth
    );

    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    const width = Math.floor(element.offsetWidth);
    const height = Math.floor(canvasHeight - element.offsetTop);
    const left = Math.floor(element.offsetLeft);
    const top = Math.floor(element.offsetTop);

    context.textBaseline = "top";
    context.font = "bold 40px 'League Spartan'";

    if (filling) {
      if (fillPosition > height) {
        filling = false;
      } else {
        context.fillStyle = `hsl(${hue}deg, 100%, 80%)`;
        for (let i = 0; i < deltaPosition; i++) {
          context.fillText("fun things", left, top + fillPosition + i);
          hue += deltaHue / deltaPosition;
          if (hue > 360) {
            hue %= 360;
          }
        }
        fillPosition += deltaPosition;
      }
    }

    if (clearPositions.length) {
      clearPositions = clearPositions.filter((position) => position < height);
      clearing = clearPositions.length > 0;

      for (let i = 0; i < clearPositions.length; i++) {
        context.fillStyle = "#F5F5F5";
        context.fillText("fun things", left, top + clearPositions[i]);
        context.clearRect(
          0,
          top + clearPositions[i],
          canvasWidth,
          deltaPosition
        );
        clearPositions[i] += deltaPosition;
      }
    }

    if (filling || clearing) {
      window.requestAnimationFrame(render);
    }
  }

  element.addEventListener("mouseover", () => {
    fillPosition = 0;
    if (!filling && !clearing) {
      window.requestAnimationFrame(render);
    }
    filling = true;
  });

  element.addEventListener("mouseout", () => {
    clearPositions.push(0);
    if (!filling && !clearing) {
      window.requestAnimationFrame(render);
    }
    clearing = true;
    filling = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("fun-things");
  letterFall(element);
});
