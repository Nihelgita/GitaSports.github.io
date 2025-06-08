document.addEventListener('DOMContentLoaded', () => {
  const navbarNav = document.querySelector('.navbar-nav');
  const hamburgerMenu = document.querySelector('#hamburger-menu');
  const searchForm = document.querySelector('.search-form');
  const searchBox = document.querySelector('#search-box');
  const searchButton = document.querySelector('#search-button');
  const shoppingCart = document.querySelector('.shopping-cart');
  const cartButton = document.querySelector('#shopping-cart-button');

  // Toggle hamburger menu
  hamburgerMenu.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    navbarNav.classList.toggle('active');
  });

  // Toggle search form
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    searchForm.classList.toggle('active');
    searchBox.focus();
  });

  // Toggle shopping cart
  cartButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    shoppingCart.classList.toggle('active');
  });

  // Close elements when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove('active');
    }
    if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove('active');
    }
    if (!cartButton.contains(e.target) && !shoppingCart.contains(e.target)) {
      shoppingCart.classList.remove('active');
    }
  });

  // Initialize feather icons
  feather.replace();
});