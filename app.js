const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const secrets = require("./api-keys/api-keys");
const multer = require("multer");

const errorController = require("./controllers/error");
const shopController = require("./controllers/shop");
const adminController = require("./controllers/admin");
const {isAuth} = require("./middleware/is-auth");
const User = require("./models/user");

const MONGODB_URI = secrets.MONGODB_URI;
console.log(MONGODB_URI)
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (rew, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

adminController.genereteAdmin();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, filterFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));


app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.user && req.session.user.role == 'Admin';
  res.locals.env_name = secrets.ENV_NAME;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.post("/create-order", isAuth, shopController.postOrder);

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI, {
    server: {
      readPreference: "nearest",
      strategy: "ping"
    },
    replset: {
      rs_name: "rs0",
      readPreference: "nearest",
      strategy: "ping"
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    app.listen(secrets.PORT);
  }).catch(err => {
    console.log(err);
  });
