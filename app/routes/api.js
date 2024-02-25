const express = require("express");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const { ValidatePassword } = require("../middleware/validation");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth");

var router = express.Router();

const User = require("../models/User");
const News = require("../models/Article");
const Weather = require("../models/Weather");
const Article = require("../models/Article");
const saltRounds = 10;

router.get("/getExchange", async (req, res) => {
  try {
    const apiKey = "a3d1d935db15b37df5c30093";
    const usdToKZT = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );
    const EurToKZT = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/EUR`
    );
    if (!usdToKZT.ok && !EurToKZT.ok) {
      throw new Error(
        `Failed to fetch exchange rates. Status: ${usdToKZT.status}`
      );
    }
    const data = await usdToKZT.json();
    const data2 = await EurToKZT.json();
    const exchangeRateUSD = data.conversion_rates.KZT;
    const exchangeRateEUR = data2.conversion_rates.KZT;

    res.status(200).json({ usdToKZT: exchangeRateUSD, eurToKZT : exchangeRateEUR });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/auth/login", isNotLoggedIn, async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(404)
        .json({ message: "Incorrect username or password" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      is_admin: user.is_admin,
      createdAt: user.createdAt,
    };
    res.status(200).json({ redirect: "/" });
  } catch (error) {
    console.log("Error during login: ", error);
    res.status(500).json({ message: error });
  }
});

router.post("/auth/signup", isNotLoggedIn, async (req, res) => {
  const { username, name, lastname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ redirect: "/login" });
    return;
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/auth/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.status(200).json({ redirect: "/" });
});

router.get("/profile/:username", isLoggedIn, async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
});

router.get("/forecast", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;

    const { city } = req.query;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=72fab1f4bd503167d914a95cdf7e4d31`;
    const response = await fetch(url);
    const weatherData = await response.json();

    const temperatureInCelsius = weatherData.main.temp;
    const feelsLikeInCelsius = weatherData.main.feels_like;

    const temperatureInFahrenheit = (temperatureInCelsius * 9) / 5 + 32;
    const feelsLikeInFahrenheit = (feelsLikeInCelsius * 9) / 5 + 32;

    console.log(weatherData);
    const weather = new Weather({
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: temperatureInFahrenheit,
      feelsLike: feelsLikeInFahrenheit,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      condition: weatherData.weather[0].main,
      weatherDescription: weatherData.weather[0].description,
      sunrise: new Date(weatherData.sys.sunrise),
      sunset: new Date(weatherData.sys.sunset),
      user: user.id,
    });

    const newWeather = (await weather.save()).populate();

    res.json(weather);
  } catch (err) {
    console.error("Error fetching weather:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/forecast/history", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const history = await Weather.find({ user: user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/article/:article/like", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const articleId = req.params.article;

    const article = await Article.findOneAndUpdate(
      { _id: articleId },
      { $push: { likes: user.id } },
      { new: true }
    );

    if (!article) {
      res
        .status(404)
        .json({ message: `Article with id ${articleId} not found` });
    }

    res
      .status(200)
      .json({ message: `Article with id ${articleId} successfully liked` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.post("/article/:article/unlike", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const articleId = req.params.article;

    const article = await Article.findOneAndUpdate(
      { _id: articleId },
      { $pull: { likes: user.id } },
      { new: true }
    );

    if (!article) {
      res
        .status(404)
        .json({ message: `Article with id ${articleId} not found` });
    }

    res
      .status(200)
      .json({ message: `Article with id ${articleId} successfully unliked` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

router.post("/article/:article/comment", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;

    const articleId = req.params.article;
    const comment = req.body.comment;

    const article = await Article.findOneAndUpdate(
      { _id: articleId },
      { $push: { comments: { user: user.id, comment: comment } } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "Success",
      comment: { user: user.username, comment: comment },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = router;
