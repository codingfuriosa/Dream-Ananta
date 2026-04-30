/* =========================
   SCROLL REVEAL (existing)
========================= */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  function revealOnScroll() {
    reveals.forEach((el) => {
      const trigger = window.innerHeight * 0.85;
      const top = el.getBoundingClientRect().top;
      if (top < trigger) el.classList.add('active');
    });
  }
  window.addEventListener('load', revealOnScroll);
  window.addEventListener('scroll', revealOnScroll);
})();


/* =========================
   CALL CTA — RINGING ANIMATION TRIGGER
========================= */
(function () {
  const btns = document.querySelectorAll('.cta.secondary, .hero-call-cta');
  if (!btns.length) return;
  if (!('IntersectionObserver' in window)) {
    btns.forEach((b) => b.classList.add('is-ringing'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-ringing');
        else entry.target.classList.remove('is-ringing');
      });
    },
    { threshold: 0.25 }
  );
  btns.forEach((b) => io.observe(b));
})();


/* =========================
   FORM — BASIC VALIDATION
   Rules (kept simple as requested):
   - Name: letters + spaces only, min 3 chars
   - Phone: optional +91 prefix; 10-digit Indian mobile
   - Email: standard format
   - Message: optional
   - Agree: must be checked
   On success → redirect to "Thank you.html"
========================= */
(function () {
  const form = document.querySelector('.enquiry-form');
  if (!form) return;

  const name    = document.getElementById('f-name');
  const phone   = document.getElementById('f-phone');
  const email   = document.getElementById('f-email');
  const message = document.getElementById('f-message');
  const agree   = document.getElementById('agree');
  const errBox  = form.querySelector('.form-error');

  function showError(input, msg) {
    if (errBox) {
      errBox.textContent = msg;
      errBox.classList.add('is-visible');
    }
    if (input && input.focus) {
      input.classList.add('is-invalid');
      input.focus();
    }
  }

  function clearErrors() {
    if (errBox) {
      errBox.textContent = '';
      errBox.classList.remove('is-visible');
    }
    [name, phone, email, message].forEach((el) => el && el.classList.remove('is-invalid'));
  }

  // Live: clear error styling as user types
  [name, phone, email, message].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => el.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    // NAME — letters/spaces only, min 3 chars
    const nameVal = name.value.trim();
    if (!nameVal) return showError(name, 'Please enter your full name.');
    if (nameVal.length < 3) return showError(name, 'Name must be at least 3 characters long.');
    if (!/^[A-Za-z][A-Za-z\s.'-]+$/.test(nameVal))
      return showError(name, 'Name can only contain letters and spaces.');

    // PHONE — optional +91 prefix; 10-digit mobile starting 6-9
    let phoneVal = phone.value.trim();
    if (!phoneVal) return showError(phone, 'Please enter your phone number.');
    phoneVal = phoneVal.replace(/^\+91[\s-]*/, '').replace(/[\s-]/g, '');
    if (!/^\d+$/.test(phoneVal))
      return showError(phone, 'Phone number can only contain digits (with optional +91).');
    if (phoneVal.length !== 10)
      return showError(phone, 'Please enter a valid 10-digit mobile number.');
    if (!/^[6-9]/.test(phoneVal))
      return showError(phone, 'Mobile number must start with 6, 7, 8 or 9.');

    // EMAIL — standard format
    const emailVal = email.value.trim();
    if (!emailVal) return showError(email, 'Please enter your email address.');
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(emailVal))
      return showError(email, 'Please enter a valid email address.');

    // AGREE
    if (!agree.checked) {
      if (errBox) {
        errBox.textContent = 'Please agree to be contacted before submitting.';
        errBox.classList.add('is-visible');
      }
      return;
    }

    // All good — go to Thank you
    window.location.href = 'Thank you.html';
  });
})();
