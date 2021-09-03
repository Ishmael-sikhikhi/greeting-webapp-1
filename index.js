'use strick'

let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const Greetings = require('./routes/greetings');

const GreetingsService = require('./services/greetings-services');

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

const greetingsService = GreetingsService(pool);

const greeingsRoutes = Greetings(greetingsService);


const { request } = require('express');
const flash = require('express-flash');
const session = require('express-session');


var count = 0
var counter = 0
let names = []
let deletes
let app = express();

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

app.get("/", greeingsRoutes.start);
app.post('/greet',greeingsRoutes.greet);
app.get('/greeted', greeingsRoutes.all);

app.get('/greeted-times/:name',greeingsRoutes.times)
app.post('/reset', greeingsRoutes.resetDB);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`App started at port:${PORT}`)
})
