const jwt = require("jsonwebtoken");
const admin = require("../firebase");
const prisma = require("../prisma");
const dotenv = require("dotenv");

dotenv.config();
const REFRESH_TOKENS = [];

const signIn = async (req, res) => {
  const idToken = req.body.idToken;

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const email = decodedToken.email;

    // Check if user exists in DB
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create a new user if doesn't exist
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
      { expiresIn: "1m" }
    );
    const refreshToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.REFRESH_TOKEN_SECRET
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
        { expiresIn: "1m" }
      );
      // res.cookie("accessToken", accessToken, { httpOnly: true });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Unauthorized User" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

module.exports = { signIn, logout, refresh };
