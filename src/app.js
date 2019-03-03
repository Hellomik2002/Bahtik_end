const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongodb = require("mongodb");
var path = require("path");

const app = express();

async function main() {
  const client = await mongodb.MongoClient.connect(
    "mongodb://localhost:27017",
    {
      useNewUrlParser: true
    }
  );
  module.exports.mongo = client  
  app.use(bodyParser.json())
  app.use(cors());
  
  app.use("/assets", express.static(path.resolve(__dirname + "/assets/Uploads/images")));
  
  
  console.log(__dirname + "/assets/Uploads/images");
  
  const consumer = require("./routers/consumer_add_products.js"); // get, post, put, patch, delete
  const consumer_product = require("./routers/consumer_each_product.js");

  const corporate = require("./routers/corporate_add_products.js"); // get, post, put, patch, delete  
  const corporate_product = require("./routers/corporate_each_product.js");

  const production = require("./routers/production_add_products.js")
  const production_product = require("./routers/production_each_product.js");



  const main_product = require("./routers/main_add_products.js")
  const main_way = require("./routers/main_get.js")

  const footer = require("./routers/add_footer.js");

  const take_photo = require("./routers/take_photo");
  
  const clients = require("./routers/clients");

  const port = process.env.PORT || 8081;

  app.listen(port, () => console.log(`Server started on port ${port}`));

  app.use("/consumer/add", consumer);
  app.use("/consumer/product", consumer_product);

  app.use("/corporate/add", corporate);
  app.use("/corporate/product", corporate_product);

  app.use("/production/add", production);
  app.use("/production/product", production_product);

  app.use("/take_photo", take_photo);

  app.use("/main/add", main_product);
  app.use("/main/product", main_way);

  app.use("/footer", footer);
  app.use("/clients", clients);
}
main();