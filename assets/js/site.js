(() => {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');

  // Mobile navigation: keep the control's accessible state in sync with the menu.
  if (menuButton && nav) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  // Highlight the section nearest the reading line. This avoids fragile
  // percentage-based IntersectionObserver margins on wide desktop viewports.
  const sections = [...document.querySelectorAll('main > section[id]')];
  const links = [...document.querySelectorAll('.primary-nav a[href^="#"]')];

  if (sections.length && links.length) {
    const updateActiveLink = () => {
      const readingLine = Math.min(Math.max(100, window.innerHeight * 0.3), 260);
      let activeSection = sections[0];

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) {
          activeSection = section;
        } else {
          break;
        }
      }

      links.forEach((link) => {
        if (link.getAttribute('href') === `#${activeSection.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink, { passive: true });
    window.addEventListener('hashchange', updateActiveLink);
    updateActiveLink();
  }

  // Keep the copyright year current without requiring a server.
  const currentYear = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = currentYear;
  });
})();
