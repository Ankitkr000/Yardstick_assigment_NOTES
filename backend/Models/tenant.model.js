const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, //  acme, globex
  subscription: {
    type: String,
    enum: ["free", "pro"],
    default: "free",
  },
});

module.exports = mongoose.model("Tenant", tenantSchema);
