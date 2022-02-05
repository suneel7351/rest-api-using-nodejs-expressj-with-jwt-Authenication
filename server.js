require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
PORT = process.env.PORT || 3000;

require("./db/db");

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
require("./routes/AuthRoutes")(app);

app.listen(PORT, function () {
  console.log(`Server is running on ${PORT}`);
});
