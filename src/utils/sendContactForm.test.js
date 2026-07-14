import emailjs from '@emailjs/browser';
import { sendContactForm } from './sendContactForm';

jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  sendForm: jest.fn(() => Promise.resolve()),
}));

test('blocks honeypot submissions without calling EmailJS', async () => {
  const form = document.createElement('form');
  const honeypot = document.createElement('input');
  honeypot.name = 'website';
  honeypot.value = 'https://spam.example';
  form.appendChild(honeypot);

  await expect(sendContactForm(form)).resolves.toBe(false);
  expect(emailjs.sendForm).not.toHaveBeenCalled();
});

test('sends legitimate submissions', async () => {
  const form = document.createElement('form');

  await expect(sendContactForm(form)).resolves.toBe(true);
  expect(emailjs.sendForm).toHaveBeenCalledWith(
    'service_18woyam',
    'template_320vcsc',
    form
  );
});
