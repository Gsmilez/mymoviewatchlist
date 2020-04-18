const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  plot: {
    type: String,
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
  },
  movieId: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Movie", MovieSchema);
