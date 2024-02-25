const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/auth");
const router = express.Router();

const Article = require("../models/Article");
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  const user = req.session.user;

  const articles = await Article.find({})
    .populate("author")
    .populate("category")
    .select("-password")
    .sort("-createdAt");

  const firstArticle = articles[0];
  const trendingBottom = articles.slice(1, 4);
  const trendingSide = articles.slice(4, 8);
  const whatsNew = articles.slice(8, 12);
  const recentArticles = articles.slice(12, 16);

  const locals = {
    user: user,
    articles: articles,
    firstArticle: firstArticle,
    trendingBottom: trendingBottom,
    trendingSide: trendingSide,
    whatsNew: whatsNew,
    recentArticles: recentArticles,
  };
  res.render("user/index", locals);
});

router.get("/profile", (req, res) => {
  const user = req.session.user;
  const locals = {
    user: user,
  };
  res.render("user/profile", locals);
});

router.get("/weather", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;

    const locals = {
      user: user,
    };

    res.render("user/weather", locals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/articles", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const category = req.query.category;
    console.log("Category:", category);

    const find = {};
    if (category) {
      find["category"] = category;
    }
    console.log("Query:", find);

    const articles = await Article.find(find)
      .populate("author")
      .populate("category");
    console.log(articles);
    const categories = await Category.find({});

    const locals = {
      user: user,
      articles: articles,
      categories: categories,
    };

    res.render("user/articles", locals);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/articles/:new", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const articleId = req.params.new;

    const article = await Article.findOne({ _id: articleId })
      .populate({
        path: "comments",
        populate: {
          path: 'user',
          model : 'users'
        },
      })
      .populate("author");
    
    article.comments.sort((a, b) => b.createdAt - a.createdAt);
    console.log(article);
    const articles = await Article.find({}).limit(5);

    const locals = {
      user: user,
      articles: articles,
      article: article,
    };

    res.render("user/article", locals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/login", isNotLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;

    const locals = {
      user: user,
    };

    res.render("auth/login", locals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/signup", isNotLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;

    const locals = {
      user: user,
    };

    res.render("auth/signup", locals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/favourites", isLoggedIn, async (req, res) => {
  try {
    const user = req.session.user;
    const favs = await Article.find({ likes: user.id })
      .populate("author")
      .populate("category")
      .select("-password")
      .sort("-createdAt");
    const locals = {
      user: user,
      articles: favs,
    };

    res.render("user/favourites", locals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
