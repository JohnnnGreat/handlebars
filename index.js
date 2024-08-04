const express = require("express");
const connectLivereload = require("connect-livereload");
const livereload = require("livereload");
const path = require("path");
const { engine } = require("express-handlebars");
const AuthRouter = require("./routes/auth");
const bodyParser = require("body-parser");
const { connectToDb } = require("./config");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

// Create a livereload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "views"));

// Middlewares
app.use(connectLivereload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://0.0.0.0:27017/login" }),
  })
);
app.use("/auth", AuthRouter);

// Views Engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Entry Route
app.get("/", (req, res) => {
  const user = req.session.user;
  res.render("home", { user: user });
});

// Livereload Middleware
app.listen(8080, () => {
  connectToDb();
  console.log("Server is running on port 8080");
});

// Notify livereload server on changes
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
