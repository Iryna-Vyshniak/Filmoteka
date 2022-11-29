export const refs = {
  gallery: document.querySelector('.gallery'),
  library: document.querySelector('.library'),
  footerLink: document.querySelector('.footer__link'),
  footerBackDrop: document.querySelector('.footer__backdrop'),
  footerCloseBtn: document.querySelector('[data-modal-close]'),
  formEl: document.querySelector('.header-search-form'),
  paginationContainer: document.querySelector('#tui-pagination-container'),
  btnUp: document.getElementById('to-top-btn'),
  btnUpWrapper: document.querySelector('.btn-up'),

  paginOptions: {
    totalItems: 0,
    itemsPerPage: 20,
    visiblePages: 7,
    page: 1,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  },
};
