const express = require('express');
const cors = require('cors');
const app = express();
const validator = require('validator');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require('cookie-parser');

const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const db = new sqlite3.Database('./db.sqlite3');


app.listen(
    PORT,
    () => console.log(`its alive http://localhost:${PORT}`)
)

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    //check email is valid
    if (!validator.isEmail(email)) {
      res.status(550).send({
        status: "error",
        message: "Email Invalid"
      });
    } else {
      //if it is. Check database.
      db.all('SELECT * FROM user WHERE email = ?', email, (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            status: "error",
            message: "Internal server error"
          });
        } else if (rows.length > 0) {
          res.status(551).send({
            status: "error",
            message: "Email already exists"
          });
        } else {
          //if user does not exist. Make new account.
          db.run('INSERT INTO user (email, password) VALUES (?, ?)', email, password, (err) => {
            if (err) {
              console.log(err);
              res.status(500).send({
                status: "error",
                message: "Internal server error"
              });
            } else {
              //success
              
              res.status(200).send({
                status: "success",
                message: "Account created successfully"
              });
            }
          });
        }
      });
    }
  });
  

app.post('/login', (req, res)=>{
    const {email, password} = req.body;

    //check database for user
    db.all('SELECT * FROM user WHERE email = ? AND password = ?', email, password, (err, rows)=>{
        if (err){
            console.log(err);
        } else if (rows.length === 0){
          //couldnt find rows therefore user not in database
            res.status(401).send({
                status: "Invalid login"
            });
        } else {
          //found matching creds. Login.       
          
          res.status(200).send({
            status: "Found"
        });
        }  
    });
});

app.post('/createmenu', (req, res) => {
  const { infoObject, menuDisplay } = req.body;

  const email = infoObject[0];
  const menuTitle = infoObject[1];

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS menu_items (id INTEGER PRIMARY KEY, email TEXT, menu_title TEXT, type TEXT, item_title TEXT, description TEXT, price REAL, position INTEGER)');
    
    // Insert menu items into the database
    menuDisplay.forEach((item, index) => {
      const { type, title, description, price } = item;
      const position = index;
      const stmt = db.prepare('INSERT INTO menu_items (email, menu_title, type, item_title, description, price, position) VALUES (?, ?, ?, ?, ?, ?, ?)');
      stmt.run(email, menuTitle, type, title, description, price, position);
      stmt.finalize();
    });
  });

  res.status(200).send({});
});

app.get('/menus', (req, res) => {
  const { email } = req.query;

  const query = `SELECT DISTINCT menu_title FROM menu_items WHERE email = ?`;

  db.all(query, [email], (err, rows) => {
    if (err) {
      console.error('Error fetching unique menu titles:', err);
      res.status(500).send({ error: 'Error fetching unique menu titles' });
    } else {
      const uniqueMenuTitles = rows.map(row => row.menu_title);
      res.status(200).send({ menuTitles: uniqueMenuTitles });
    }
  });
});

app.get('/menu/:email/:menuTitle', (req, res) => {
  const { email, menuTitle } = req.params;

  const query = `SELECT * FROM menu_items WHERE email = ? AND menu_title = ? ORDER BY position`;

  db.all(query, [email, menuTitle], (err, rows) => {
    if (err) {
      console.error('Error fetching menu items:', err);
      res.status(500).send({ error: 'Error fetching menu items' });
    } else {
      res.status(200).send({ menu: rows });
    }
  });
});






