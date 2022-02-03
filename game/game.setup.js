/**
 * # Game setup
 * Copyright(c) 2021 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * This file includes settings that are shared amongst all client types
 *
 * Setup settings are passed by reference and can be modified globally
 * by any instance executing on the server (but not by remote instances).
 *
 * http://www.nodegame.org
 * ---
 */

 const path = require('path');
 const NDDB = require('NDDB');
 const J = require('JSUS').JSUS;

 module.exports = function (settings, stages, dir, level) {

    let setup = {};

    setup.debug = true;

    // setup.verbosity = 1;

    setup.window = {
        promptOnleave: !setup.debug
    };

    // Create DB.

    let pollutionDb = NDDB.db();

    // Create a map of state/district for convenience.
    setup.districts = {};
    pollutionDb.on('insert', item => {
        let d = setup.districts;
        if (!d[item.state]) d[item.state] = [];
        d[item.state].push(item.district);
    });

    // Creates a list of states for convenience.
    setup.states = [];
    pollutionDb.on('insert', item => {
        let s = setup.states;
        if (!J.inArray(item.state, s)) s.push(item.state);
    });

    // Index every district for faster retrieval.
    pollutionDb.index('district');

    pollutionDb.loadSync(path.join(dir, 'private', 'combined_pollution_data.csv'), {
        lineBreak: '\r\n'
    });
    console.log("Loaded csv file into database");

    // Store db in setup.
    setup.pollutionDb = pollutionDb;

    return setup;
};
