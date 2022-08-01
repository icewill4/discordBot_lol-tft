const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  pseudoDiscord: {
    type: String,
    required: true,
  },
  pseudoLoL: {
    type: String,
    required: true,
  },
  soloqTier: {
    type: String,
    required: false,
  },
  soloqRank: {
    type: String,
    required: false,
  },
  soloqLP: {
    type: Number,
    required: false,
  },
  flexTier: {
    type: String,
    required: false,
  },
  flexRank: {
    type: String,
    required: false,
  },
  flexLP: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("members", schema, "members");
