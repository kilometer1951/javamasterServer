const mongoose = require("mongoose");
const { Schema } = mongoose;
const optionContentSchema = require("./OptionContent");


const optionSchema = new Schema({
  optionName: String,
  optionContent: [optionContentSchema],
});

mongoose.model("options", optionSchema);
