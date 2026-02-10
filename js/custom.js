(function () {
  'use strict';

  const GIF_TILE_URL = 'https://media.giphy.com/media/5kcTeDZmTTAJnou50r/giphy.gif';
  const TILE_SIZE_DESKTOP = 180;
  const TILE_SIZE_MOBILE = 110;

  function getTileSize() {
    return window.innerWidth <= 576 ? TILE_SIZE_MOBILE : TILE_SIZE_DESKTOP;
  }

  function buildGifTileGrid() {
    const existingGrid = document.querySelector('.gif-tile-grid');
    if (existingGrid) {
      existingGrid.remove();
    }

    const grid = document.createElement('div');
    grid.className = 'gif-tile-grid';

    const tileSize = getTileSize();
    const columns = Math.ceil(window.innerWidth / tileSize);
    const rows = Math.ceil(window.innerHeight / tileSize);
    grid.style.gridTemplateColumns = `repeat(${columns}, ${tileSize}px)`;
    grid.style.gridAutoRows = `${tileSize}px`;

    const totalTiles = columns * rows;
    for (let i = 0; i < totalTiles; i += 1) {
      const tile = document.createElement('div');
      tile.className = 'gif-tile';
      tile.style.backgroundImage = `url("${GIF_TILE_URL}")`;
      tile.style.setProperty('--hue-offset', `${Math.floor(Math.random() * 360)}deg`);
      tile.style.setProperty('--hue-duration', `${(6 + Math.random() * 14).toFixed(2)}s`);
      tile.style.setProperty('--hue-delay', `${(-Math.random() * 10).toFixed(2)}s`);
      grid.appendChild(tile);
    }

    document.body.prepend(grid);
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildGifTileGrid();

    let resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildGifTileGrid, 150);
    });
  });

  // YouTube video IDs array - add your YouTube video IDs here
  const media = [];
  const youtubeVideoIds = [
    'kR2UIZho_VE', // Example - replace with your actual video IDs
    'IjZS93RC2vs',
    'Z__IBnFvXsc',
    'bXjj4z6xRCk',
    '3Xoo461mfTo',
    '9OTKNmpcF_Y',
    'Vk0xDw7TeX4',
    'xha2h2yx4xw',
    'xha2h2yx4xw',
    'XkkVpP37HP0',
    'pKlT4JFfBIA',
    'AhRsS-Zf6Xk',
    'l_ruOF1Fkwc',
    'v=vAbfrGeBzPo',
    'LraeyCS8wFc',
    'w7hH2jLhG7c',
    'LB0rjI85gxo',
    'hKQEzqEtIJE',
    'Ed7LYXqXxzU',
    '-rqrJ_LhhJw',
    'L8pPbKv_hnw',
    'Do4fg3QKgyM',
    'n651mPxIWM4',
    'onNPiPvv6zQ',
    'n6pQQziLY0o',
    'b07k0KV-iA8',
    'GpmHLBthiv4',
    'eb8dZT7sKr0',
    'z_-wJutuGBY',
    'wuZh3pfPTYE',
    'e0aHM-tR25c',
    'YW_nafDHPy4'
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
        // hide/remove headbop GIF when a video animation starts
        if (headbop) {
          headbop.style.display = 'none';
          if (headbop._gifLoopTimer) {
            clearInterval(headbop._gifLoopTimer);
            delete headbop._gifLoopTimer;
          }
        }
        
        // Create or update YouTube iframe
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
        
        // Set YouTube embed URL with autoplay and random start time
        const startTime = Math.floor(Math.random() * 120); // Random start between 0-120 seconds
        iframe.src = `https://www.youtube.com/embed/${item.videoId}?autoplay=1&start=${startTime}&mute=0`;
        iframe.style.display = '';
        video.style.display = 'none';
        img.style.display = 'none';
      } else if (item.type === 'video') {
        // hide/remove headbop GIF when a video animation starts
        if (headbop) {
          headbop.style.display = 'none';
          if (headbop._gifLoopTimer) {
            clearInterval(headbop._gifLoopTimer);
            delete headbop._gifLoopTimer;
          }
        }
        
        // Hide YouTube iframe if exists
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
        // if you also want the headbop hidden for images, uncomment next lines
        // if (headbop) headbop.style.display = 'none';
        
        // Hide YouTube iframe if exists
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

  document.addEventListener('DOMContentLoaded', function () {
    const playButton = document.getElementById('playButton');
    if (!playButton) return;

    // ensure headbop GIF is visible and forced to load/restart immediately (so it animates behind the button)
    const headbop = document.getElementById('headbop');
    if (headbop) {
      headbop.style.display = '';
      headbop.style.zIndex = '1';
      headbop.style.pointerEvents = 'none';
      headbop.src = 'images/headbop.gif?' + Date.now(); // force reload to start animation now
    }

    playButton.addEventListener('click', function () {
      const changeSound = document.getElementById('changeSound');
      soundEnabled = true;
      if (changeSound) {
        changeSound.currentTime = 0;
        changeSound.play().catch(() => {});
      }

      // hide the button (media will occupy the same box)
      this.style.display = 'none';

      // show headbop behind the button and restart animation
      const headbopClick = document.getElementById('headbop');
      if (headbopClick) {
        // restart GIF on click in case you want a fresh loop
        headbopClick.src = 'images/headbop.gif?' + Date.now();
      }

      showRandomMediaForScreen('randomVideo1', 'videoSource1', 'randomImage1');
    });
  });

  // Contact form handling
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

      // Create mailto link
      const mailtoLink = `mailto:becord9000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      // Open email client
      window.location.href = mailtoLink;

      // Show success message
      formStatus.innerHTML = '<div class="alert alert-success">Opening your email client...</div>';
      
      // Reset form after a delay
      setTimeout(() => {
        contactForm.reset();
        formStatus.innerHTML = '';
      }, 3000);
    });
  });
})();
console.clear();
Splitting();
