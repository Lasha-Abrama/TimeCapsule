(() => {
  const burgerBtn = document.querySelector(".burger");
  const navMenu = document.querySelector(".nav-links");
  const header = document.getElementById("header");
  const logo = document.querySelector(".logo");

  // Burger menu toggle for mobile
  burgerBtn.addEventListener("click", () => navMenu.classList.toggle("open"));

  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 50);
  });

  // Logo click redirects home
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => (window.location.href = "index.html"));
  }
})();
