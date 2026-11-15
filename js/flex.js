const flexbox = document.querySelector('.flexbox');

if (flexbox) {
    flexbox.addEventListener('click', () => {
        flexbox.classList.toggle('is-clicked');
    });
}
