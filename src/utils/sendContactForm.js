import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_18woyam';
const EMAILJS_TEMPLATE_ID = 'template_320vcsc';
const EMAILJS_PUBLIC_KEY = 'R9B6dfHNiMoceaxmX';

emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY,
  blockHeadless: true,
  limitRate: {
    id: 'portfolio-contact',
    throttle: 60000,
  },
});

export const sendContactForm = async (form) => {
  if (new FormData(form).get('website')) return false;
  await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
  return true;
};
