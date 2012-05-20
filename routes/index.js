
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { 
        title: 'I am Denny. Nice to meet you.',
        description : 'Welcome to Denny\'s homepage.',
        thumbnail : 'http://iamdenny.com/images/slamdunk/t0001/1.png'
    });
};