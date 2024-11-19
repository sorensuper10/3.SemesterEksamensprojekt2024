const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const path = require('path');

const app = express()


app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');

// Sæt views-mappen
app.set('views', path.join(__dirname, 'views'));

// Route til at renderere EJS-filen
app.get('/', (req, res) => {
    res.render('index'); // index.ejs i views-mappen
});
//Run server
app.listen(port, () => {
    console.log('Server is running at http://localhost:3000');
});