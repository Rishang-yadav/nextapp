// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// // Define the Image schema
// const fileSchema = new Schema({
//   fileName: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     required: true,
//   },
//   size: {
//     type: Number,
//     required: true,
//   },
//   dataUrl: {
//     type: String,
//     required: true,
//   },
//   cardinal_address: {
//     type: String,
//     required: true,
//   },
//   cardinal_pubkey: {
//     type: String,
//     required: true,
//   },
//   ordinal_address: {
//     type: String,
//     required: true,
//   },
//   ordinal_pubkey: {
//     type: String,
//     required: true,
//   },
//   wallet: {
//     type: String,
//     required: true,
//   },
//   order_id: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//   },
//   fee_rate: {
//     type: Number,
//     required: true,
//   },
//   inspiration_fee: {
//     type: Number,
//     required: true,
//   },
//   privkey: {
//     type: String,
//     required: true,
//   },
//   left: {
//     type: Number,
//     required: true,
//   },
//   tapKey: {
//     type: Number,
//     required: true,
//   },
//   cblock: {
//     type: String,
//     required: true,
//   },
//   inscription_address: {
//     type: String,
//     required: true,
//   },
//   txsize: {
//     type: Number,
//     required: true,
//   },
//   network: {
//     type: String,
//     enum: ["testnet", "mainnet"],
//     required: true,
//   },
// });

// // Create the Image model
// const FileData =
//   mongoose.models.FileData || mongoose.model("FileData", fileSchema);
// export default FileData;


const mongoose = require('mongoose');

const fileDataSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  dataUrl: { type: String, required: true },
  cardinal_address: { type: String, required: true },
  cardinal_pubkey: { type: String, required: true },
  ordinal_address: { type: String, required: true },
  ordinal_pubkey: { type: String, required: true },
  wallet: { type: String, required: true },
  order_id: { type: String, required: true },
  status: { type: String, required: true },
  txid:{ type: String,required:false},
  fee_rate: { type: Number, required: true },
  inscription_fee: { type: Number, required: false },
  privkey: { type: String, required: true },
  leaf: { type: String, required: false },
  tapkey: { type: String, required: false },
  cblock: { type: String, required: true },
  inscription_address: { type: String, required: true },
  txsize: { type: Number, required: true },
  network: { type: String, required: true }
});

const FileData =mongoose.models.FileData || mongoose.model('FileData', fileDataSchema);

export default FileData;
