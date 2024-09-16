const { authenticate } = require('passport')
const authController = require('./controllers/authController')
const User = require('./models/User')

const localStrategy = require('passport-local').Strategy

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({email}).select('+password');
        if (user == null) {
            return done(null, false, {message: "No user"})
        }
        if (!user || !(await user.correctPassword(password, user.password))) {
            return done(null, false, {message: "incorrect password"})
        }

        return done(null, user)

    }
    
    passport.use(new localStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (id, done) =>  {return done(null, await User.findById(id))})
}

module.exports = initialize