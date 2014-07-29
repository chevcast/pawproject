var db = require('mongoose-simpledb').db;

exports.create = function (req, res) {
	res.end('Not yet implemented.');
};

exports.read = function (req, res) {
    res.send([
        {
            question: 'What is the meaning of life, the universe, and everything?',
            answer: '42'
        },
        {
            question: 'Test Question?',
            answer: 'A longer answer that takes up a lot more of its container, but hopefully continues to look elegant on the page as the text is okay to flow throuhgout. The user should not be limited on how much text they can place in this field.',
        }
    ]);
};

exports.update = function (req, res) {
	res.end('Not yet implemented.');
};

exports.delete = function (req, res) {
	res.end('Not yet implemented.');
};
