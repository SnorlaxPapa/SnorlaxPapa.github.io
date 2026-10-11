document.querySelector('[data-copy-email]')?.addEventListener('click', async function () {
  const status = document.querySelector('[data-copy-status]');
  try {
    await navigator.clipboard.writeText('yerongyang@g.ucla.edu');
    this.textContent = 'Email copied';
    status.textContent = 'Email address copied to clipboard.';
    setTimeout(() => { this.textContent = 'Copy email'; }, 2500);
  } catch {
    status.textContent = 'Select the email address to copy it, or click it to open your email app.';
  }
});
