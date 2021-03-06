const express = require("express");
const expressValidator = require("express-validator");

const adminController = require("../controllers/admin");
const {isAuth, isAdmin} = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, isAdmin, adminController.getAddProduct);
router.get("/products", isAuth, isAdmin, adminController.getProducts);
router.post(
  "/add-product",
  [
    expressValidator
      .body("title", "Le titre doit contenir plus de 3 caractères.")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    expressValidator
      .body("price", "Le prix doit être un nombre décimal.")
      .isFloat(),
    expressValidator
      .body(
        "description",
        "La description doit faire entre 5 et 400 caractères."
      )
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth, isAdmin,
  adminController.postAddProduct
);
router.get("/edit-product/:productId", isAuth, isAdmin, adminController.getEditProduct);
router.post(
  "/edit-product",
  [
    expressValidator
      .body("title", "Le titre doit contenir plus de 3 caractères.")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    expressValidator
      .body("price", "Le prix doit être un nombre décimal.")
      .isFloat(),
    expressValidator
      .body(
        "description",
        "La description doit faire entre 5 et 400 caractères."
      )
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth, isAdmin,
  adminController.postEditProduct
);
router.delete("/product/:productId", isAuth, isAdmin, adminController.deleteProduct);

module.exports = router;
