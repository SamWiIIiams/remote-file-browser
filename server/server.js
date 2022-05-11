const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { createToken, validateToken } = require('./jwt');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const PORT = process.env.PORT || 5000

const app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,');
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

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-axis-token"]
  if (!token) {
    res.send("no token provided");
  } else {
    jwt.verify(token, "notSoSecret", (err, decoded) => {
      if (err) {
        res.send({auth: false, message: "token failed authentication"});
      } else {
        req.userId = decoded.id;
        next();
      }
    })
  }
}

const db = {
    credentials: [
      {
        username: "Sam",
        password: "$2b$10$5AeC8jFPoUb3/GTwdlFp8OYAYeBhTez3H8oNr38bQhuZgAsdt/iNe",
        id: 1,
      },
      {
        username: "zbm3",
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
  
app.get('/testAPI', (req, res) => {
    res.send("Api connected!")
});

app.get('/login', validateToken, (req, res) => {
  if (req.validated) {
    res.status(200).send({loggedIn: true, message: "Login token validated"})
  }
  // if (req.session.user) {
  //   res.status(200).send({
  //     loggedIn: true,
  //     username: req.session.user.username,
  //   })
  // } else {
  //   res.status(401).send({loggedIn: false})
  // }
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
    
    const user = db.credentials.find(({ username }) => username === sentUsername )
    console.log(user)
    if (user) {
      bcrypt.compare(sentPassword, user.password).then((result) => {
        if (result) {

          const accessToken = createToken(user)

          res.status(200).cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 15,
          }).send({
            loggedIn: true,
            userId: user.id, 
            message: "logged in successfully!"
          })
        } else {
          res.status(401).send({loggedIn: false, message: "Login failed; invalid user ID or password"});
        }
        
      })
    } else {
      res.status(401).send({loggedIn: false, message: "Login failed; invalid user ID or password"});
    }
    //todo: make responses send in same amount of time***
    // if (match) {
    //   req.session.user = account;
    //   res.status(200).send({loggedIn: true, message: "logged in successfully", user: req.session.user});
    // } else {
    
    //}
})

app.listen(PORT, () => {
    console.log("server running. Listening on port: " + PORT);
})