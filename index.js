'use strick'
let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const pg = require("pg");
const Pool = pg.Pool;


// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/the_greeted';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const greetingsFactory = require('./greetingFactory');
const { request } = require('express');
const flash = require('express-flash');
const session = require('express-session');

var message = ''
var count = 0
var counter = 0
let names = []
let deletes
let app = express();

const greetInstance = greetingsFactory(pool);


// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'this is my long String that is used for session in http',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// initialise the flash middleware
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/jsongreetInstance
app.use(bodyParser.json())
app.use(express.static('public'));

app.get("/", async (req, res) => {
    count = await greetInstance.countNames(),
        res.render("index",
            {
                message,
                count,
                names,
                deletes
            });
});
app.post("/greet", async (req, res) => {

    var name = req.body.enteredName
    var lang = req.body.selectedLanguage
    if (!lang && !name) {
        req.flash('error', 'Enter name and select a language')
    }
    else if (!lang) {
        req.flash('error', 'Please select a language')
    }
    else if (name === '') {
        req.flash('error', 'Please enter a name')
    }


    else {
        message = await greetInstance.setLanguage({
            name: req.body.enteredName,
            language: req.body.selectedLanguage
        })
    }


    res.redirect("/");
});

app.get('/greeted', async (req, res) => {

    names = await greetInstance.getNames()
    res.render('greeted', {
        names
    });

    // res.redirect('/')
})

app.get('/greeted-times/:name', async (req, res) => {
    const selectedName = req.params.name;
    counter = await greetInstance.howManyTimesEachName(selectedName)

    // console.log(greetInstance.howManyTimesEachName(selectedName))
    res.render('greeted-times', {
        selectedName,
        counter
    })

    // res.redirect('/')
})
app.post('/reset', async (req, res) => {
    await greetInstance.deletes()
    message = await greetInstance.deletes()

    res.redirect('/')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App started at port:${PORT}`)
})