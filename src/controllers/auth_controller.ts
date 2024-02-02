import { Request, Response } from "express";
import User, { IUser } from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Document } from "mongoose";

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
const googleSignin = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { tokens } = await client.getToken({
      code: req.body.code,
    });
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const fullName = payload?.name;
    if (email != null) {
      let user = await User.findOne({ email: email });
      if (user == null) {
        user = await User.create({
          fullName,
          email,
          imgUrl: payload?.picture,
        });
      }
      const tokens = await generateTokens(user);
      res.status(200).send({
        fullName: user.fullName,
        email: user.email,
        _id: user._id,
        imgUrl: user.imgUrl,
        ...tokens,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

const register = async (req: Request, res: Response) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const imgUrl = req.body.imgUrl;
  const refreshTokenExpiration = parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    10
  );
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const rs = await User.findOne({ email: email });
    if (rs != null) {
      return res.status(406).send("email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const rs2 = await User.create({
      fullName,
      email,
      password: encryptedPassword,
      imgUrl: imgUrl,
    });
    const tokens = await generateTokens(rs2);
    res.cookie("jwt", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiration,
    });
    // res.json({ accessToken: tokens.accessToken });
    res.status(201).json({
      fullName: rs2.fullName,
      email: rs2.email,
      _id: rs2._id,
      imgUrl: rs2.imgUrl,
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    return res.status(400).send("error missing email or password");
  }
};

const generateTokens = async (user: Document & IUser) => {
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET
  );
  if (user.refreshTokens == null) {
    user.refreshTokens = [refreshToken];
  } else if (!user.refreshTokens.includes(refreshToken)) {
    user.refreshTokens.push(refreshToken);
  }
  await user.save();
  return {
    accessToken,
    refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const refreshTokenExpiration = parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    10
  );
  if (!email || !password) {
    return res.status(400).send("missing email or password");
  }
  try {
    const user = await User.findOne({ email: email });
    if (user == null) {
      return res.status(401).send("email or password incorrect");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("email or password incorrect");
    }

    const tokens = await generateTokens(user);
    res.cookie("jwt", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiration,
    });
    res.json({ accessToken: tokens.accessToken });
    return res.status(200);
  } catch (err) {
    return res.status(400).send("error missing email or password");
  }
};

const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401);
  }
  const refreshToken = req.cookies.jwt;  if (refreshToken == null) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      console.log(err);
      if (err) return res.sendStatus(401);
      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            (t) => t !== refreshToken
          );
          await userDb.save();
          return res.sendStatus(200);
        }
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401);
  }
  const refreshToken = req.cookies.jwt;
  const refreshTokenExpiration = parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    10
  );
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
      try {
        const userDb = await User.findOne({ _id: user._id });
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = [];
          await userDb.save();
          return res.sendStatus(401);
        }
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        );
        userDb.refreshTokens = userDb.refreshTokens.filter(
          (t) => t !== refreshToken
        );
        userDb.refreshTokens.push(newRefreshToken);
        await userDb.save();
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          maxAge: refreshTokenExpiration,
        });
        res.json({ accessToken: accessToken });
        return res.status(200);
      } catch (err) {
        res.sendStatus(401).send(err.message);
      }
    }
  );
};

export default {
  googleSignin,
  register,
  login,
  logout,
  refresh,
};
