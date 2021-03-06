var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// --> import file product router
const productRouter = require("./app/products/router");

// --> import file category router
const categoryRouter = require("./app/categories/router");

// --> import file tag router
const tagRouter = require("./app/tag/router");

// --> import file auth router
const authRouter = require("./app/auth/router");

// --> import file decodeToken router
const { decodeToken } = require("./app/auth/middleware");

// --> import file wilayahRouter
const wilayahRouter = require("./app/wilayah/router");

const deliveryRouter = require("./app/delivery-address/router");

const cartRouter = require("./app/cart/router");

const orderRouter = require("./app/order/router");

const invoiceRouter = require("./app/invoice/router");

const cors = require("cors");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(decodeToken());

// (2) gunakan product router
app.use("/api", productRouter);

// (3) gunakan category router
app.use("/api", categoryRouter);

// (4) gunakan Tag router
app.use("/api", tagRouter);

// (4) gunakan Auth router
app.use("/auth", authRouter);

// (4) gunakan wilayahRouter
app.use("/api", wilayahRouter);

app.use("/api", deliveryRouter);

app.use("/api", cartRouter);

app.use("/api", orderRouter);

app.use("/api", invoiceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
