import { libRefs } from './libRefs';

export function libraryFooterModalOpen() {
    libRefs.footerBackDrop.classList.remove('is-hidden');
    document.querySelector("body").classList.add('noScroll');
    document.addEventListener('keydown', hideFooterModal);
    libRefs.footerBackDrop.addEventListener("click", hideFooterModal);
    libRefs.footerCloseBtn.addEventListener("click", footerCloseBtnOnClick)
}

function footerCloseBtnOnClick() {
    libRefs.footerBackDrop.classList.add('is-hidden');
    removeListeners();
}

function hideFooterModal(e) {
    if (e.key === 'Escape' || e.target === libRefs.footerBackDrop) {
        libRefs.footerBackDrop.classList.add('is-hidden');
        removeListeners();
    }
}

function removeListeners() {
    document.removeEventListener('keydown', hideFooterModal);
    libRefs.footerBackDrop.removeEventListener("click", hideFooterModal);
    libRefs.footerCloseBtn.removeEventListener("click", footerCloseBtnOnClick);
    document.querySelector("body").classList.remove('noScroll');
}