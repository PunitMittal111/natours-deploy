/* eslint-disable */
// Logging in Users with Our API - Part 1 //
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  //   alert(email, password);
  // console.log('login');
  // console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    // Show alert and reload the page that really sure that our api call was successful
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in suceessfully!');
      // After one and half seconds load the front page
      window.setTimeout(() => {
        location.assign('/'); // So in order to load another page
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    // console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
