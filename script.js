const emailButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector(".copy-status");
const navLinks = [...document.querySelectorAll(".folder-tabs a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const marqueeTrack = document.querySelector(".marquee div");
const progressBar = document.querySelector(".scroll-progress");
const sparkleLayer = document.querySelector(".sparkle-layer");
const revealItems = [...document.querySelectorAll(".reveal")];
let lastSparkleAt = 0;

document.documentElement.dataset.motion = "scrapbook-stationery";
window.portfolioMotionVersion = "15";

if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

emailButton?.addEventListener("click", async () => {
  const email = "sydnieplui@gmail.com";

  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Copied sydnieplui@gmail.com to your clipboard.";
  } catch {
    copyStatus.textContent = "Email: sydnieplui@gmail.com";
  }
});

const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 160;
  let currentSectionId = sections[0]?.id;

  for (const section of sections) {
    if (section.offsetTop <= scrollPosition) {
      currentSectionId = section.id;
    }
  }

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${currentSectionId}`);
  });
};

const updateScrollProgress = () => {
  if (!progressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

const updateCursor = (event) => {
  if (!sparkleLayer || window.matchMedia("(pointer: coarse)").matches) return;

  const now = Date.now();
  if (now - lastSparkleAt < 58) return;
  lastSparkleAt = now;

  const sparkle = document.createElement("span");
  const size = 7 + Math.random() * 9;
  sparkle.className = "sparkle-trail-piece";
  sparkle.style.left = `${event.clientX + (Math.random() - 0.5) * 16}px`;
  sparkle.style.top = `${event.clientY + (Math.random() - 0.5) * 16}px`;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.rotate = `${Math.random() * 110}deg`;

  sparkleLayer.appendChild(sparkle);
  window.setTimeout(() => sparkle.remove(), 760);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -70px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));
updateActiveLink();
updateScrollProgress();

window.addEventListener("scroll", updateActiveLink, { passive: true });
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("pointermove", updateCursor, { passive: true });

const introVideo = document.getElementById("portfolio-intro-video");

if (introVideo) {
  const introObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          introVideo.currentTime = 0;

          introVideo.play().catch(() => {
            // Autoplay may be blocked by the browser.
          });
        } else {
          introVideo.pause();
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  introObserver.observe(introVideo);
}
