exports.init = function (app) {

    // Root pages.
    app.use('/', require('./root'));

    // Groups pages.
    app.use('/groups', require('./groups'));

};
