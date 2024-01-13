const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Connect to mongoose DB

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    // console.log(con.connections);
    console.log('DB connection successfull'),
  );

// // Creating Documents and testing the model
// const testTour = new Tour({
//   name: 'The Park Camper',
//   // rating: 4.9,
//   price: 463,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR💥', err);
//   });

// console.log(process.env);

// 4) Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}`);
});

// Errors Outside Express: Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
