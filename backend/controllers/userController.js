const User = require("../models/userModel")
const bcrypt = require("bcrypt")

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const usercheck = await User.findOne({ username });
        if (usercheck) return res.json({
            msg: "Username already exits", status: false
        })
        const emailnameCheck = await User.findOne({ email });
        if (emailnameCheck) return res.json({
            msg: "email already used", status: false
        })
        const hasedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hasedPassword })
        delete user.password
        return res.json({ user, status: true })
    }
    catch (err) { next(err) }
}


exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username });
        if (!user) return res.json({
            msg: "Incorrect Username or Password", status: false
        })
        const isPasswordvalid = await bcrypt.compare(password, user.password);
        if (!isPasswordvalid) {
            return res.json({
                msg: "Incorrect Username or Password", status: false
            })
        }
        user.password=undefined    
        return res.json({ user, status: true })
    }
    catch (err) { next(err) }
}

exports.setAvatar = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    }
    catch(ex){
        next(ex)
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id: {$ne: req.params.id}}).select([
            "email", "_id", "username", "avatarImage"
        ]);
        return res.json(users);
    }
    catch(ex){
        next(ex);
    }
}