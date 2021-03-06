const express = require("express");
const expressValidator = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  [
    expressValidator
      .body("email")
      .isEmail()
      .withMessage("L'adresse mail est invalide.")
      .normalizeEmail(),
    expressValidator
      .body("password", "Le mot de passe est invalide.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);
router.post(
  "/signup",
  [
    expressValidator
      .check("email")
      .isEmail()
      .withMessage("L'adresse mail est invalide.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              "L'adresse mail est déjà utilisé."
            );
          }
        });
      })
      .normalizeEmail(),
    expressValidator
      .body(
        "password",
        "Le mot de passe doit faire au moins 5 caratères."
      )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    expressValidator
      .body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Les mots de passe doivent être identique!");
        }
        return true;
      })
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
