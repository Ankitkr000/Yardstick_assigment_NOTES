const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://yardstick-assigment-n-git-c6f848-ankit-kumars-projects-1aafe4d1.vercel.app",
  "https://yardstick-assigment-notes-tw49.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests explicitly
app.options("*", cors());




const { authRouter } = require("./Routes/auth.routes");
const { noteRouter } = require("./Routes/note.routes");
const { planRouter } = require("./Routes/plan.routes");

app.use("/", authRouter);
app.use("/notes", noteRouter);
app.use("/", planRouter);

app.get("/", (req, res) => {
  console.log("From root page");
  res.status(200).json({ success: true, message: "Welcome to the root page" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
