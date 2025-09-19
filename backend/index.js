const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();


connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);



const { authRouter } = require("./Routes/auth.routes");
const { noteRouter } = require("./Routes/note.routes");
const { planRouter } = require("./Routes/plan.routes");

app.use("/", authRouter);
app.use("/notes", noteRouter);
app.use("/", planRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Welcome to the root page" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})

module.exports = app;
