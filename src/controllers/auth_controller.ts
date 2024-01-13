import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const profilepicture = req.body.profilePicture;
  // Add another syntax checks
  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  } else {
    try {
      const requestedUser = await User.findOne({ email: email });
      if (requestedUser != null) {
        return res.status(406).send("Email is already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: encryptedPassword,
        profilePicture: profilepicture,
      });
      return res.status(201).send("User created successfully: \n" + newUser);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  } else {
    try {
      const user = await User.findOne({ email: email });
      if (user == null) {
        return res.status(401).send("Email or password are incorrect");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).send("Email or password are incorrect");
      }
      // Create JWT Tokens
      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
        }
      );
      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
        }
      );
      // Saving the refreshToken of the current user
      if (user.refreshTokens == null) {
        user.refreshTokens = [refreshToken];
      } else {
        user.refreshTokens.push(refreshToken);
      }
      await user.save();
      // Send the accessToken and the refreshToken to the front
      return res.status(200).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, user: { _id: string }) => {
        console.log(err);
        if (err) {
          return res.sendStatus(401);
        } else {
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
      }
    );
  }
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (refreshToken == null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, user: { _id: string }) => {
        if (err) {
          console.log(err);
          return res.sendStatus(401);
        } else {
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
              const accessToken = jwt.sign(
                { _id: user._id },
                process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION }
              );
              const newRefreshToken = jwt.sign(
                { _id: user._id },
                process.env.JWT_REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION }
              );

              userDb.refreshTokens = userDb.refreshTokens.filter(
                (t) => t !== refreshToken
              );

              userDb.refreshTokens.push(newRefreshToken);
              await userDb.save();
              return res.status(200).send({
                accessToken: accessToken,
              });
            }
          } catch (err) {
            res.sendStatus(401).send(err.message);
          }
        }
      }
    );
  }
};

export default {
  register,
  login,
  logout,
  refresh,
};
