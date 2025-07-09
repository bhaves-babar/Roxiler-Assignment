const express = require("express");
const cors = require("cors"); // Import cors
const app = express();
const PORT = 5000;
const connectDB = require('./DataBase');
const productRoute=require('./Routes/productRoute');
connectDB();

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(express.json());

app.get('/check', (req, res) => {
    res.send("Hello server is running...");
});

app.use('/a',productRoute);


app.listen(PORT, () => {
    console.log(`Server is online on port ${PORT}`);
});
