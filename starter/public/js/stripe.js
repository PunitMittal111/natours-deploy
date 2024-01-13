// // Processing Payments on the Front-End //
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51OVtsaSECZc5jUdZ9MKkEPOWUewSYLBId2kskAI8XPWVsAROauC23xF2Q2Dxyk9ICdqJqeSyrm4peisCMCJvRwnu00L6wsIOJq',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
