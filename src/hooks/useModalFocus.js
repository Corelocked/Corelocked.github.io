import { useEffect, useRef } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function useModalFocus(isOpen) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return undefined;
    const modal = ref.current;
    const previousFocus = document.activeElement;
    const focusable = () => [...modal.querySelectorAll(focusableSelector)];
    (focusable()[0] || modal).focus();

    const trapFocus = (event) => {
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) return event.preventDefault();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    modal.addEventListener('keydown', trapFocus);
    return () => {
      modal.removeEventListener('keydown', trapFocus);
      previousFocus?.focus?.();
    };
  }, [isOpen]);

  return ref;
}
