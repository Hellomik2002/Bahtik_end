const express = require("express");
const mongodb = require("mongodb");
const server = require("../app");
const fs = require("fs");
const multer = require('multer');
const upload = multer({ dest: __dirname + '/../assets/Uploads/images' });
var path = require("path");
const router = express.Router();

router.post('/', upload.array("files"), async (req, res) => {
  const posts = await loadPostsCollection();
  let all_pathes = [];
  for (let i = 1; i < req.files.length; ++i) {
    console.log(req.files[i].mimetype);
    all_pathes.push(req.files[i].filename + "." + req.files[i].mimetype.split('/')[1]);
    console.log(path.resolve('src/assets/Uploads/images/' + req.files[i].filename));
    console.log(path.resolve('src/assets/Uploads/images/' + req.files[i].filename + "." + req.files[i].mimetype.split('/')[1]));
    fs.rename(path.resolve('src/assets/Uploads/images/' + req.files[i].filename), path.resolve('src/assets/Uploads/images/' + req.files[i].filename + "." + req.files[i].mimetype.split('/')[1]), function (err) {
      if (err) console.log('ERROR: ' + err);
    });
  }
  console.log(req.mainfile)

  await posts.insertOne({
    text: req.body.text,
    Path: all_pathes,
    main_path: req.files[0].filename
  });

  console.log(all_pathes);
  res.status(200).send();
});

router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  let obj = await posts.findOne({ _id: new mongodb.ObjectID(req.params.id) });


  fs.unlink(path.resolve("src/assets/Uploads/images/" + obj.Path), function () {
    console.log('write operation complete.');
  });
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
  res.status(200).send();
});

async function loadPostsCollection() {
  return server.mongo.db("Bahtik").collection("production");
};

module.exports = router;