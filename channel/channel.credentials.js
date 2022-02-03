/**
 * # Channel secret file
 * Copyright(c) 2022 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * The file must return the administrator user name and password
 *
 * The secret key can be stored here directly or loaded asynchronously from
 * another source, e.g a remote service or a database.
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = function(settings, done) {

    return {
        user: 'ABalietti',
        pwd: 'dance_sober!1'
    };

    // Example: return key asynchronously

    // loadCredentialsFromDatabase(function(err, credentials) {
    //     done(err, credentials);
    // });
};
