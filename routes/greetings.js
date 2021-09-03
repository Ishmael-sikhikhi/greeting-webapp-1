const GreetingsService = require('../services/greetings-services');


module.exports = function (greetingsService) {

    async function greet(req, res) {
        try {
            var name = req.body.enteredName
            var lang = req.body.selectedLanguage
            if (!lang && !name) {
                req.flash('error', 'Enter name and select a language')
            }
            else if (!lang) {
                req.flash('error', 'Please select a language')
            }
            else if (!name ) {
                req.flash('error', 'Please enter a name')
            }

            else if(name, lang){
                res.render('index', {
                    message: await greetingsService.setLanguage({
                        name: name,
                        language: lang
                    })
                });
            }
        }
        catch (err) {
            console.error('Error occured on greet!', err)
            netx(err)
        }
    };

    async function count(req, res) {
        res.render('index', {
            count: await greetingsService.countNames()
        })
    };
    async function all(req, res) {
        var names = await greetingsService.getNames()
        res.render('greeted', {
            names
        });
    };
    async function times(req, res) {
        const selectedName = req.params.name;
        counter = await greetingsService.howManyTimesEachName(selectedName)

        // console.log(greetingsService.howManyTimesEachName(selectedName))
        res.render('greeted-times', {
            selectedName,
            counter
        })
    };
    async function resetDB(req, res) {
        await greetingsService.deletes()
        req.flash('info', 'Database has successfully resetted!')
        res.render('index', {

        })
    };

    return {
        greet,
        count,
        all,
        times,
        resetDB,
    }

}