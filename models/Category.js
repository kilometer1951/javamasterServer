const mongoose = require("mongoose");
const { Schema } = mongoose;
const subCategorySchema = require("./SubCategory");


const categorySchema = new Schema({
  mainCategory: String,
  subCategory: [subCategorySchema],
});

mongoose.model("categories", categorySchema);
