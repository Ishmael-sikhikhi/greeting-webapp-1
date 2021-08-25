'use strict'
module.exports = function greetingsFactory() {

    // var db = require('./db')
    var language
    var name
    var error = 0;
    var greetName = []

    var pattern = /^[A-Za-z]+$/

    function setLanguage(greet) {
        var message = ''
        //errors when information is not correct
        name = greet.name
        language = greet.language
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        if (pattern.test(name)) {
            /* object fill or refill */

            if (greetName.length == 0) {
                greetName.push({
                    name: name,
                    greet: 1,
                    username: name

                });

            } else {
                if(!greetName.some(greetName => greetName.name === name)){
                    greetName.push({
                        name: name,
                        greet: 1,
                        username: name

                    });
                }else {
                    greetName.forEach(element => {
                        if(element.name === name){
                            element.greet++
                            
                        }
                    });
                }
            }

            if (language === 'english' && name !== '') {
                return message = 'Hello' + ', ' + name
            }

            else if (language === 'afrikaans' && name !== '') {
                return message = 'Hallo' + ', ' + name
            }

            else if (language === 'setswana' && name !== '') {
                return message = 'Dumela' + ', ' + name
            }
        }
    }
    function getNameAndLanguage() {
        return {
            name,
            language
        }
    }

    // function objectValues(){
        
    // }

    function getName() {
        return name
    }

    function howManyTimesEachName(theName){
        let selectName;

        greetName.forEach(element => {
            if(element.username === theName){
                selectName = {
                    name: element.name,
                    greet: element.greet

                };
            }
        });

        return selectName;
    }

    function countNames() {
        return Object.keys(greetName).length
    }

    // function obj() {
    //     return Object.keys(greetName)
    // }

    function getNamesObj() {
        return greetName
    }

    function errorMessages() {
        if (name === '') {
            return "Please enter name";
        }
        if (name !== '' && name !== undefined && language == undefined) {
            return "Please select a language";
        }
    }
    return {
        setLanguage,
        countNames,
        getName,
        getNameAndLanguage,
        errorMessages,
        getNamesObj,
        howManyTimesEachName
    }
}