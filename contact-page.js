(() => {
    'use strict';

    const wrapper = document.querySelector('.contact-form-wrap');
    const form = document.querySelector('#contact-form');
    const success = wrapper?.querySelector('.contact-success');
    const resetButton = wrapper?.querySelector('.contact-reset');
    const submitButton = form?.querySelector('[type="submit"]');
    const formStatus = form?.querySelector('.form-status');

    if (!wrapper || !form || !success || !resetButton || !submitButton || !formStatus) return;

    form.addEventListener('submit', async event => {
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

        submitButton.disabled = true;
        submitButton.textContent = document.documentElement.lang === 'et' ? 'Saadan…' : 'Sending…';
        formStatus.hidden = true;

        try {
            await window.ETRSupabase.insert('contact_enquiries', {
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                message: payload.message || null,
                page_url: payload.pageURL
            });

            document.dispatchEvent(new CustomEvent('etrContactSubmit', { detail: payload }));
            wrapper.classList.add('success');
            form.inert = true;
            form.setAttribute('aria-hidden', 'true');
            success.setAttribute('aria-hidden', 'false');
            requestAnimationFrame(() => success.querySelector('h2')?.focus({ preventScroll: true }));
        } catch (error) {
            console.error('ETR contact submission failed:', error);
            formStatus.textContent = document.documentElement.lang === 'et'
                ? 'Sõnumi saatmine ebaõnnestus. Palun proovi uuesti.'
                : 'Unable to send your message. Please try again.';
            formStatus.hidden = false;
            submitButton.disabled = false;
            submitButton.textContent = document.documentElement.lang === 'et' ? 'Saada sõnum' : 'Send Message';
        }
    });

    resetButton.addEventListener('click', () => {
        wrapper.classList.remove('success');
        form.reset();
        form.inert = false;
        form.removeAttribute('aria-hidden');
        success.setAttribute('aria-hidden', 'true');
        formStatus.hidden = true;
        formStatus.textContent = '';
        submitButton.disabled = false;
        submitButton.textContent = document.documentElement.lang === 'et' ? 'Saada sõnum' : 'Send Message';
        requestAnimationFrame(() => form.querySelector('input')?.focus({ preventScroll: true }));
    });
})();
