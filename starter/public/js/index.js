/* eslint-disable */
// console.log('Hello from parcel!');

// Logging in Users with Our API - Part 3 //
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSetting } from './updateSetting';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// Including a Map with Mapbox - Part 1 //
// DELEGATION
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(email, password);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

// Updating User Data with Our API //
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    // Adding Image Uploads to Form //
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);
    updateSetting(form, 'data');
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateSetting({ name, email }, 'data');
  });

// Updating User Password with Our API //
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSetting(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    // All Feilds are empty
    document.querySelector('.btn--save-password').textContent = 'Save passord';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// Processing Payments on the Front-End //
if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
