require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");
const database = require("./config/database");
const authRoutes = require("./routes/auth");

require("./models/AuthSession");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("JB Music Search API Running");
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await database.authenticate();
    await database.sync();

    app.listen(PORT, () => {
      console.log(`Database connected`);
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
