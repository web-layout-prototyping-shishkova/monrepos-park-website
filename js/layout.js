function currentPage() {
    const name = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    return name.endsWith('.html') ? name : 'index.html';
}

function markCurrentPage() {
    const page = currentPage();
    document.querySelectorAll('.main-nav a').forEach((link) => {
        if (link.getAttribute('href') === page) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
}

async function includePart(slot) {
    const response = await fetch('partials/' + slot.dataset.include + '.html');
    if (!response.ok) {
        return;
    }
    slot.outerHTML = (await response.text()).trim();
}

async function loadLayout() {
    const slots = [...document.querySelectorAll('[data-include]')];
    await Promise.all(slots.map(includePart));
    markCurrentPage();
    initMenu();
}

loadLayout();
