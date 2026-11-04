// Numerifi — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // "More" dropdown — click/tap toggle, closes on outside click
  var dropdownParents = document.querySelectorAll('.has-dropdown');

  dropdownParents.forEach(function (parent) {
    var toggleBtn = parent.querySelector('.nav-toggle-item');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = parent.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', function () {
    dropdownParents.forEach(function (parent) {
      parent.classList.remove('is-open');
      var btn = parent.querySelector('.nav-toggle-item');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  // FAQ accordion (Discussion Forum page)
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.toggle('is-open');
      question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // Booking / signup form — placeholder submit handling
  var forms = document.querySelectorAll('[data-placeholder-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-success');
      if (note) {
        note.style.display = 'block';
      } else {
        alert('Thanks! This form is a placeholder — connect it to your form backend of choice (e.g. Formspree, Netlify Forms, or Google Forms).');
      }
      form.reset();
    });
  });
});
