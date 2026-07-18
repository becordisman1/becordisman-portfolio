(function () {
  'use strict';

  const TILE_OVERLAY_URL = 'img/pastel-yellow-vignette-concrete-textured-background.jpg';
  const HEADBOP_GIF_URL = 'https://media.giphy.com/media/5kcTeDZmTTAJnou50r/giphy.gif';
  const TILE_SIZE_DESKTOP = 180;
  const TILE_SIZE_MOBILE = 110;

  const media = [];
  const youtubeVideoIds = [
    'kR2UIZho_VE', 'IjZS93RC2vs', 'Z__IBnFvXsc', 'bXjj4z6xRCk', '3Xoo461mfTo',
    '9OTKNmpcF_Y', 'Vk0xDw7TeX4', 'xha2h2yx4xw', 'xha2h2yx4xw', 'XkkVpP37HP0',
    'pKlT4JFfBIA', 'AhRsS-Zf6Xk', 'l_ruOF1Fkwc', 'v=vAbfrGeBzPo', 'LraeyCS8wFc',
    'w7hH2jLhG7c', 'LB0rjI85gxo', 'hKQEzqEtIJE', 'Ed7LYXqXxzU', '-rqrJ_LhhJw',
    'L8pPbKv_hnw', 'Do4fg3QKgyM', 'n651mPxIWM4', 'onNPiPvv6zQ', 'n6pQQziLY0o',
    'b07k0KV-iA8', 'GpmHLBthiv4', 'eb8dZT7sKr0', 'z_-wJutuGBY', 'wuZh3pfPTYE',
    'e0aHM-tR25c', 'YW_nafDHPy4', 'RNrUWTENN2c', 'QOF0My1I9H0'
  ];

  for (let i = 0; i < youtubeVideoIds.length; i++) {
    media.push({ type: 'youtube', videoId: youtubeVideoIds[i] });
  }

  let soundEnabled = false;

  function showRandomMediaForScreen(videoId, videoSourceId, imgId) {
    const changeSound = document.getElementById('changeSound');
    const headbop = document.getElementById('headbop');

    function show() {
      if (changeSound && soundEnabled) {
        changeSound.currentTime = 0;
        changeSound.play().catch(() => {});
      }

      const randomIndex = Math.floor(Math.random() * media.length);
      const item = media[randomIndex];
      const video = document.getElementById(videoId);
      const videoSource = document.getElementById(videoSourceId);
      const img = document.getElementById(imgId);

      if (!video || !img) return;

      if (item.type === 'youtube') {
        if (headbop) headbop.style.display = 'none';

        let iframe = document.getElementById(videoId + '_iframe');
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.id = videoId + '_iframe';
          iframe.width = '100%';
          iframe.height = '100%';
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          video.parentNode.insertBefore(iframe, video);
        }

        const startTime = Math.floor(Math.random() * 120);
        iframe.src = `https://www.youtube.com/embed/${item.videoId}?autoplay=1&start=${startTime}&mute=0`;
        iframe.style.display = '';
        video.style.display = 'none';
        img.style.display = 'none';
      } else if (item.type === 'video') {
        if (headbop) headbop.style.display = 'none';

        const iframe = document.getElementById(videoId + '_iframe');
        if (iframe) iframe.style.display = 'none';

        if (videoSource) {
          videoSource.src = item.src;
          video.style.display = '';
          img.style.display = 'none';
          video.load();
          video.onloadedmetadata = function () {
            if (video.duration && !isNaN(video.duration)) {
              video.currentTime = Math.random() * video.duration;
            }
            video.muted = false;
            video.play().catch(() => {});
          };
        }
      } else {
        const iframe = document.getElementById(videoId + '_iframe');
        if (iframe) iframe.style.display = 'none';

        img.src = item.src;
        img.style.display = '';
        video.style.display = 'none';
      }

      const nextTime = (Math.floor(Math.random() * 33 + 6)) * 1000;
      setTimeout(show, nextTime);
    }

    show();
  }

  // Inject glitchy/virus-esque animation style for the armed button state
  function injectVirusStyle() {
    if (document.getElementById('virus-style-tag')) return;
    const style = document.createElement('style');
    style.id = 'virus-style-tag';
    style.textContent = `
      @keyframes virusFlash {
        0%   { background-color: #ff0033; box-shadow: 0 0 10px #ff0033, 0 0 20px #ff0033; }
        25%  { background-color: #00ff00; box-shadow: 0 0 10px #00ff00, 0 0 25px #00ff00; }
        50%  { background-color: #ff0033; box-shadow: 0 0 15px #ff0033, 0 0 30px #ff0033; }
        75%  { background-color: #000000; box-shadow: 0 0 10px #ff0033, 0 0 20px #ff0033; }
        100% { background-color: #ff0033; box-shadow: 0 0 10px #ff0033, 0 0 20px #ff0033; }
      }
      @keyframes virusJitter {
        0%   { transform: translate(0, 0) rotate(0deg); }
        20%  { transform: translate(-1px, 1px) rotate(-1deg); }
        40%  { transform: translate(1px, -1px) rotate(1deg); }
        60%  { transform: translate(-1px, -1px) rotate(-1deg); }
        80%  { transform: translate(1px, 1px) rotate(1deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }
      #playButton.virus-armed {
        animation: virusFlash 0.6s infinite, virusJitter 0.15s infinite;
        clip-path: polygon(10% 0%, 90% 5%, 100% 40%, 95% 100%, 60% 90%, 20% 100%, 0% 60%, 5% 20%);
        border: 2px solid #00ff00 !important;
        color: #fff !important;
        font-family: 'Courier New', monospace;
        text-shadow: 1px 1px 2px #000;
      }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('playButton');
    const movingButtonText = document.getElementById('movingButtonText');
    if (!playButton) return;

    let armed = false;

    function moveButtonRandomly() {
      const parent = playButton.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();
      const btnRect = playButton.getBoundingClientRect();
      const maxX = parentRect.width - btnRect.width;
      const maxY = parentRect.height - btnRect.height;
      const randX = Math.random() * maxX;
      const randY = Math.random() * maxY;
      playButton.style.left = randX + 'px';
      playButton.style.top = randY + 'px';
      playButton.style.transform = 'translate(0,0)';
    }

    playButton.addEventListener('mouseenter', moveButtonRandomly);
    playButton.addEventListener('click', function () {
      moveButtonRandomly();

      if (!armed) {
        armed = true;
        injectVirusStyle();
        playButton.classList.add('virus-armed');
        if (movingButtonText) movingButtonText.textContent = 'WARNING';
        console.log('[playButton] armed - click again to play');
        return;
      }

      console.log('[playButton] second click - playing');
      const changeSound = document.getElementById('changeSound');
      soundEnabled = true;
      if (changeSound) {
        changeSound.currentTime = 0;
        changeSound.play().catch(() => {});
      }

      setTimeout(() => {
        playButton.style.display = 'none';
        const buttonOverlay = document.getElementById('buttonOverlay');
        if (buttonOverlay) buttonOverlay.style.display = 'none';
        const headbopClick = document.getElementById('headbop');
        if (headbopClick && typeof restartHeadbopGif === 'function') {
          restartHeadbopGif();
        }
        showRandomMediaForScreen('randomVideo1', 'videoSource1', 'randomImage1');
      }, 300);
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formStatus = document.getElementById('formStatus');
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      const mailtoLink = `mailto:becord9000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoLink;

      formStatus.innerHTML = '<div class="alert alert-success">Opening your email client...</div>';
      setTimeout(() => {
        contactForm.reset();
        formStatus.innerHTML = '';
      }, 3000);
    });
  });
})();
console.clear();
if (typeof Splitting === 'function') {
  Splitting();
}
