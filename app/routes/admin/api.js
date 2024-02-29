const express = require("express");
const { isLoggedIn } = require("../../middleware/auth");
const { isAdmin } = require("../../middleware/permissions");
var router = express.Router();
const {
  profileAvaUpload,
  articleUpload,
  categoryIconUpload,
} = require("../../middleware/utils");

const Article = require("../../models/Article");
const Category = require("../../models/Category");
const User = require("../../models/User");

router.post(
  "/api/articles/add",
  isLoggedIn,
  isAdmin,
  articleUpload.fields([
    { name: "cover", maxCount: 3 },
    { name: "attachments", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const user = req.session.user;

      const coversFiles = req.files["cover"];
      const attachmentsFiles = req.files["attachments"];

      const covers = coversFiles.map(
        (file) => `/images/uploads/article_images/${file.filename}`
      );
      const attachments = attachmentsFiles.map(
        (file) => `/images/uploads/article_images/${file.filename}`
      );

      const { title, content, author, category } = req.body;

      if (!title || !content || !author || !category) {
        res.status(400).json({ message: "Some fields empty!" });
        return;
      }

      const data = {
        title: title,
        content: content,
        author: author,
        category: category,
        attachments: [],
        cover: [],
      };

      if (attachments.length > 0) {
        data.attachments.push(...attachments);
      }

      if (covers.length > 0) {
        data.cover.push(...covers);
      }

      console.log(data);

      const article = new Article(data);

      await article.save();

      const categories = await Category.find({});
      const authors = await User.find({});
      const locals = {
        user: user,
        article: article,

        categories: categories,
        authors: authors,
      };

      res.redirect("/admin/articles");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/api/categories/:category/update",
  isLoggedIn,
  isAdmin,
  categoryIconUpload.fields([{ name: "icon", maxCount: 3 }]),
  async (req, res) => {
    try {
      const user = req.session.user;
      const categoryId = req.params.category;

      const iconFile = req.files["icon"]
        ? `/images/uploads/category_icons/${req.files["icon"][0].filename}`
        : undefined;

      const { name } = req.body;

      const data = {};

      if (name) {
        data.name = name;
      }
      if (iconFile) {
        data.icon = iconFile;
      }

      const category = await Category.findOneAndUpdate(
        { _id: categoryId },
        { ...data },
        { new: true }
      );

      if (!category) {
        res.render("user/notfound", { user: user });
      }
      res.redirect(`/admin/categories/${categoryId}`);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/api/categories/:category/delete", async (req, res) => {
  try {
    const categoryId = req.params.category;

    const category = await Category.findOneAndDelete({ _id: categoryId });
    await Article.deleteMany({ category: category._id });
    if (!category) {
      res
        .status(404)
        .json({ message: `Category with id ${categoryId} not found!` });
    }

    res.status(200).json({
      message: `Category with id ${categoryId} deleted successfully!`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/api/categories/add",
  isLoggedIn,
  isAdmin,
  categoryIconUpload.fields([{ name: "icon", maxCount: 1 }]),
  async (req, res) => {
    try {
      const user = req.session.user;
      const categoryId = req.params.category;

      const iconFile = req.files["icon"]
        ? `/images/uploads/category_icons/${req.files["icon"][0].filename}`
        : undefined;

      const { name } = req.body;

      const data = {};

      if (name) {
        data.name = name;
      }
      if (iconFile) {
        data.icon = iconFile;
      }
      console.log(data);
      const category = new Category({ ...data });
      await category.save();

      if (!category) {
        res.render("user/notfound", { user: user });
      }
      res.redirect(`/admin/categories`);
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/api/articles/:article/delete",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const user = req.session.user;

      const articleId = req.params.article;

      const article = await Article.findOneAndReplace({ _id: articleId });

      if (!article) {
        res
          .status(404)
          .json({ message: `Article with id ${articleId} not found` });
      }

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/api/articles/:article/update",
  isLoggedIn,
  isAdmin,
  articleUpload.fields([
    { name: "cover", maxCount: 3 },
    { name: "attachments", maxCount: 3 },
  ]),
  async (req, res) => {
    try {
      const user = req.session.user;
      const articleId = req.params.article;

      const coversFiles = req.files["cover"];
      const attachmentsFiles = req.files["attachments"];

      const covers = [];
      const attachments = [];

      if (coversFiles) {
        coversFiles.map((file) => {
          covers.push(`/images/uploads/article_images/${file.filename}`);
        });
      }

      if (attachmentsFiles) {
        attachmentsFiles.map((file) => {
          attachments.push(`/images/uploads/article_images/${file.filename}`);
        });
      }

      const { title, content, author, category } = req.body;
      const data = {};
      if (title) {
        data.title = title;
      }
      if (content) {
        data.content = content;
      }
      if (author) {
        data.author = author;
      }
      if (category) {
        data.category = category;
      }
      if (attachments.length > 0) {
        data.$push = {
          attachments: {
            $each: attachments,
          },
        };
      }

      if (covers.length > 0) {
        data.$push = data.$push || {};
        data.$push.cover = {
          $each: covers,
        };
      }

      console.log(data);

      const article = await Article.findOneAndUpdate({ _id: articleId }, data, {
        new: true,
      })
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
  }
);

router.post("/api/comments/:comment/update", async (req, res) => {
  try {
    const user = req.session.user;
    const commentId = req.params.comment;
    const commentInput = req.body.commentInput;

    const article = await Article.findOneAndUpdate(
      { "comments._id": commentId },
      {
        $set: {
          "comments.$.comment": commentInput,
        },
      },
      { new: true }
    );

    if (!article) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    res.redirect(`/admin/comments/${commentId}`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/comments/:comment/delete", async (req, res) => {
  try {
    const user = req.session.user;
    const commentId = req.params.comment;

    const article = await Article.findOneAndUpdate(
      { "comments._id": commentId },
      {
        $pull: {
          comments: { _id: commentId },
        },
      },
      { new: true }
    );

    if (!article) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/api/comments/add", async (req, res) => {
  try {
    const user = req.session.user;
    const { article, comment } = req.body;

    if (!article || !comment) {
      res.status(400).json({ message: "Some fields are empty" });
    }

    const commentData = {
      user: user.id,
      comment: comment,
    };

    const articleToInsert = await Article.findOneAndUpdate(
      { _id: article },
      {
        $push: {
          comments: commentData,
        },
      },
      { new: true }
    );

    if (!articleToInsert) {
      res
        .status(404)
        .json({ message: `Article with id ${articleId} not found!` });
    }

    res.redirect("/admin/comments");
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/api/users/:user/update",
  isLoggedIn,
  isAdmin,
  profileAvaUpload.fields([{ name: "avatar", maxCount: 1 }]),
  async (req, res) => {
    try {
      const user = req.session.user;
      const userId = req.params.user
      const ava = req.files["avatar"]
        ? `/images/uploads/user_avas/${req.files["avatar"][0].filename}`
        : undefined;
      const { username, name, lastname, email } = req.body;
      const data = {};

      if (username) {
        data.username = username
      }
      if (name) {
        data.name = name
      }
      if (lastname) {
        data.lastname = lastname
      }
      if (email) {
        data.email = email
      }

      if (ava) {
        data.avatar = ava  
      }

      const findUser = await User.findOneAndUpdate({ _id: userId },
        data,
        { new: true }
      );

      if (!findUser) {
        res.render('user/notfound');
      }

      res.redirect(`/admin/users/${userId}`);

    } catch (error) { 
      console.log(error);
    }
  }
);

module.exports = router;
