const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

// import db connection
require('./config/db-connection');

// console.log(process.env.NODE_ENV);
app.listen(port, () => {
  console.log(`App running on server:: localhost:${port}...`);
});

app.get('/', () => {
  console.log('Welcome to my server');
});
