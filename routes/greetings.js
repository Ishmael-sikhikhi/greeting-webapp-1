const GreetingsService = require('../services/greetings-services');


module.exports = function (greeetingsService) {

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
            else if (name === '') {
                req.flash('error', 'Please enter a name')
            }

            else {
                res.render('index', {
                    message: await greeetingsService.setLanguage({
                        name: name,
                        language: lang
                    })
                });
            }
            // res.redirect("/");
        }
        catch (err) {
            console.error('Error occured on greet!', err)
            netx(err)
        }
    };

    async function count(req, res) {
        count: await greeetingsService.countNames()
    };
    async function all(req, res){
       var names =  await greeetingsService.getNames()
        res.render('greeted', {
            names
        });
    }
    async function times(req, res) {
        const selectedName = req.params.name;
        counter = await greeetingsService.howManyTimesEachName(selectedName)

        // console.log(greetingsService.howManyTimesEachName(selectedName))
        res.render('greeted-times', {
            selectedName,
            counter
        })
    }

    return {
        greet,
        count,
        all,
        times
    }

}