(() => {
    'use strict';

    const wrapper = document.querySelector('.contact-form-wrap');
    const form = document.querySelector('#contact-form');
    const success = wrapper?.querySelector('.contact-success');
    const resetButton = wrapper?.querySelector('.contact-reset');

    if (!wrapper || !form || !success || !resetButton) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const payload = {
            name: String(data.get('name') || '').trim(),
            email: String(data.get('email') || '').trim(),
            phone: String(data.get('phone') || '').trim(),
            message: String(data.get('message') || '').trim(),
            pageURL: location.href
        };

        document.dispatchEvent(new CustomEvent('etrContactSubmit', { detail: payload }));
        wrapper.classList.add('success');
        form.inert = true;
        form.setAttribute('aria-hidden', 'true');
        success.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => success.querySelector('h2')?.focus({ preventScroll: true }));
    });

    resetButton.addEventListener('click', () => {
        wrapper.classList.remove('success');
        form.reset();
        form.inert = false;
        form.removeAttribute('aria-hidden');
        success.setAttribute('aria-hidden', 'true');
        requestAnimationFrame(() => form.querySelector('input')?.focus({ preventScroll: true }));
    });
})();
