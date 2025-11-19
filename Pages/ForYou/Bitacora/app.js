function showPopup(message, flowerImage) {
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.innerHTML = `
        <img src="${flowerImage}" alt="Icon">
        <p>${message}</p>
        <button class="back-btn" onclick="closePopup(this)"><i class='fas fa-arrow-left'></i> Volver</button>
      `;
      document.body.appendChild(popup);
    }

    function closePopup(btn) {
      const popup = btn.closest('.popup');
      if (popup) popup.remove();
    }

    // Estrellas animadas
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");
    let stars = [];

    function resizeStars() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({length: 100}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5
      }));
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }

    window.addEventListener("resize", resizeStars);
    resizeStars();
    drawStars();