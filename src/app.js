const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Romit Dutta'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Romit Dutta'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is a help message',
        title:'Help',
        name: 'Romit Dutta'
    });
})


app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide a valid address'
        })
    }


    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            

            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })

        })
    });
}); 

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help Article Not Found',
        title: 'Error 404',
        name: 'Romit Dutta'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page Not Found',
        title: 'Error 404',
        name: 'Romit Dutta'
    });
});


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})