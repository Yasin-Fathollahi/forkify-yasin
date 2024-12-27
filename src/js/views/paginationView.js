import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _curPage;
  _numPages;

  _generateMarkup() {
    this._curPage = this._data.page;
    this._numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1) page 1 and there are other pages
    if (this._curPage === 1 && this._numPages > 1)
      return (
        this._generateMarkupPageOfPages() + this._generateMarkupBtn('next')
      );

    // 2) last page
    if (this._curPage === this._numPages && this._numPages > 1)
      return (
        this._generateMarkupBtn('prev') + this._generateMarkupPageOfPages()
      );

    // 3) other page
    if (this._curPage < this._numPages)
      return (
        this._generateMarkupBtn('prev') +
        this._generateMarkupPageOfPages() +
        this._generateMarkupBtn('next')
      );

    // 4) only 1 page
    return '';
  }

  _generateMarkupPageOfPages() {
    return `<div class="page-number">
              <span class="num-page" id="num-cur-page">${this._curPage}</span> of
              <span class="num-page" id="num-max-pages">${this._numPages}</span>
            </div>`;
  }

  _generateMarkupBtn(angle) {
    const goto = this._data.page + (angle === 'next' ? 1 : -1);
    const iconAngle = angle === 'next' ? 'right' : 'left';

    return `
             <button data-goto="${goto}"class="btn--inline pagination__btn--${angle}">
              <span>Page ${goto}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-${iconAngle}"></use>
              </svg>
            </button>
            `;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
