const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const port = 8000;
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", userRoute);
app.use("/blogs", blogRoute);

app.listen(port, () => console.log(`Server Started at PORT:${port}`));
