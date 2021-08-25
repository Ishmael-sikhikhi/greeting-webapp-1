const assert = require('assert');

const greetingsFactory = require('../greetingFactory');

describe('Greetings exercise',()=>{
    it('It should ask for name and language when user did not inserted name and select language are  ', ()=>{
        var greetInstance = greetingsFactory()
        
        assert('Please enter the name and select language',greetInstance.setLanguage({name:"",language:""}))
    })
    it('It should ask for name when name is not entered and language is selected',()=>{
        var greetInstance = greetingsFactory()

        assert('Please enter name' ,greetInstance.setLanguage({name:"",language:"english"}))
    })
    it('It should ask for name when name is entered and language is not selected',()=>{
        var greetInstance = greetingsFactory()

        assert('Please select language' ,greetInstance.setLanguage({name:"Lwazi",language:""}))
    })
    describe("Validate name",()=>{
        it('It should reject the digits entered instead of alphabets for name',()=>{
            var greetInstance = greetingsFactory()

            assert('Name must accommodate letters' ,greetInstance.setLanguage({name:"123",language:"english"}))
        })
        it('It should reject the other characters are entered instead of alphabets for name',()=>{
            var greetInstance = greetingsFactory()

            assert('Name must accommodate letters' ,greetInstance.setLanguage({name:"$3@",language:"english"}))
        })
    })
    describe("Accepted name and language is selected",()=>{
        it('It should greet in english when language is english',()=>{
            var greetInstance = greetingsFactory()
            assert('Hello, Lwazi',greetInstance.setLanguage({name:"Lwazi",language:"english"}))
        })
        it('It should greet in afrikaans when language is afrikaans',()=>{
            var greetInstance = greetingsFactory()
            assert('Hallo, Lwazi',greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"}))
        })
        it('It should greet in setswana when language is setswana',()=>{
            var greetInstance = greetingsFactory()
            assert('Dumela, Phendula',greetInstance.setLanguage({name:"Phendula",language:"setswana"}))
        })
    })
    describe("Increment counter",()=>{
        it('It should incerement counter when name is greeted for the first time',()=>{
            var greetInstance = greetingsFactory()
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            assert(1,greetInstance.countNames)
        })
        it('It should not incerement counter when name is greeted more than once',()=>{
            var greetInstance = greetingsFactory()
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            assert(1,greetInstance.countNames)
        })
        it('It should incerement counter when anohter name is greeted for the first time',()=>{
            var greetInstance = greetingsFactory()
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"})
            assert(2,greetInstance.countNames)
        })
        it('It should not incerement counter when another name is greeted more than once',()=>{
            var greetInstance = greetingsFactory()
            greetInstance.setLanguage({name:"Phendula",language:"setswana"})
            greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"})
            greetInstance.setLanguage({name:"Lwazi",language:"afrikaans"})
            assert(2,greetInstance.countNames)
        })

    })
})