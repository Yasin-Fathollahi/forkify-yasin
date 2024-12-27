import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // 0) update the result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) getting the id from the hash
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 2) rendering the spinner
    recipeView.renderSpinner();

    // 3) getting the data about recipe
    await model.loadRecipe(id);

    // 4) rendering recipe data
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) getting the query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) render spinner
    resultsView.renderSpinner();

    // 3) getting the data
    await model.loadSearchResults(query);

    // 4) rendering the search results
    resultsView.render(model.getSearchResultsPage());

    // 5) rendering the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //rendering the search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new btns
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  // update the servings
  model.updateServings(updateTo);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmarks
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update the view
  recipeView.update(model.state.recipe);

  // 3) render to the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show recipe spinner
    addRecipeView.renderSpinner();

    // upload the recipe to the API (async)
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    //success Message
    addRecipeView.renderMessage();

    //displaying the bookmark in the list
    bookmarksView.render(model.state.bookmarks);

    //change the id in the url
    history.pushState(null, '', `#${model.state.recipe.id}`);

    // closing the modal window
    setTimeout(
      addRecipeView.toggleWindow.bind(addRecipeView),
      MODAL_CLOSE_SEC * 1000
    );
  } catch (err) {
    addRecipeView.renderError(`${err.message}😿`);
  }
};

const controlAddIngredient = function () {
  console.log('hi');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.addHandlerAddIngredient(controlAddIngredient);
};

init();
