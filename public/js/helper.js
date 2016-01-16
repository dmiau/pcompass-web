function rad(x) {
  return x * Math.PI / 180;
};

function clearAllCtx() {
  ctxCompass.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxWedge.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxFOV.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctxLabels.clearRect(0, 0, window.innerWidth, window.innerHeight);
}