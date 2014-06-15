module.exports = function (req, res) {
    res.send([
        {
            question: 'What is the meaning of life, the universe, and everythign?',
            answer: '42'
        },
        {
            question: 'Test Question?',
            answer: 'Yes.',
        }
    ]);
};
