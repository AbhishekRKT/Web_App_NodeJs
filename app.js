/*const fs = require('fs');

const path = require('path');

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get("/currenttime", function (req, res) {
    res.send('<h1>' + new Date().toISOString() + '</h1>');
});

app.get("/", function (req, res) {
    res.send('<form action="/store-user" method = "POST"><label>Your Name</label><input type="text" name="username"><button>Submit</button></form>');
})

app.post('/store-user', function (req, res) {
    const userName = req.body.username;

    const filePath = path.join(__dirname, 'data', 'users.json');

    const fileData = fs.readFileSync(filePath);
    const existingUsers = JSON.parse(fileData);

    existingUsers.push(userName);

    fs.writeFileSync(filePath, JSON.stringify(existingUsers));

    res.send('<h1> UserName Stored! </h1>')
});

app.get('/users', function (req, res) {

    const filePath = path.join(__dirname, 'data', 'users.json');

    const fileData = fs.readFileSync(filePath);
    const existingUsers = JSON.parse(fileData);

    let responseData = '<ul>';

    for (const user of existingUsers) {
        responseData += '<li>' + user + '</li>';
    }

    responseData += '</ul>';

    res.send(responseData);
});

app.listen(3000);*/

const fs = require('fs');

const path = require('path');

const express = require('express');

const app = express();
const uuid = require('uuid');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/restaurants', function (req, res) {
    console.log("In Restaurants")

    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);
    res.render('restaurants', {
        numberOfRestaurants: storedRestaurants.length,
        restaurants: storedRestaurants
    });
});

app.get('/restaurants/:id', function (req, res) {
    console.log("In Restaurants ID")
    const restaurantId = req.params.id;
    // console.log("restaurantsId", restaurantId);
    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    // console.log("filedata", fileData);
    const storedRestaurants = JSON.parse(fileData);
    // console.log("storedRestaurants", storedRestaurants);
    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            res.render('restaurant-detail', { restaurant: restaurant });
        }
    }

    res.render('404');
});

app.get('/recommend', function (req, res) {

    res.render('recommend');
});

app.post('/recommend', function (req, res) {
    const restaurant = req.body;
    restaurant.id = uuid.v4();
    const filePath = path.join(__dirname, 'data', 'restaurants.json');

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    storedRestaurants.push(restaurant);

    fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));

    res.redirect('/confirm');
});

app.get('/confirm', function (req, res) {
    res.render('confirm');
});

app.get('/about', function (req, res) {

    res.render('about');
})

app.use(function (req, res) {
    res.render('404');
});
app.listen(3000);