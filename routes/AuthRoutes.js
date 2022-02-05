const { body } = require("express-validator");
function AuthRoutes(app) {
  app.get("/", require("../controller/AuthController")().home);
  app.post(
    "/register",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password must be atleast 6 character").isLength({
        min: 6,
      }),
      body("name", "Name must be atleast 3 character").isLength({ min: 3 }),
    ],
    require("../controller/AuthController")().register
  );
}

module.exports = AuthRoutes;
