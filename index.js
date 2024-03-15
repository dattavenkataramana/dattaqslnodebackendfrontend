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
  try {
    const getQueryData = "SELECT * FROM login";
    const datas = await db.all(getQueryData);
    res.send(datas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

// POST API
app.post('/login/', async (req, res) => {
  try {
    const { name, password } = req.body;
    const query = 'INSERT INTO login(username, password) VALUES (?, ?)';
    const result = await db.run(query, [name, password]);
    if (result.lastID) {
      res.status(200).send('Login successful!');
    } else {
      res.status(401).send('Failed to add user');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});
