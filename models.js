const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const URLSchema = new mongoose.Schema({
    original_url : String
})

URLSchema.plugin(AutoIncrement,{inc_field:"short_url"})

const URLModel = mongoose.model("URLModel",URLSchema)

module.exports = {URLModel}