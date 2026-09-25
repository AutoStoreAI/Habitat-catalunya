/**
 * HABITAT CATALUNYA | ADVOCATS MARTORELL
 * Main Client Application & Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initPracticeAreas();
  initPreparerTabs();
  initReviewFilters();
  initConsultationModal();
  initConsultationForms();
  initCookieConsent();
  initLegalModals();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. HEADER SCROLL & STICKY STATE
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close');
  const navLinks = document.querySelectorAll('.mobile-nav-item a, .mobile-drawer .btn');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. EDITORIAL INTERACTIVE PRACTICE AREAS
   -------------------------------------------------------------------------- */
function initPracticeAreas() {
  const navItems = document.querySelectorAll('.practice-nav-item');
  const panes = document.querySelectorAll('.practice-content-pane');

  if (!navItems.length || !panes.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');

      // Update Nav active states
      navItems.forEach(nav => {
        nav.classList.remove('active');
        nav.setAttribute('aria-selected', 'false');
      });
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');

      // Update Content Panes
      panes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. CASE PREPARER & DOCUMENTATION TABS
   -------------------------------------------------------------------------- */
function initPreparerTabs() {
  const tabBtns = document.querySelectorAll('.preparer-tab-btn');
  const panels = document.querySelectorAll('.preparer-panel');

  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(panel => {
        if (panel.id === `tab-${target}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. REVIEWS & TESTIMONIALS FILTER
   -------------------------------------------------------------------------- */
function initReviewFilters() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const cards = document.querySelectorAll('.testimonial-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONSULTATION MODAL TRIGGER & ACTIONS
   -------------------------------------------------------------------------- */
function initConsultationModal() {
  const modal = document.getElementById('consultation-modal');
  const triggers = document.querySelectorAll('[data-open-modal="consultation"]');
  const closeBtns = document.querySelectorAll('#consultation-modal .modal-close-btn');

  if (!modal) return;

  const openModal = (preselectedArea = '') => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // If an area was passed via data-area attribute, preselect in modal select element
    if (preselectedArea) {
      const areaSelect = modal.querySelector('#modal-area');
      if (areaSelect) {
        areaSelect.value = preselectedArea;
      }
    }
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const area = trigger.getAttribute('data-area') || '';
      openModal(area);
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. CONSULTATION FORM HANDLING & CONFIRMATION TOAST
   -------------------------------------------------------------------------- */
function initConsultationForms() {
  const forms = [
    document.getElementById('main-consultation-form'),
    document.getElementById('modal-consultation-form')
  ];

  forms.forEach(form => {
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Enviar';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg> Procesando consulta...
        `;
      }

      // Simulate instantaneous processing & confirmation
      setTimeout(() => {
        const modal = document.getElementById('consultation-modal');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }

        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        showToast('Solicitud enviada correctamente. Un letrado de Martorell se pondrá en contacto en menos de 24h.');
      }, 900);
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4800);
}

/* --------------------------------------------------------------------------
   8. COOKIE CONSENT BANNER & STORAGE
   -------------------------------------------------------------------------- */
function initCookieConsent() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const configBtn = document.getElementById('cookie-config-link');

  if (!banner) return;

  const cookiePref = localStorage.getItem('hc_cookie_preference');
  if (!cookiePref) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 1200);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('hc_cookie_preference', 'all');
      banner.classList.remove('active');
      showToast('Preferencias de cookies guardadas.');
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('hc_cookie_preference', 'essential');
      banner.classList.remove('active');
      showToast('Cookies no esenciales rechazadas.');
    });
  }

  if (configBtn) {
    configBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cookieModal = document.getElementById('cookies-modal');
      if (cookieModal) {
        cookieModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. LEGAL & POLICY MODALS
   -------------------------------------------------------------------------- */
function initLegalModals() {
  const legalTriggers = document.querySelectorAll('[data-open-legal]');

  legalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-legal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const legalModals = document.querySelectorAll('.legal-modal');
  legalModals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. SMOOTH SCROLL WITH OFFSET
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
