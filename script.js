// INFILTR8 Main Interactive Engine

// Tab controls for requirements
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }
  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

// Side Menu Navigation Controls
var sidemenu = document.getElementById("sidemenu");

function openmenu() {
  sidemenu.style.right = "0";
}
function closemenu() {
  sidemenu.style.right = "-280px";
}

// Web3Forms AJAX form submit handler with Glassmorphic Toast Notifications
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("betaForm");
  const formPanel = document.querySelector(".form-panel");
  const submitBtn = document.getElementById("submitBtn");

  // Create Toast Container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Toast builder function
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    
    // Choose icon based on alert type
    const icon = type === "success" 
      ? '<i class="fa-solid fa-circle-check"></i>' 
      : '<i class="fa-solid fa-circle-exclamation"></i>';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-body">${message}</div>
      <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
    `;

    toastContainer.appendChild(toast);

    // Trigger reflow & slide-in animation
    setTimeout(() => toast.classList.add("show"), 50);

    // Dismiss click handler
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      dismissToast(toast);
    });

    // Auto dismiss after 5 seconds
    const autoDismiss = setTimeout(() => {
      dismissToast(toast);
    }, 5000);

    function dismissToast(el) {
      clearTimeout(autoDismiss);
      el.classList.remove("show");
      el.addEventListener("transitionend", () => {
        el.remove();
      });
    }
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // UI feedback updates
      submitBtn.disabled = true;
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Transmission...';

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: json
        });

        const result = await response.json();

        if (response.status === 200) {
          showToast("Message sent successfully!", "success");
          form.reset();
        } else {
          showToast(result.message || "Error submitting form.", "error");
        }
      } catch (err) {
        showToast("Network error: " + err.message, "error");
        console.error(err);
      }

      // Restore UI states
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    });
  }
});

// Gallery Pagination & Lightbox Navigation Engine
document.addEventListener("DOMContentLoaded", () => {
  const photoItems = Array.from(document.querySelectorAll(".photo-item"));
  if (photoItems.length === 0) return;
  
  const photosPerPage = 8;
  let currentPage = 1;
  let activeIndex = 0;

  // Extract image elements and source urls
  const images = photoItems.map(item => item.querySelector("img"));
  const imageUrls = images.map(img => img.src);

  // Bind click events to items to open lightbox with correct index
  photoItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  // Pagination rendering function
  function renderGallery() {
    const totalPages = Math.ceil(photoItems.length / photosPerPage);
    
    // Clamp currentPage
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * photosPerPage;
    const endIdx = startIdx + photosPerPage;

    // Hide all, show only current page items
    photoItems.forEach((item, idx) => {
      if (idx >= startIdx && idx < endIdx) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    // Update disabled state of Prev/Next page buttons
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;

    // Render page numbers
    const pageNumbersContainer = document.getElementById("pageNumbers");
    if (pageNumbersContainer) {
      pageNumbersContainer.innerHTML = "";
      
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = `page-num-btn ${currentPage === i ? "active" : ""}`;
        pageBtn.addEventListener("click", () => {
          currentPage = i;
          renderGallery();
        });
        pageNumbersContainer.appendChild(pageBtn);
      }
    }
  }

  // Pagination event listeners
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderGallery();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(photoItems.length / photosPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderGallery();
      }
    });
  }

  // Initialize gallery display
  renderGallery();

  // Lightbox Functions
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!lightbox) return;

  window.openLightbox = function(index) {
    activeIndex = index;
    lightboxImg.src = imageUrls[activeIndex];
    lightbox.style.display = "flex";
  };

  window.closeLightbox = function() {
    lightbox.style.display = "none";
  };

  window.prevImage = function(e) {
    if (e) e.stopPropagation();
    activeIndex = (activeIndex - 1 + imageUrls.length) % imageUrls.length;
    lightboxImg.src = imageUrls[activeIndex];
  };

  window.nextImage = function(e) {
    if (e) e.stopPropagation();
    activeIndex = (activeIndex + 1) % imageUrls.length;
    lightboxImg.src = imageUrls[activeIndex];
  };

  // Close lightbox on clicking backdrop
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Key listeners for sliding and closing
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      }
    }
  });
});

// Constellation Canvas Background Animation (Vanilla Version)
(function() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationFrameId;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  };

  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y, dx, dy, size) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.size = size;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
      ctx.fill();
    }

    update() {
      this.x += this.dx;
      this.y += this.dy;

      if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
      if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

      this.draw();
    }
  }

  const initParticles = () => {
    particles = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 1.5) + 0.5;
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let dx = (Math.random() - 0.5) * 0.5;
      let dy = (Math.random() - 0.5) * 0.5;
      particles.push(new Particle(x, y, dx, dy, size));
    }
  };

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    
    connectParticles();
  };

  const connectParticles = () => {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
          + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
        if (distance < (canvas.width / 7) * (canvas.height / 7)) {
          opacityValue = 1 - (distance / 20000);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  };

  resize();
  animate();
})();

// Back to Top button scroll-visibility handler
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });
  }
});
