document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');
  const navLogo = document.getElementById('nav-logo');
  const navBtns = document.querySelectorAll('[data-nav]');
  const scrollElements = document.querySelectorAll('[data-scroll-to]');
  
  let menuOpen = false;

  // Toggle Mobile Menu
  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    iconMenu.style.display = menuOpen ? 'none' : 'block';
    iconClose.style.display = menuOpen ? 'block' : 'none';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  // Smooth Scroll Trigger
  scrollElements.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll-to');
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      if (menuOpen) toggleMenu();
    });
  });

  // Logo top reset click
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Header background state adjustment on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Intersection Observer for Scroll Spy (Highlight Links)
  const sections = ['about', 'projects', 'contact'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        navBtns.forEach(b => b.classList.toggle('active', b.dataset.nav === id));
      }
    }, { threshold: 0.3 }).observe(el);
  });

  // Reveal Animations on scroll
  document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    }, { threshold: 0.12 }).observe(el);
  });
});