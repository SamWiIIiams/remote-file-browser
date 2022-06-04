const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const { getDetails, validatePath, getDirectory } = require('./helper');
const PORT = process.env.PORT || 8080
const secret = "shouldbesavedinaprocess.envfile"

const app = express();
app.use(express.static(path.join(__dirname, 'build')))
console.log(path.join(__dirname, '../client/build'));
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
  res.header('Access-Control-Allow-Credentials', 'true')
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    key: "session-cookie",
    secret: secret,
    resave: "false",
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 minutes
      sameSite: 'lax'
    },
  })
);

const db = {
  credentials: [
    {
      username: "Sam",
      password: "$2b$10$5AeC8jFPoUb3/GTwdlFp8OYAYeBhTez3H8oNr38bQhuZgAsdt/iNe",
      id: 1,
    },
    {
      username: "zmb3",
      password: "$2b$10$EYRC9rtygMqQO3BYdgmIMeKEr0e6l/pweFkL1FNWx01NMGZtgrG9q",
      id: 2,
    },
    {
      username: "hatched",
      password: "$2b$10$YnaGFGjHY3jy9z4bn9POnu/xgQ6bL1bXSDaagIqITmDlrETHveR5W",
      id: 3,
    },
    {
      username: "ibeckermayer",
      password: "$2b$10$NIOrIDM2iTGK.ZNWF37PYOe69TK3K7s2Wqpn2URmtNL5YOUpDmTxC",
      id: 4,
    },
    {
      username: "pierrebeaucamp",
      password: "$2b$10$EiirF6Yx7a9l0ibQ4/uiYOC4ebyD4agGEDW4ctfYRE8zUwzgUPJvm",
      id: 5,
    },
  ]
};

app.get("/test", (req, res) => {
  res.json({message: 'hello from server!'});
})

app.post("/directory", (req, res) => {
  if (req.session.user) {
    const safePath = validatePath(req.body.path);
    //this just gets the last item in the path
    const dirName = getDirectory(safePath);
    if (safePath !== "Access denied") {
      fs.readdir(safePath, (err, files) => {
        let fileObject = [];
        if (err) {
          console.error(err);
          res.status(400).send("nothing resides in this location")
          console.log("path requested: " + safePath)
        } else {
          files.forEach((file, idx) => {
            fileObject.push(getDetails(safePath, file, idx));
          });
          Promise.all(fileObject).then((result) => {
            res.status(200).send({ files: {name: dirName, result: result }});
          });
        }
      });
    } else res.sendStatus(401);
  } else {
    console.error("No valid session cookie received")
    res.status(401).send({message: "no active user session"})
  }
});

app.get('/login', (req, res) => {

  if (req.session.user) {
    res.status(200).send({
      loggedIn: true,
      userId: req.session.userId,
      message: "User Authenticated",
    })
  } else {
    res.status(401).send({loggedIn: false})
  }
});

app.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(400).send("No session to end");
    } else {
      res.status(200).send("logged out successfully");
    }
  })
});

app.post('/login', (req, res) => {
    const sentUsername = req.body.username;
    const sentPassword = req.body.password;

    // bcrypt.hash(sentPassword, saltRounds, (err, hash) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   res.status(200).send(hash);
      
    // })
    let match = false
    const user = db.credentials.find(({ username }) => username === sentUsername )
    if (user) {
      match = bcrypt.compareSync(sentPassword, user.password);
    } 
    if (match) {
      req.session.user = user;
      res.status(200).send({
        loggedIn: true,
        userId: user.id, 
        message: "logged in successfully!"
      })
    } else {
      res.status(401).send({
        loggedIn: false, 
        message: "Login failed; invalid user ID or password"
      });
  }
})

app.get('/directories', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get("/directories/*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(PORT, () => {
    console.log("server running. Listening on port: " + PORT);
})

module.exports = app;