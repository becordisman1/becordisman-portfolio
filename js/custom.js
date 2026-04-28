
(function () {
  'use strict';

  const TILE_OVERLAY_URL = 'img/pastel-yellow-vignette-concrete-textured-background.jpg';
  const HEADBOP_GIF_URL = 'https://media.giphy.com/media/5kcTeDZmTTAJnou50r/giphy.gif';
  const TILE_SIZE_DESKTOP = 180;
  const TILE_SIZE_MOBILE = 110;

  // All headbob-related code removed

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
    'YW_nafDHPy4',
    'RNrUWTENN2c',
    'G-Cdjisvip0'
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

    // Move button to a random position within the viewport (not offscreen)
    function moveButtonRandomly() {
      const parent = playButton.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();
      const btnRect = playButton.getBoundingClientRect();
      const minX = 0;
      const minY = 0;
      const maxX = parentRect.width - btnRect.width;
      const maxY = parentRect.height - btnRect.height;
      const randX = Math.random() * maxX;
      const randY = Math.random() * maxY;
      playButton.style.left = randX + 'px';
      playButton.style.top = randY + 'px';
      playButton.style.transform = 'translate(0,0)';
    }

    // Move on hover or click
    playButton.addEventListener('mouseenter', moveButtonRandomly);
    playButton.addEventListener('click', function () {
      moveButtonRandomly();
      const changeSound = document.getElementById('changeSound');
      soundEnabled = true;
      if (changeSound) {
        changeSound.currentTime = 0;
        changeSound.play().catch(() => {});
      }

      // hide the button and overlay gif after a short delay
      setTimeout(() => {
        playButton.style.display = 'none';
        const buttonOverlay = document.getElementById('buttonOverlay');
        if (buttonOverlay) {
          buttonOverlay.style.display = 'none';
        }
        // show headbop behind the button and restart animation
        const headbopClick = document.getElementById('headbop');
        if (headbopClick) {
          restartHeadbopGif();
        }
        showRandomMediaForScreen('randomVideo1', 'videoSource1', 'randomImage1');
      }, 300);
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
