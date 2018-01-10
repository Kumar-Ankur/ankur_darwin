var express = require("express");
var fs = require("fs");
var path = require("path");
var request = require("request");
var app = express();
const MongoClient = require("mongodb").MongoClient;
const test = require("assert");
const url = "mongodb://root:root@ds241677.mlab.com:41677/ankur_darwin";
const dbName = "ankur_darwin";

let imagesCollection = undefined;
MongoClient.connect(url, function(err, client) {
  // Use the admin database for the operation
  imagesCollection = client.db(dbName).collection("images");
  imagesCollection.find({}).toArray(function(error, arr) {
    console.log("data fetched successfully");
    console.log(arr);
  });
});

var bodyParser = require("body-parser");
var Scraper = require("images-scraper"),
  google = new Scraper.Google();

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type, Authorization, Cache-Control"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

app.get("/search", function(req, res) {
  // console.log();
  function getImage(url, filename, folder, callback) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }

    request({
      uri: url
    })
      .pipe(fs.createWriteStream(folder + "/" + filename))
      .on("close", function() {
        callback();
      });
  }
  function insertInDBInSequence(arr, paths, pos, keyword) {
    var obj = arr[pos];
    var path = paths[pos];
    if (arr[pos] && path) {
      imagesCollection.findOne(
        {
          keyword: keyword
        },
        function(err, data) {
          if (err) {
            return;
          }
          if (!data) {
            imagesCollection.insertOne(
              {
                keyword: keyword,
                images: [path]
              },
              function(error, data) {
                if (error) {
                  console.log("error");
                  return;
                }
                insertInDBInSequence(arr, paths, pos + 1, keyword);
              }
            );
            return;
          } else {
            imagesCollection.findOneAndUpdate(
              {
                keyword: keyword
              },
              {
                $addToSet: {
                  images: path
                }
              },
              function(err, data) {
                if (err) {
                  return;
                }
                console.log("hello");
                insertInDBInSequence(arr, paths, pos + 1, keyword);
              }
            );
          }
        }
      );
    }
  }
  var keyword = req.query.term || "banana";
  google
    .list({
      keyword: keyword,
      num: 15,
      detail: true,
      nightmare: {
        show: false
      }
    })
    .then(function(images) {
      console.log("first 15 results from google", images);
      var count = 0;
      var paths = [];
      images.forEach(function(image, i) {
        if (!fs.existsSync("./public/download")) {
          fs.mkdirSync("./public/download");
        }
        // var extension = image.url.replace(new RegExp("/", "_")).split(".");
        var folder = "./public/download/" + keyword;
        var path = keyword + "/" + i;
        getImage(image.url, i, folder, function() {
          console.log("file downloaded at", path);
          paths.push(path);
          count++;
          if (count == images.length) {
            insertInDBInSequence(images, paths, 0, keyword);
          }
        });
      });
      res.json(images);
      res.end();
    })
    .catch(function(err) {
      console.log("err", err);
    });

  // you can also watch on events
  google.on("result", function(item) {
    console.log("out", item);
  });
});

app.get('/history', function (req, res) {
  imagesCollection.distinct('keyword', {}, function (err, data) {
    if (err) {
      res.json({
        success: false,
      })
      res.status(500)
      res.end()
    }else{
      res.json(data)
      res.end()
    }
  })
})

app.get('/detail/:search_term', function (req, res) {
  var keyword = req.params.search_term;
  imagesCollection.findOne({
    keyword: keyword
  }, function (err, data) {
    if (err) {
      res.json({
        success: false,
      })
      res.status(500)
      res.end()
    }else{
      res.json(data)
      res.end()
    }
  })
})

app.listen(3030, function() {
  console.log("Server is running successfully at port 3030");
});

module.exports = app;