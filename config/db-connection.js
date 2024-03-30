const mongoose = require('mongoose');

// encode password
const password = encodeURIComponent(process.env.PASSWORD);

// connection url
const connectionUrl = `mongodb+srv://${process.env.USERNAME}:${password}@${process.env.CLUSTER}.kow5ofo.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;

// connection
mongoose.connect(connectionUrl);
// .then(() => {
//   console.log('DB connection successful');
// })
// .catch((err) => {
//   console.log('Something went wrong', err);
// });

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});

db.on('error', console.error.bind(console, 'connection failed'));
