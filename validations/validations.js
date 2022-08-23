import { body } from "express-validator";

export const registerValidator = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Incorrect password").isLength({ min: 5 }),
  body("fullName", "Incorrect Full name").isLength({ min: 3 }),
  body("avatarUrl", "Incorrect avatar url").optional().isURL(),
];

export const loginValidator = [
  body('email', 'Incorrect email address or password').isEmail(),
  body('password', 'Incorrect email address or password').isLength({min: 5})
]

export const postCreateValidator = [
  body("title", "Enter article title").isLength({min: 5}),
  body("text", "Enter article text").isLength({ min: 20 }),
  body("tags", "").optional().isString(),
  body("imageUrl", "Incorrect image url").optional().isURL(),
]