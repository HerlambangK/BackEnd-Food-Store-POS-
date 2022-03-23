// (1) import package mongoose
const mongoose = require("mongoose");

// (2) kita import konfigurasi terkait MongoDB dari `app/config.js`
const { dbHost, dbName, dbPort, dbUser, dbPass } = require("../app/config");

console.log("hallow", dbHost, dbName, dbPort, dbUser, dbPass);

// (3) connect ke MongoDB menggunakan konfigurasi yang telah kita import
//root_admin:123456@localhost:27017/foodstore

// mongoose.connect(`mongodb://root_admin:123456@localhost:27017`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   //   useFindAndModify: false,
//   //   useCreateIndex: true,
// });

mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

// sukses
// mongoose.connect(`mongodb://root_admin:123456@localhost:27017`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   //   useFindAndModify: false,
//   //   useCreateIndex: true,
// });

// mongoose.connect(
//   `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   }
// );

// (4) simpan koneksi dalam constant `db`
const db = mongoose.connection;

// (5) export `db` supaya bisa digunakan oleh file lain yang membutuhkan
module.exports = db;
