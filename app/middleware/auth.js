
const isLoggedIn = async (req, res, next) => {
    const user = req.session.user;

    if (!user) {
        return res.status(301).redirect('/login');
    }

    next();
}

const isNotLoggedIn = async (req, res, next) => {
    const user = req.session.user;

    if (user) {
        return res.status(301).redirect('/');
    }

    next();
}

module.exports = {
    isLoggedIn,
    isNotLoggedIn
}