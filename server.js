require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
const authRoute = require('./src/api/auth');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// be    check
const port = process.env.PORT || 8801;
app.listen(port, () => {
    console.log(`BE::: Running::: Port ${port}`);
});

// declare route
app.use('/', authRoute)


// db check
app.listen(process.env.DB_PORT, () => {
    console.log(`DB::: Running::: Port ${process.env.DB_PORT}`);
});

// validate route
app.use((req, res, next) => {
    console.log('req', req.originalUrl)
    next(createError.NotFound('This route does not exist.'))
})

// err handler
app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message
    })
})