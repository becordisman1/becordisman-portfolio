(function () {
  'use strict';

  // Automatically generate video entries for video (1) to video (34)
  const media = [];
  for (let i = 1; i <= 34; i++) {
    media.push({ type: 'video', src: `video/video (${i}).mp4` });
  }

  function showRandomMediaForScreen(videoId, videoSourceId, imgId) {
    const changeSound = document.getElementById('changeSound');
    const headbop = document.getElementById('headbop');

    function show() {
      if (changeSound) {
        changeSound.currentTime = 0;
        // changeSound.play(); // keep commented out if you don't want automatic sound
      }

      const randomIndex = Math.floor(Math.random() * media.length);
      const item = media[randomIndex];
      const video = document.getElementById(videoId);
      const videoSource = document.getElementById(videoSourceId);
      const img = document.getElementById(imgId);

      if (!video || !videoSource || !img) return;

      if (item.type === 'video') {
        // hide/remove headbop GIF when a video animation starts
        if (headbop) {
          headbop.style.display = 'none';
          if (headbop._gifLoopTimer) {
            clearInterval(headbop._gifLoopTimer);
            delete headbop._gifLoopTimer;
          }
        }
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
      } else {
        // if you also want the headbop hidden for images, uncomment next lines
        // if (headbop) headbop.style.display = 'none';
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
      if (changeSound) {
        changeSound.play().then(() => {
          changeSound.pause();
          changeSound.currentTime = 0;
        }).catch(() => {
          // ignore
        });
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
})();
