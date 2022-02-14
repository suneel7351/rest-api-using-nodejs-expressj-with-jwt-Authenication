const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
