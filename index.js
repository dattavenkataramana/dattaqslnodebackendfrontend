const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'fewdatabase.db');
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log(`Server running at http://localhost:3001`);
    });
  } catch (e) {
    console.error(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// GET API
app.get("/login/", async (req, res) => {
  
    const getQueryDatta = "SELECT * FROM  login";
    const datas = await db.all(getQueryDatta);

    res.send(datas);
});

//POST API
app.post('/login/', async (req, res) => {
  try {
    const { name, password } = req.body;
    const query = 'SELECT * FROM login WHERE name = ? AND password = ?';
    const user = await db.get(query, [name, password]);
    if (user) {
      res.status(200).send('Login successful!');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});



 


 