const express = require('express');
const app = express ();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session)
const dotenv = require('dotenv');
const passport = require('passport')
const initializePassport = require('./passport-config')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')


const userRoute = require('./route/userRoute');
// const workoutRoute = require('./route/workoutRoute')
// const mealRoute = require('./route/mealRoute')
// const exerciseRoute = require('./route/exerciseRoute')
const bookingRoute = require('./route/bookingRoute')
// const tourRoute = require('./route/tourRoute');
const reviewRoute = require('./route/reviewRoute');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');
const productRoute = require('./route/productRoute')
const cartRoute = require('./route/cartRoute')
const wishlistRoute = require('./route/wishilistRoute')
dotenv.config({path: './config.env'});



// console.log(process.env.TEST)

// app.use(helmet())

// if(process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

// const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: 'Too many requests at the moment',
// });

// app.use('/api', limiter);

// app.use(express.json());
//app.use(express.static(`${__dirname}/public`));

// app.use(mongoSanitize());
// app.use(xss());
// app.use(hpp({
//     whitelist: [
//         'duration',
//         'ratingsQuantity',
//         'ratingsAverage',
//         'maxGroupSize',
//         'difficulty',
//         'price'
//     ]
// }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your Next.js frontend URL
    credentials: true  // Allows cookies to be sent
  }));

  const store = new MongoDBSession({
    uri: process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD),
    collection: 'Sessions'
})

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Use secure cookies in production (with HTTPS)
        sameSite: 'None' // Ensure the cookie can be sent in cross-origin requests
    },
    store: store
}))



// const corsOptions = {
//     origin: 




app.use(cookieParser(process.env.SESSION_SECRET))

app.use(passport.initialize())
app.use(passport.session())
initializePassport(passport)


app.use('/api/v1/users', userRoute);
// app.use('/api/v1/workouts', workoutRoute);
// app.use('/api/v1/meal', mealRoute);
// app.use('/api/v1/exercise', exerciseRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/product', productRoute)
// app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/wishlist', wishlistRoute)

// app.all('*', (req, res, next) => {

//     next(new AppError(`Can't find ${req.originalUrl}`, 404));
// });

app.use(errorHandler);

app.get('/test', (req, res) => {
    res.send('h')
})


module.exports = app;

app.get("/status", (req, res) => {
    const status = {
        'status': "running"
    }

    res.send(status)
} );

// app.post("/posting", (req, res) => {
    
//     console.log( req )
// })

// app.get('/api/v1/tours', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tours: "tours"
//         }
//     })

// })

// app.post('/api/v1/tours', (req, res) => {
//     console.log(req.body);
//     res.send("done");
// })

// app.get('/api/v1/tours/:id', (req, res) => {
//     console.log(req.params.id);
    
//     res.status(200).json({
//         message: "ok"
//     })
// })







