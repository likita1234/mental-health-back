const mongoose = require('mongoose');

// encode password
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const database = process.env.DATABASE;

// =========> Connection URL setup
let connectionUrl;
if (process.env.NODE_ENV === 'production') {
  connectionUrl = `mongodb+srv://${username}:${password}@cluster0.kow5ofo.mongodb.net/${database}?retryWrites=true&w=majority`;
} else {
  connectionUrl = `${process.env.LOCAL_URL}/${process.env.LOCAL_DATABASE}`;
}

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}
// connection
mongoose.connect(connectionUrl, mongooseOptions);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to the database');
});
