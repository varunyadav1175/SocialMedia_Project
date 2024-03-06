const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
