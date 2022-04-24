const { subject } = require("@casl/ability");
const midtransClient = require("midtrans-client");

const Invoice = require("./model");
const { policyFor } = require("../policy");
const config = require("../config");

let snap = new midtransClient.Snap({
  isProduction: config.midtrans.isProduction,
  serverKey: config.midtrans.serverKey,
  clientKey: config.midtrans.clientKey,
});

async function show(req, res, next) {
  try {
    // (1) dapatkan _route_ params `order_id`
    let { order_id } = req.params;

    // (2) dapatkan data `invoice` berdasarkan `order_id`
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");

    // (1) deklarasikan `policy` untuk `user`
    let policy = policyFor(req.user);

    // (2) buat `subjectInvoice`
    let subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });

    // (3) cek policy `read` menggunakan `subjectInvoice`
    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat invoice ini.`,
      });
    }

    // (1) respon ke _client_
    return res.json(invoice);
  } catch (err) {
    return res.json({
      error: 1,
      message: `Error when getting invoice.`,
    });
  }
}

async function initiatePayment(req, res) {
  try {
    // (1) dapatkan parameter `order_id`
    let { order_id } = req.params;

    // (2) cari invoice berdasarkan `order_id` dapatkan juga relasi `order` dan `user`
    let invoice = await Invoice.findOne({ order: order_id })
      .populate("order")
      .populate("user");

    // (3) jika invoice tidak ditemukan, stop
    if (!invoice) {
      return res.json({
        error: 1,
        message: "Invoice not found",
      });
    }

    // (4) bangun parameter untuk dikirimkan ke midtrans
    let parameter = {
      transaction_details: {
        order_id: invoice.order._id,
        gross_amount: invoice.total,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: invoice.user.full_name,
        email: invoice.user.email,
      },
    };

    // (5) kirimkan informasi invoice / order yang hendak di bayar ke midtrans
    let response = await snap.createTransaction(parameter);

    // (6) response ke client dengan resposne dari midtrans

    return res.json(response);
  } catch (err) {
    // (7) penanganan error
    return res.json({
      error: 1,
      message: "Something when wrong",
    });
  }
}

module.exports = {
  show,
  initiatePayment,
};
