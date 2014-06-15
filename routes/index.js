exports.init = function (app) {

    // API
    app.use('/api', require('./api'));

    // Root pages.
    app.use('/', require('./root'));

    // Groups pages.
    app.use('/groups', require('./groups'));

};
