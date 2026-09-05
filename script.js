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

// ===== Customer Reviews =====
// Reviews are submitted to the existing Web3Forms inbox for moderation.
// Because GitHub Pages is static, approved reviews are published manually
// in this page rather than appearing automatically from customer input.
const reviewsAnchor = document.querySelector('.insights');
if (reviewsAnchor && !document.getElementById('reviews')) {
  const reviewsSection = document.createElement('section');
  reviewsSection.className = 'reviews section section-light';
  reviewsSection.id = 'reviews';
  reviewsSection.innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <span class="kicker kicker-orange">Customer Reviews</span>
        <h2>What our clients say</h2>
        <p class="lead">We value every customer's experience. Share your feedback and help us improve.</p>
      </div>

      <div class="reviews-layout">
        <div class="review-list reveal">
          <div class="review-empty" id="reviewEmpty">
            <div class="review-quote">“</div>
            <h3>Be our first reviewer</h3>
            <p>Your experience can help future customers understand what it is like to work with CONSULTUTK.</p>
          </div>
        </div>

        <div class="review-form-card reveal">
          <h3>Leave a review</h3>
          <p class="review-form-intro">Tell us about your experience. Submitted reviews are checked before appearing publicly.</p>
          <form id="reviewForm" novalidate>
            <input type="hidden" name="subject" value="New CONSULTUTK Customer Review" />
            <input type="hidden" name="from_name" value="CONSULTUTK Website Review Form" />
            <input type="hidden" name="form_type" value="customer_review" />
            <div class="review-fields">
              <label>Name<input type="text" name="reviewer_name" required maxlength="80" autocomplete="name" placeholder="Your name" /></label>
              <label>Company / Designation <span>(optional)</span><input type="text" name="reviewer_role" maxlength="100" placeholder="Company or designation" /></label>
            </div>
            <fieldset class="rating-field">
              <legend>Your rating</legend>
              <div class="star-rating" role="radiogroup" aria-label="Rating from 1 to 5 stars">
                <input type="radio" id="rating5" name="rating" value="5" required /><label for="rating5" title="5 stars">★</label>
                <input type="radio" id="rating4" name="rating" value="4" /><label for="rating4" title="4 stars">★</label>
                <input type="radio" id="rating3" name="rating" value="3" /><label for="rating3" title="3 stars">★</label>
                <input type="radio" id="rating2" name="rating" value="2" /><label for="rating2" title="2 stars">★</label>
                <input type="radio" id="rating1" name="rating" value="1" /><label for="rating1" title="1 star">★</label>
              </div>
            </fieldset>
            <label>Review<textarea name="review" rows="5" required maxlength="1000" placeholder="How was your experience with CONSULTUTK?"></textarea></label>
            <label class="review-consent"><input type="checkbox" name="publish_consent" value="Yes" required /> <span>I agree that CONSULTUTK may publish my review on this website.</span></label>
            <button class="btn btn-orange btn-block" type="submit">Submit Review</button>
            <p class="review-note" id="reviewNote" hidden></p>
          </form>
        </div>
      </div>
    </div>
  `;
  reviewsAnchor.parentNode.insertBefore(reviewsSection, reviewsAnchor);

  // Add a Reviews link to the navigation.
  if (!nav.querySelector('a[href="#reviews"]')) {
    const reviewNav = document.createElement('a');
    reviewNav.href = '#reviews';
    reviewNav.textContent = 'Reviews';
    nav.insertBefore(reviewNav, nav.querySelector('.nav-cta'));
    reviewNav.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  const reviewStyle = document.createElement('style');
  reviewStyle.textContent = `
    .reviews-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:30px;align-items:stretch}
    .review-list{display:grid;gap:18px}
    .review-empty{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius);padding:44px 34px;text-align:center;display:grid;place-items:center;min-height:320px;box-shadow:var(--shadow-sm)}
    .review-quote{font-family:Georgia,serif;font-size:5rem;line-height:.7;color:var(--orange);height:58px}
    .review-empty h3{font-size:1.35rem;margin:8px 0 8px}
    .review-empty p{color:var(--muted);max-width:480px}
    .review-form-card{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius);padding:32px;box-shadow:var(--shadow-md)}
    .review-form-card h3{font-size:1.35rem;margin-bottom:8px}
    .review-form-intro{color:var(--muted);font-size:.92rem;margin-bottom:22px}
    .review-fields{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .review-form-card label{display:block;font-size:.84rem;font-weight:600;color:var(--navy-800);margin-bottom:16px}
    .review-form-card label span{font-weight:400;color:var(--muted)}
    .review-form-card input[type="text"],.review-form-card textarea{width:100%;margin-top:7px;border:1px solid var(--gray-200);border-radius:10px;padding:11px 12px;font:inherit;color:var(--ink);background:#fff;outline:none;transition:border-color .2s,box-shadow .2s}
    .review-form-card input[type="text"]:focus,.review-form-card textarea:focus{border-color:var(--orange);box-shadow:0 0 0 3px rgba(245,130,31,.12)}
    .rating-field{border:0;padding:0;margin:0 0 14px}
    .rating-field legend{font-size:.84rem;font-weight:600;color:var(--navy-800);margin-bottom:7px}
    .star-rating{display:inline-flex;flex-direction:row-reverse;justify-content:flex-end;gap:3px}
    .star-rating input{position:absolute;opacity:0;pointer-events:none}
    .star-rating label{font-size:2rem;line-height:1;cursor:pointer;color:#d4dce7;margin:0;transition:color .15s,transform .15s}
    .star-rating label:hover,.star-rating label:hover ~ label,.star-rating input:checked ~ label{color:var(--orange)}
    .star-rating label:hover{transform:translateY(-1px)}
    .review-consent{display:flex !important;gap:9px;align-items:flex-start;font-size:.78rem !important;font-weight:400 !important;color:var(--muted) !important}
    .review-consent input{margin-top:3px;accent-color:var(--orange)}
    .review-note{font-size:.85rem;margin-top:12px;color:var(--teal)}
    .review-note.error{color:#e23b3b}
    .published-review{background:#fff;border:1px solid var(--gray-200);border-radius:var(--radius);padding:30px;box-shadow:var(--shadow-sm)}
    .published-review .review-stars{color:var(--orange);letter-spacing:2px;margin-bottom:12px}
    .published-review blockquote{font-size:1rem;color:var(--navy-800);margin-bottom:18px}
    .published-review .reviewer{font-size:.86rem;font-weight:600;color:var(--muted)}
    @media(max-width:800px){.reviews-layout{grid-template-columns:1fr}.review-fields{grid-template-columns:1fr}}
  `;
  document.head.appendChild(reviewStyle);

  const reviewForm = document.getElementById('reviewForm');
  const reviewNote = document.getElementById('reviewNote');
  const reviewSubmit = reviewForm.querySelector('button[type="submit"]');
  const reviewAccessKey = form.querySelector('[name="access_key"]');

  if (reviewAccessKey) {
    const access = document.createElement('input');
    access.type = 'hidden';
    access.name = 'access_key';
    access.value = reviewAccessKey.value;
    reviewForm.appendChild(access);
  }

  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!reviewForm.checkValidity()) {
      reviewForm.reportValidity();
      return;
    }
    reviewSubmit.disabled = true;
    reviewSubmit.textContent = 'Submitting…';
    reviewNote.hidden = true;
    reviewNote.classList.remove('error');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(reviewForm)
      });
      const data = await res.json();
      if (data.success) {
        reviewForm.reset();
        reviewSubmit.disabled = false;
        reviewSubmit.textContent = 'Review Submitted ✓';
        reviewNote.textContent = 'Thank you! Your review has been received and will be checked before publication.';
        reviewNote.hidden = false;
      } else {
        reviewSubmit.disabled = false;
        reviewSubmit.textContent = 'Submit Review';
        reviewNote.textContent = data.message || 'Unable to submit the review. Please try again.';
        reviewNote.classList.add('error');
        reviewNote.hidden = false;
      }
    } catch (err) {
      reviewSubmit.disabled = false;
      reviewSubmit.textContent = 'Submit Review';
      reviewNote.textContent = 'Network error. Please try again or email consultutk@gmail.com directly.';
      reviewNote.classList.add('error');
      reviewNote.hidden = false;
    }
  });

  // Add approved reviews here after you receive and approve them.
  const approvedReviews = [];
  if (approvedReviews.length) {
    const list = document.querySelector('.review-list');
    const empty = document.getElementById('reviewEmpty');
    if (empty) empty.remove();
    approvedReviews.forEach(r => {
      const card = document.createElement('article');
      card.className = 'published-review';
      card.innerHTML = `<div class="review-stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div><blockquote>“${r.text.replace(/[<>]/g, '')}”</blockquote><div class="reviewer">${r.name.replace(/[<>]/g, '')}${r.role ? ` · ${r.role.replace(/[<>]/g, '')}` : ''}</div>`;
      list.appendChild(card);
    });
  }
}
