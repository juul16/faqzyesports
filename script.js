const API_URL = 'https://YOUR-BOT-HOST.example.com';

const form = document.getElementById('tryout-form');
const statusBox = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');
const tryoutSelect = document.getElementById('tryoutType');

document.querySelectorAll('[data-tryout]').forEach(link => {
  link.addEventListener('click', () => {
    tryoutSelect.value = link.dataset.tryout;
  });
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  statusBox.textContent = '';
  statusBox.className = '';

  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  data.joinedDiscord = formData.has('joinedDiscord');
  data.consent = formData.has('consent');

  try {
    const response = await fetch(`${API_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.error || 'Could not submit your application.'
      );
    }

    statusBox.textContent =
      'Application submitted successfully! Thank you for applying.';
    statusBox.className = 'success';

    form.reset();
  } catch (error) {
    console.error(error);

    statusBox.textContent =
      'Application failed. Please try again later or contact Faqzy Esports staff.';
    statusBox.className = 'error';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit application →';
  }
});
