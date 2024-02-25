const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  feelsLike: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  weatherDescription: {
    type: String,
    required: true,
  },
  sunrise: {
    type: Date,
    required: true,
  },
  sunset: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Weather = mongoose.model("weather", weatherSchema, "weather");

module.exports = Weather;
