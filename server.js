const express = require('express');
const cors = require('cors');
const mariadb = require('mariadb');
require('dotenv').config();


const port = process.env.PORT || 3005;

const app = express();

//create a connection pool for the mariaDB
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

// enable CORS for all routes
app.use(cors({
    origin: '*'
}));

app.use(express.json());

// define your routes here
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/runQuery', async (req, res) => {
    const { query } = req.body;

    console.log(query);
    try{
    const connection = await pool.getConnection();

    const queryResults = await connection.query(query);
    await connection.release();
    res.status(200).json(queryResults)
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})

// define a catchall error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong, hitting catchall error handler'});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
