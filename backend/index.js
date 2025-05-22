import express from 'express'
import dotenv from 'dotenv'
import cors from "cors";
import connectDB from './db/index.js';
import authRoutes from "./routes/auth.route.js";
import urlRoutes from "./routes/url.route.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("Hello from Server!");
})

app.use("/api/auth", authRoutes);

app.use("/api/url", urlRoutes);
app.use("/", urlRoutes);