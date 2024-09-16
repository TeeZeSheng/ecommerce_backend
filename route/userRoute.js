const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const passport = require('passport');
// const workoutController = require('./../controllers/workoutController');
// const mealPlanController = require('./../controllers/mealPlanController')

const router = express.Router();

router.post('/signup', authController.signup);

router.get('/testing', (req, res, next) => {
    console.log(req.isAuthenticated())
    res.status(200).json({
        status: 'ok',

    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(req.sessionID)
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({ message: 'Login failed' }); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).json({ message: 'Login successful' });
        });
    })(req, res, next);
});

// router.get('/me', authController.protect, userController.getOneUser)

router.post('/forgotPassword', authController.forgetPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/changePassword', authController.protect, authController.updatePassword);

router.patch('/updateData', authController.protect, userController.uploadPhoto, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.route('/').get(userController.getAllUsers).post(userController.createUser);

// router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

router.route('/preference').post(authController.protect, userController.setPreference);

router.route('/userLoginDets').get(authController.getLoginDetails)

router.route('/updateProgress').post(authController.protect, userController.setProgress)

router.route('/getProgress/:userId').get(authController.protect, userController.getProgress)

router.get('/getOneUser', userController.getOneUser)

// router.get('/getMyMealPlan/:id', mealPlanController.getMyMealPlan)

module.exports = router;