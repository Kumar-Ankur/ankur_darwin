/**
 * @created by Kumar Ankur - 09/01/18
 * Creates Server page to scrape images from Google and start the backend server
 * Each image is downloaded in local HDD if directory exits else create new directory
 * Compress the images with imageminJpegtran & imageminPngquant node module
 * Insert top 15 images into MongoDb with keyword
 * @Express 4 - For Backend
 */

var express = require("express");
var fs = require("fs");
var path = require("path");
var request = require("request");
var app = express();
const MongoClient = require("mongodb").MongoClient;
const test = require("assert");
const url = "mongodb://root:root@ds241677.mlab.com:41677/ankur_darwin";
const dbName = "ankur_darwin";
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

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

/**
 * @function to compress the images
 * @param {'String'} keyword Text Searched by User 
 * @param {'String'} path to downloaded the image
 */

function compressImage(keyword, path) {
  imagemin([path + "/*.*"], "public/images/" + keyword, {
    plugins: [imageminJpegtran(), imageminPngquant({ quality: "65-80" })]
  }).then(files => {
    console.log(files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
  });
}


/**
 * Function to prevent from Cross Origin Resource Sharing
 */

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
    try {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }

      var req = request({
        uri: url,
        timeout: 15000
      });
      req.on("error", function(err) {
        console.log(err);
        callback();
      });
      req.on("response", function(res) {
        var file =
          folder +
          "/" +
          filename +
          "." +
          (res.headers["content-type"] || "image/jpeg").split("/")[1];

        res.pipe(fs.createWriteStream(file));
        callback(file);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @function To insert into database
   * @param {array} arr Array where all the images are stored
   * @param {String} paths  Source file where all the images are stored
   * @param {integer} pos Flag to check which image is inserted into Mongo
   * @param {String} keyword Text Searched by User
   */

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

  //Google Scrape image using images-scraper node module
  
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
      var paths = [], downloadedImages = [];
      images.forEach(function(image, i) {
        if (!fs.existsSync("./temp")) {
          fs.mkdirSync("./temp");
        }
        // var extension = image.url.replace(new RegExp("/", "_")).split(".");
        var folder = "./temp/" + keyword;
        var path = keyword + "/" + i;
        try {
          getImage(image.thumb_url, i, folder, function(imagefile) {
            console.log("file downloaded at", imagefile);
            if (imagefile) {
              paths.push(imagefile.replace('./temp', 'images'));
              downloadedImages.push(image);
            }
            count++;
            if (count == images.length) {
              compressImage(keyword, folder);
              insertInDBInSequence(downloadedImages, paths, 0, keyword);
            }
          });
        } catch (error) {
          console.log(error);
        }
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

app.get("/history", function(req, res) {
  imagesCollection.distinct("keyword", {}, function(err, data) {
    if (err) {
      res.json({
        success: false
      });
      res.status(500);
      res.end();
    } else {
      res.json(data);
      res.end();
    }
  });
});

app.get("/detail/:search_term", function(req, res) {
  var keyword = req.params.search_term;
  imagesCollection.findOne(
    {
      keyword: keyword
    },
    function(err, data) {
      if (err) {
        res.json({
          success: false
        });
        res.status(500);
        res.end();
      } else {
        res.json(data);
        res.end();
      }
    }
  );
});

app.listen(3030, function() {
  console.log("Server is running successfully at port 3030");
});

module.exports = app;
