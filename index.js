const express = require('express');
const mongoose = require('mongoose');

// Routes
const apiRouter = require('./routes/api');
const webRouter = require('./routes/web');

const app = express();

// Middleware
app.use(express.json());
app.use('/api', apiRouter);
app.use('/', webRouter);

const mongoURI = "mongodb+srv://Eashwar:Eashwar20@esproject.qc15s.mongodb.net/smDB?retryWrites=true&w=majority";
// DB Connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected to DB!'));

// PORT selection and firing up the Server!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));