const GreetingsService = require('../services/greetings-services');


module.exports = function (greetingsService) {

    let Count = 0;
    let message = ''
    let names = []

    async function home(req, res) {

        Count = await greetingsService.countNames()

        res.render('index', {
            Count,
            message,
            names
        })

        return count
    };

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
            else if (!name) {
                req.flash('error', 'Please enter a name')
            }

            else if (name, lang) {
                message = await greetingsService.setLanguage({
                    name: name,
                    language: lang
                })
                res.render('index', {
                    message
                });
            }

        }
        catch (err) {
            console.error('Error occured on greet!', err)
            netx(err)
        }
        return res.redirect("/");
    };

    async function all(req, res) {
        names = await greetingsService.getNames()
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
        // 
        return res.redirect("/");
    };


    return {
        greet,
        home,
        all,
        times,
        resetDB
    }

}