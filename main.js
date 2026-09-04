// ==========================================================================
// にいみ塾 サイト共通スクリプト
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {

  // --- 喜びの声ギャラリーのライトボックス --------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryImgs = document.querySelectorAll('.voice-gallery-item img');
  if (lightbox && lightboxImg) {
    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
    };
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightboxImg.src = '';
    };
    galleryImgs.forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // --- ナビの背景切り替え(スクロール時) --------------------------------
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // --- ナビ内メニュー(ドロップダウン)の開閉 -------------------------------
  const menuToggle = document.getElementById('nav-menu-toggle');
  const menuDropdown = document.getElementById('nav-menu-dropdown');
  if (menuToggle && menuDropdown) {
    const closeMenu = () => {
      menuDropdown.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    const toggleMenu = () => {
      const isOpen = menuDropdown.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    };
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    menuDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', (e) => {
      if (!menuDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // --- スクロールでふわっと表示 -------------------------------------------
  const revealEls = document.querySelectorAll('.reveal, .t-item');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('show'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('show'));
  }

  // --- タイムライン進捗バー ------------------------------------------------
  const track = document.querySelector('.timeline');
  const fill = document.getElementById('track-fill');
  if (track && fill && !prefersReducedMotion) {
    const updateFill = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      let progressed = vh * 0.75 - rect.top;
      progressed = Math.max(0, Math.min(progressed, total));
      fill.style.height = (total > 0 ? (progressed / total * 100) : 0) + '%';
    };
    window.addEventListener('scroll', updateFill);
    window.addEventListener('resize', updateFill);
    updateFill();
  }

  // --- お問い合わせフォーム(デモ用の送信ハンドラ) --------------------------
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '送信しました';
      submitBtn.disabled = true;
      contactForm.querySelectorAll('input, select, textarea').forEach(f => f.disabled = true);
      const note = document.querySelector('#contact-form-note');
      if (note) {
        note.textContent = 'お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。';
        note.style.color = 'var(--sky-deep)';
      }
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.querySelectorAll('input, select, textarea').forEach(f => f.disabled = false);
      }, 4000);
    });
  }
});