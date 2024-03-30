const mongoose = require('mongoose');

// encode password
const password = encodeURIComponent(process.env.PASSWORD);

// Remote Connection url
// const connectionUrl = `mongodb+srv://${process.env.USERNAME}:${password}@${process.env.CLUSTER}.kow5ofo.mongodb.net/${process.env.REMOTE_DATABASE}?retryWrites=true&w=majority`;
// Local Connection
const connectionUrl = `${process.env.LOCAL_URL}/${process.env.LOCAL_DATABASE}`;
// connection
mongoose.connect(connectionUrl, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to the database');
});
