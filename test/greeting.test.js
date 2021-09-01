const assert = require('assert');
const greetingsFactory = require('../greetingFactory');
const pg = require("pg");
const Pool = pg.Pool;


// we are using a special test database for the tests
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/the_greeted';

const pool = new Pool({
    connectionString
});


describe('Greetings exercise', async ()=>{
    beforeEach(async function(){
        // clean the tables before each test run
        await pool.query("delete from users;");
        
    });
    it('It should ask for name and language when user did not inserted name and select language are  ', ()=>{
        var greetInstance = greetingsFactory(pool)
        
        assert('Please enter the name and select language',greetInstance.setLanguage({name:"",language:""}))
    })
    it('It should ask for name when name is not entered and language is selected',()=>{
        var greetInstance = greetingsFactory(pool)

        assert('Please enter name' ,greetInstance.setLanguage({name:"",language:"english"}))
    })
    it('It should ask for name when name is entered and language is not selected',()=>{
        var greetInstance = greetingsFactory(pool)

        assert('Please select language' ,greetInstance.setLanguage({name:"Lwazi",language:""}))
    })
    describe("Validate name", async ()=>{
        beforeEach(async function(){
            // clean the tables before each test run
            await pool.query("delete from users;");
            
        });
        it('It should reject the digits entered instead of alphabets for name',()=>{
            var greetInstance = greetingsFactory(pool)

            assert('Name must accommodate letters' ,greetInstance.setLanguage({name:"123",language:"english"}))
        })
        it('It should reject the other characters are entered instead of alphabets for name',()=>{
            var greetInstance = greetingsFactory(pool)

            assert('Name must accommodate letters' ,greetInstance.setLanguage({name:"$3@",language:"english"}))
        })
    })
    describe("Accepted name and language is selected",async ()=>{
        beforeEach(async function(){
            // clean the tables before each test run
            await pool.query("delete from users;");            
        });
        it('It should greet in english when language is english',()=>{
            var greetInstance = greetingsFactory(pool)
            assert('Hello, Lwazi',greetInstance.setLanguage({name:"Lwazi",language:"english"}))
        })
        it('It should greet in afrikaans when language is afrikaans',()=>{
            var greetInstance = greetingsFactory(pool)
            assert('Hallo, Lwazi',greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"}))
        })
        it('It should greet in setswana when language is setswana',()=>{
            var greetInstance = greetingsFactory(pool)
            assert('Dumela, Phendula',greetInstance.setLanguage({name:"Phendula",language:"setswana"}))
        })
    })
    describe("Increment counter",()=>{
        beforeEach(async function(){
            // clean the tables before each test run
            await pool.query("delete from users;");
            
        });

        it('It should incerement counter when name is greeted for the first time',()=>{
            var greetInstance = greetingsFactory(pool)
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            assert(1,greetInstance.countNames)
        })
        it('It should not incerement counter when name is greeted more than once',()=>{
            var greetInstance = greetingsFactory(pool)
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            assert(1,greetInstance.countNames)
        })
        it('It should incerement counter when anohter name is greeted for the first time',()=>{
            var greetInstance = greetingsFactory(pool)
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"})
            assert(2,greetInstance.countNames)
        })
       
        it('It should not incerement counter when another name is greeted more than once',()=>{
            
            var greetInstance = greetingsFactory(pool)
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"})
            greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"})
            assert(2,greetInstance.countNames)
        })
    })   
})
describe('The basic database web app', async function(){

    beforeEach(async function(){
        // clean the tables before each test run
        await pool.query("delete from users;");
    });

    it('should pass the db test', async function(){
        
        // the Factory Function is called CategoryService
       var greetInstance = greetingsFactory(pool);
       
        await greetInstance.deletes()
        await greetInstance.setLanguage({
            name : "Lwazi"
        });

        let size = await greetInstance.getNames();
        assert.equal(1, size.length);

    });

    after(function(){
        pool.end();
    })
});