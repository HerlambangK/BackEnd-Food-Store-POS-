// import mongoose
const mongoose = require("mongoose");

// dapatkan module model dan schema dari package monggose
const { model, Schema } = mongoose;

// buat schema
const tagSchema = Schema({
  name: {
    type: String,
    minLength: [3, "Panjang nama kategori minimal 3 karakter"],
    maxLength: [20, "Panjang nama kategori maksimal 20 karakter"],
    require: [true, "Nama kategori harus diisi"],
  },
});

// buat model berdasarkan schema sekaligus export
module.exports = model("Tag", tagSchema);
