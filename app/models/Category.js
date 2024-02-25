const mongoose = require("mongoose");

const categorySheme = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique : true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Category = mongoose.model("categories", categorySheme, "categories");

module.exports = Category;
