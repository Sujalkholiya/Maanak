const mongoose = require("mongoose");

const musiceSchema = new mongoose.Schema({
    uri1 : {type: String, required: true},
    uri2 : {type: String, required: true},
    uri3 : {type: String, required: true},
    uri4 : {type: String, required: true},
    uri5 : {type: String},
    uri6 : {type: String},
    title : {type: String},
    product : {type:mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
});

const imageModel = mongoose.model("Image", musiceSchema);

module.exports = imageModel;