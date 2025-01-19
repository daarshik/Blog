const jwt = require("jsonwebtoken");
const admin = require("../firebase");
const prisma = require("../schemaPrisma");
const dotenv = require("dotenv");

dotenv.config();
const REFRESH_TOKENS = [];

const signIn = async (req, res) => {
  const idToken = req.body.idToken;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const email = decodedToken.email;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: decodedToken.name || "Anonymous",
        },
      });
    }
    console.log({ user });

    // Generate tokens
    const accessToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    REFRESH_TOKENS.push(refreshToken);

    // Send tokens as cookies

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    return res.send({ message: "logged in", accessToken, loggedIn: true });
  } catch (error) {
    res.status(401).json({ error: "Invalid ID token" });
  }
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !REFRESH_TOKENS.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = jwt.sign(
        { email: user.email, id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { email: user.email, id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Unauthorized User" });
  }
};

const fetchUserDetail = (req, res) => {
  if (!req.cookies.refreshToken)
    return res.status(403).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = jwt.sign(
      { email: decoded.email, id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).send({ accessToken, loggedIn: true });
  } catch (error) {
    return res.status(401).json({ error: "Token expired. Please refresh." });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully", loggedIn: false });
};

module.exports = { signIn, logout, refresh, fetchUserDetail };
