// Numerifi — shared site behavior

// ---- Course progress (browser-only, no accounts — see CLAUDE.md) ----
var COURSE_MODULE_COUNT = 6;
var COURSE_PROGRESS_KEY = 'numerifi_course_progress_v1';

function getCourseProgress() {
  try {
    return JSON.parse(localStorage.getItem(COURSE_PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCourseProgress(progress) {
  try {
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    // Storage unavailable (private browsing, quota, etc.) — progress just won't persist.
  }
}

function markModuleComplete(moduleNumber, score, total) {
  var progress = getCourseProgress();
  progress[moduleNumber] = { completed: true, score: score, total: total };
  saveCourseProgress(progress);
  return progress;
}

function getNextIncompleteModule() {
  var progress = getCourseProgress();
  for (var i = 1; i <= COURSE_MODULE_COUNT; i++) {
    if (!progress[i] || !progress[i].completed) return i;
  }
  return null;
}

function sumCourseScores() {
  var progress = getCourseProgress();
  var score = 0, total = 0;
  for (var i = 1; i <= COURSE_MODULE_COUNT; i++) {
    if (progress[i]) {
      score += progress[i].score || 0;
      total += progress[i].total || 0;
    }
  }
  return { score: score, total: total };
}

// Fill these in once a completion-tracking Google Form exists, so finishing
// Module 6 can log a name/email/score row for reporting (per-student progress
// itself always stays local — this is a separate, optional, best-effort ping):
//   1. Create a Form with short-answer "Name", "Email", and "Score" fields.
//   2. Open the live form's 3-dot menu -> "Get pre-filled link", fill in sample
//      answers, click "Get link", and copy the resulting URL.
//   3. Set actionUrl below to that URL with "/viewform" replaced by "/formResponse".
//   4. Each "entry.123456789" in that URL names a field — copy the right one
//      into the matching key under entries.
var GOOGLE_FORM_CONFIG = {
  actionUrl: '', // e.g. 'https://docs.google.com/forms/d/e/FORM_ID/formResponse'
  entries: {
    name: '',  // e.g. 'entry.111111111'
    email: '', // e.g. 'entry.222222222'
    score: ''  // e.g. 'entry.333333333'
  }
};

function submitCompletionForm(name, email, score, total) {
  if (!GOOGLE_FORM_CONFIG.actionUrl || !GOOGLE_FORM_CONFIG.entries.name) return;

  var formData = new FormData();
  formData.append(GOOGLE_FORM_CONFIG.entries.name, name || '');
  formData.append(GOOGLE_FORM_CONFIG.entries.email, email || '');
  formData.append(GOOGLE_FORM_CONFIG.entries.score, score + '/' + total);

  fetch(GOOGLE_FORM_CONFIG.actionUrl, { method: 'POST', mode: 'no-cors', body: formData })
    .catch(function () {
      // Best-effort — a blocked/opaque response shouldn't affect the student's local completion.
    });
}

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

  // Course module quiz — click an option to see instant feedback (ungated: every
  // question can only be answered once, but nothing here blocks moving on).
  var quizCard = document.querySelector('[data-quiz]');
  if (quizCard) {
    var questions = quizCard.querySelectorAll('[data-question]');
    var score = 0;
    var answered = 0;

    questions.forEach(function (question) {
      var correctIndex = parseInt(question.getAttribute('data-correct'), 10);
      var options = question.querySelectorAll('.quiz-option');

      options.forEach(function (option) {
        option.addEventListener('click', function () {
          if (option.disabled) return;
          var chosenIndex = parseInt(option.getAttribute('data-index'), 10);

          options.forEach(function (o) { o.disabled = true; });

          if (chosenIndex === correctIndex) {
            option.classList.add('is-correct');
            score++;
          } else {
            option.classList.add('is-incorrect');
            options[correctIndex].classList.add('is-correct');
          }

          answered++;
          quizCard.dataset.score = score;
          quizCard.dataset.total = questions.length;

          if (answered === questions.length) {
            var result = quizCard.querySelector('[data-quiz-result]');
            if (result) {
              result.textContent = 'You got ' + score + ' of ' + questions.length + ' — no wrong answers here, this is just for you.';
              result.classList.add('is-visible');
            }
          }
        });
      });
    });
  }

  // "Mark complete & continue" — records this module's progress locally, then
  // lets the link's own href move on to the next module.
  var completeBtn = document.querySelector('[data-mark-complete]');
  if (completeBtn) {
    completeBtn.addEventListener('click', function () {
      var moduleNumber = parseInt(completeBtn.getAttribute('data-module'), 10);
      var score = quizCard ? parseInt(quizCard.dataset.score || '0', 10) : 0;
      var total = quizCard ? parseInt(quizCard.dataset.total || '0', 10) : 0;
      markModuleComplete(moduleNumber, score, total);
    });
  }

  // Module 6 — finishing the course also offers an optional, separate ping to a
  // Google Form for completion reporting (see GOOGLE_FORM_CONFIG above).
  var finishForm = document.querySelector('[data-finish-course]');
  if (finishForm) {
    finishForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var score = quizCard ? parseInt(quizCard.dataset.score || '0', 10) : 0;
      var total = quizCard ? parseInt(quizCard.dataset.total || '0', 10) : 0;
      markModuleComplete(COURSE_MODULE_COUNT, score, total);

      var nameField = finishForm.querySelector('[name="student-name"]');
      var emailField = finishForm.querySelector('[name="student-email"]');
      var totals = sumCourseScores();
      submitCompletionForm(
        nameField ? nameField.value.trim() : '',
        emailField ? emailField.value.trim() : '',
        totals.score,
        totals.total
      );

      finishForm.hidden = true;
      var badge = document.querySelector('[data-finish-badge]');
      if (badge) badge.hidden = false;
    });
  }

  // Courses page — show a "resume where you left off" state once any module
  // has been completed in this browser.
  var startCourseLink = document.querySelector('[data-start-course]');
  var resumeEl = document.querySelector('[data-course-resume]');
  if (startCourseLink && resumeEl) {
    var progress = getCourseProgress();
    var completedCount = 0;
    for (var m = 1; m <= COURSE_MODULE_COUNT; m++) {
      if (progress[m] && progress[m].completed) completedCount++;
    }

    if (completedCount >= COURSE_MODULE_COUNT) {
      startCourseLink.textContent = 'Review the Course';
      startCourseLink.href = 'course-module-1.html';
      resumeEl.textContent = 'Course complete — nice work!';
      resumeEl.style.display = 'block';
    } else if (completedCount > 0) {
      var next = getNextIncompleteModule();
      startCourseLink.textContent = 'Resume the Course';
      startCourseLink.href = 'course-module-' + next + '.html';
      resumeEl.textContent = completedCount + ' of ' + COURSE_MODULE_COUNT + ' modules complete';
      resumeEl.style.display = 'block';
    }
  }
});
