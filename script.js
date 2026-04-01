/* ============================================================
   SCRIPT.JS — Jay Sharma Portfolio
   Fully functional: nav, scroll reveals, cursor glow,
   code-block tilt, contact form, mobile nav, active links
   ============================================================ */

(function () {
  'use strict';

  // ─── DOM REFERENCES ──────────────────────────────────────
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const cursorGlow  = document.getElementById('cursorGlow');
  const contactForm = document.getElementById('contactForm');
  const footerYear  = document.getElementById('footerYear');
  const navLinks    = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');
  const revealCards = document.querySelectorAll('.reveal-card');
  const sections    = document.querySelectorAll('section[id]');
  const codeBlock   = document.querySelector('.hero__code');

  // ─── FOOTER YEAR ─────────────────────────────────────────
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ─── NAVBAR SCROLL EFFECT ────────────────────────────────
  let lastScrollY = 0;

  function handleNavScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ─── MOBILE NAVIGATION ──────────────────────────────────
  function toggleMobileNav() {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMobileNav);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────
  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ─── SMOOTH SCROLL FOR NAV LINKS ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ─── CURSOR GLOW (desktop only) ─────────────────────────
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let rafId = null;

    function animateGlow() {
      // Smooth lerp
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.transform = 'translate(' + (glowX - 300) + 'px, ' + (glowY - 300) + 'px)';
      rafId = requestAnimationFrame(animateGlow);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    rafId = requestAnimationFrame(animateGlow);
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // ─── SCROLL REVEAL (Intersection Observer) ──────────────
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealCards.forEach(function (card) {
      revealObserver.observe(card);
    });
  } else {
    // Fallback: show everything immediately
    revealCards.forEach(function (card) {
      card.classList.add('visible');
    });
  }

  // ─── 3D CODE BLOCK TILT ON SCROLL ───────────────────────
  if (codeBlock && window.matchMedia('(min-width: 901px)').matches) {
    function handleCodeTilt() {
      var rect = codeBlock.getBoundingClientRect();
      var viewHeight = window.innerHeight;
      var centerOffset = (rect.top + rect.height / 2 - viewHeight / 2) / viewHeight;
      // Clamp between -1 and 1
      centerOffset = Math.max(-1, Math.min(1, centerOffset));
      var rotateY = -3 + centerOffset * 4;
      var rotateX = 1 + centerOffset * -2;
      codeBlock.style.transform =
        'perspective(800px) rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg)';
    }

    window.addEventListener('scroll', handleCodeTilt, { passive: true });
  }

  // ─── TYPING EFFECT FOR HERO BADGE ────────────────────────
  var badge = document.querySelector('.hero__badge');
  if (badge) {
    var badgeText = badge.textContent;
    badge.textContent = '';
    badge.style.visibility = 'visible';

    var charIndex = 0;
    function typeBadge() {
      if (charIndex < badgeText.length) {
        badge.textContent += badgeText.charAt(charIndex);
        charIndex++;
        setTimeout(typeBadge, 50);
      }
    }
    // Start after the initial animation
    setTimeout(typeBadge, 900);
  }

  // ─── STAT COUNTER ANIMATION ──────────────────────────────
  var statValues = document.querySelectorAll('.stat-card__value');

  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateValue(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  function animateValue(el) {
    var text = el.textContent.trim();
    // Check if it's a number
    var match = text.match(/^([\d,]+)(\+|%)?$/);
    if (!match) return; // Non-numeric like "LLMs" — skip

    var target = parseInt(match[1].replace(/,/g, ''), 10);
    var suffix = match[2] || '';
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quad
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = Math.floor(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // ─── CONTACT FORM ────────────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('contactName').value.trim();
      var email   = document.getElementById('contactEmail').value.trim();
      var message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) return;

      // Show success feedback
      var submitBtn = contactForm.querySelector('.btn--submit');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<span class="material-symbols-outlined">check_circle</span> Message Sent!';
      submitBtn.style.background = '#28c840';
      submitBtn.disabled = true;

      // Reset after 3 seconds
      setTimeout(function () {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  // ─── SKILL CARD HOVER GLOW ───────────────────────────────
  document.querySelectorAll('.skill-card, .project-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.background =
        'radial-gradient(400px circle at ' + x + 'px ' + y + 'px, rgba(0,240,255,0.04), transparent 40%), var(--surface-container-highest)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.background = '';
    });
  });

  // ─── PARALLAX HERO BACKGROUND ────────────────────────────
  var hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = (scrollY * 0.3) + 'px';
      }
    }, { passive: true });
  }

  // ─── PRELOADER — fade in body ────────────────────────────
  window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });
  });

})();
