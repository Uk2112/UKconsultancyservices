// ===== Sticky header state =====
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// ===== Scroll reveal =====
const io = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Animated stat counters =====
const animateCount = el => {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const statIO = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        statIO.unobserve(e.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.stat-num').forEach(el => statIO.observe(el));

// ===== Contact form (submits to Web3Forms -> email) =====
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const submitBtn = form.querySelector('button[type="submit"]');
const submitLabel = submitBtn.textContent;

const showNote = (msg, ok) => {
  note.textContent = msg;
  note.style.color = ok ? '' : '#e23b3b';
  note.hidden = false;
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  note.hidden = true;

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    const data = await res.json();

    if (data.success) {
      form.reset();
      submitBtn.textContent = 'Message Sent ✓';
      showNote('Thanks — your message has been sent. We’ll get back to you soon.', true);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      showNote(data.message || 'Something went wrong. Please try again or email us directly.', false);
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = submitLabel;
    showNote('Network error. Please try again or email consultutk@gmail.com directly.', false);
  }
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== CONSULTUTK requested UI updates =====
// The three hero cards repeat the detailed sections below, so remove the
// repeated hero card while leaving the rest of the page unchanged.
const repeatedHeroCard = document.querySelector('.brand-hero-card');
if (repeatedHeroCard) repeatedHeroCard.remove();

// Add Vendor Development to the enquiry topic list.
const topicSelect = document.getElementById('topic');
if (topicSelect && !Array.from(topicSelect.options).some(option => option.value === 'Vendor Development')) {
  const vendorOption = document.createElement('option');
  vendorOption.value = 'Vendor Development';
  vendorOption.textContent = 'Vendor Development';
  topicSelect.appendChild(vendorOption);
}

// ===== Compact homepage spacing =====
// Reduce large gaps between the hero and content sections, and between
// section headings and their content, without changing the overall design.
const compactHeroStyle = document.createElement('style');
compactHeroStyle.textContent = `
  .brand-hero { padding-bottom: 18px !important; }
  .pillars { padding-top: 28px !important; padding-bottom: 58px !important; }
  .pillars .section-head { margin-bottom: 36px !important; }
  .solutions { padding-top: 58px !important; padding-bottom: 58px !important; }
  .solutions .section-head { margin-bottom: 40px !important; }
  .industries { padding-top: 58px !important; padding-bottom: 58px !important; }
  .industries .section-head { margin-bottom: 40px !important; }
  .why { padding-top: 58px !important; padding-bottom: 58px !important; }
  .why .section-head { margin-bottom: 40px !important; }
  .cases { padding-top: 58px !important; padding-bottom: 58px !important; }
  .cases .section-head { margin-bottom: 40px !important; }
  .insights { padding-top: 58px !important; padding-bottom: 58px !important; }
  .insights .section-head { margin-bottom: 40px !important; }
  .engage { padding-top: 58px !important; padding-bottom: 58px !important; }
  .engage .section-head { margin-bottom: 40px !important; }
  .academy { padding-top: 64px !important; padding-bottom: 64px !important; }
  .contact { padding-top: 64px !important; padding-bottom: 64px !important; }
  @media (max-width: 600px) {
    .brand-hero { padding-bottom: 16px !important; }
    .pillars { padding-top: 24px !important; padding-bottom: 46px !important; }
    .pillars .section-head { margin-bottom: 30px !important; }
    .solutions, .industries, .why, .cases, .insights, .engage { padding-top: 48px !important; padding-bottom: 48px !important; }
    .solutions .section-head, .industries .section-head, .why .section-head, .cases .section-head, .insights .section-head, .engage .section-head { margin-bottom: 32px !important; }
    .academy, .contact { padding-top: 54px !important; padding-bottom: 54px !important; }
  }
`;
document.head.appendChild(compactHeroStyle);
