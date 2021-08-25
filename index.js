'use strick'
let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { pool } = require("./db");

const pg = require("pg");
// const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/kitcats';


const greetingsFactory = require('./greetingFactory');
const { request } = require('express');
const flash = require('express-flash');
const session = require('express-session');



var message = ''
var count = 0
let names = []
let namesObj = {};
let app = express();

const greetInstance = greetingsFactory()

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

app.get("/", (req, res) => {

    req.flash('error', greetInstance.errorMessages())
    res.render("index",
        {
            message,
            count,
            names,
        });
});
app.post("/greet", (req, res) => {
    message = greetInstance.setLanguage({
        name: req.body.enteredName,
        language: req.body.selectedLanguage
    })
    var name = greetInstance.getName()
    count = greetInstance.countNames()
    pool.query('SELECT * FROM users where name = $1', [name], (err, results)=>{
        if (err){
            throw err;
        }
        
        console.log(results.rows)
    });
    // await pool.query('insert into users (name) values ($1)',name)
    res.redirect("/");
});

app.get('/greeted', (req, res) => {
   
    namesObj = greetInstance.getNamesObj()
    names = namesObj
    res.render('greeted', {
        names
    });
   
    // res.redirect('/')
})

app.get('/greeted-times/:username', (req, res) => {
    const selectedName = req.params.username;

    res.render('greeted-times', {
        greetedName: greetInstance.howManyTimesEachName(selectedName)
    })
    
    // res.redirect('/')
})
app.get('/actions', (req, res) => {
    // res.render('actions', { actions: greetInstance.actions() })
})
app.get('/actions/:actionType', (req, res) => {
    // const actionType = req.params.actionType
    // res.render('actions', { actions: greetInstance.actionsFor(actionType) })
})

const PORT = process.env.PORT || 3000
0
app.listen(PORT, () => {
    console.log('App started at port:', PORT)
})