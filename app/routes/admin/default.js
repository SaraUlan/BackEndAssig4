const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../../middleware/auth");
const { isAdmin } = require("../../middleware/permissions");
const router = express.Router();

const User = require("../../models/User");
const Article = require("../../models/Article");
const Category = require("../../models/Category");
const Weather = require("../../models/Weather");

router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const locals = {
      user: user,
      greeting : res.__("greeting")
    };

    res.render("admin/index", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/articles", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const articles = await Article.find({})
      .populate("category")
      .populate("likes")
      .populate("author")
      .populate({ path: "comments.user" });
    
    const categories = await Category.find({});
    const authors = await User.find({});
    const locals = {
      user: user,
      articles: articles,

      categories: categories,
      authors: authors,
    };
    res.render("admin/articles", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/articles/:article", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const articleId = req.params.article;

    const article = await Article.findOne({ _id: articleId })
      .populate("category")
      .populate("likes")
      .populate("author")
      .populate({ path: "comments.user" });
    const categories = await Category.find({});
    const authors = await User.find({});
    const locals = {
      user: user,
      article: article,

      categories: categories,
      authors: authors,
    };

    res.render("admin/article", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/categories", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const categories = await Category.find({});
    const locals = {
      user: user,
      categories: categories,
    };
    res.render("admin/categories", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/categories/:category", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const categoryId = req.params.category;
    const category = await Category.findOne({ _id: categoryId });
    const locals = {
      user: user,
      category: category,
    };
    res.render("admin/category", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/comments", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const articles = await Article.find({})
      .populate("category")
      .populate("likes")
      .populate("author")
      .populate({ path: "comments.user" });

    const locals = {
      user: user,
      articles: articles,
    };
    res.render("admin/comments", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/comments/:comment", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const commentId = req.params.comment;

    // Find the article containing the specified comment
    const article = await Article.findOne({ "comments._id": commentId })
      .populate("category")
      .populate("likes")
      .populate("author")
      .populate({ path: "comments.user" });

    // Check if the article is not found
    if (!article) {
      return res.status(404).render("user/notfound", { user: user });
    }

    // Find the specific comment within the article
    const comment = article.comments.find((comment) =>
      comment._id.equals(commentId)
    );

    // Check if the comment is not found
    if (!comment) {
      return res.status(404).render("error", { message: "Comment not found" });
    }

    const locals = {
      user: user,
      article: article,
      comment: comment,
    };

    res.render("admin/comment", locals);
  } catch (error) {
    console.log(error);
    // Handle other errors
    res.status(500).render("error", { message: "Internal server error" });
  }
});

router.get("/users", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;

    const users = await User.find({});
    const locals = {
      user: user,
      users: users,
    };
    res.render("admin/users", locals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/users/:user", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const user = req.session.user;
    const userId = req.params.user;

    const findUser = await User.findOne({ _id : userId});
    const locals = {
      user: user,
      findUser: findUser,
    };
    res.render("admin/user", locals);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
