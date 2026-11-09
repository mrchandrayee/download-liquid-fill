const buttons = [...document.querySelectorAll('[data-download]')];
const hint = document.getElementById('hint');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function setProgress(button, value) {
  button.style.setProperty('--p', String(value));
}

async function animateDownload(button) {
  if (button.dataset.busy === 'true') return;
  button.dataset.busy = 'true';
  button.classList.remove('is-working', 'is-done');
  setProgress(button, 0);
  hint.textContent = 'Downloading…';

  await wait(80);
  button.classList.add('is-working');

  // Smooth progress curve: quick start, slower finish, then liquid settles.
  const duration = 1850;
  const start = performance.now();
  await new Promise(resolve => {
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(button, eased);
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });

  setProgress(button, 1);
  button.classList.remove('is-working');
  button.classList.add('is-done');
  hint.textContent = 'Download complete — click any button to replay.';
  button.dataset.busy = 'false';
}

buttons.forEach(button => button.addEventListener('click', () => animateDownload(button)));
