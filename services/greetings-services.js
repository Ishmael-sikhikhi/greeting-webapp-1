'use strict'
module.exports = function GreetingsService(pool) {
    var message = ''
    
    var language
    var name
    var error = 0;
    var greetName = []
    var names = []

    var pattern = /^[A-Za-z]+$/

    async function setLanguage(greet) {      

        try {
            name = greet.name
            language = greet.language
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

            if (pattern.test(name)) {
                if (name && language){
                    var checkName = await pool.query(`select name from users where name = $1`, [name]);
                    if (checkName.rowCount === 0) {
                        await pool.query(`insert into users (name, counter) values ($1,$2)`, [name, 1])
                    }
                    else {
                        await pool.query(`update users set counter = counter + 1 where name = $1`, [name]);
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
        catch (err) {
            console.error('Error Occurred', err);
            throw err;
        }
    }

    //counter
    async function countNames() {
        var count = 0;
        try {
            names = await pool.query(`select * from users`);
            count = names.rows.length;
        }
        catch (err) {
            console.error('Error Occurred', err);
            throw err;
        }
        return count
    }

    //all greeted names
    async function getNames() {
        var thenames = await pool.query(`select name from users`)
        greetName = thenames.rows
        return thenames.rows
    }

    //how many timeseach name has been greeted
    async function howManyTimesEachName(theName) {
        let selectName;
        var count = await pool.query(`select counter from users where name = $1`, [theName])
        count = count.rows

        return count[0].counter;
    }

    async function deletes() {
        try {
            await pool.query(`DELETE FROM users`);
        } catch (err) {
            console.error('Error Occurred', err);
            throw err;
        }

        return ''
    }
    
    return {
        setLanguage,
        countNames,
        howManyTimesEachName,
        getNames,
        deletes,
    }
}