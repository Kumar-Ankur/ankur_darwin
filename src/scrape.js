var Scraper = require('images-scraper')
  , google = new Scraper.Google();

  google.list({
    keyword: 'banana',
    num: 15,
    detail: true,
    nightmare: {
        show: true
    }
})
.then(function (res) {
    console.log('first 15 results from google', res[0]);
}).catch(function(err) {
    console.log('err', err);
});

// you can also watch on events
google.on('result', function (item) {
    console.log('out', item);
});
