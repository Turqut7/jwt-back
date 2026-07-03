const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = 4000;

const user = {
  id: 1,
  email: "student@example.com",
  password: "salam123",
  fullName: "User Student",
};

const JWT_SECRET = "menimSecretKeyim";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Application is running",
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    message: "Login successfully",
    token: token,
  });
});

function checkToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token is missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is invalid",
    });
  }
}

app.get("/secret", checkToken, (req, res) => {
  res.json({
    message: "Bu qorunan datadir",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running port ${PORT}`);
});
