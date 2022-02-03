/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2022 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    let node = gameRoom.node;
    let channel = gameRoom.channel;
    let memory = node.game.memory;

    // Make the logic independent from players position in the game.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    // Must implement the stages here.

    stager.setOnInit(function() {

        // Feedback.
        memory.view('feedback').stream({
            header: [ 'time', 'timestamp', 'player', 'feedback' ],
            format: 'csv'
        });

        // Email.
        memory.view('email').stream({
            header: [ 'timestamp', 'player', 'email' ],
            format: 'csv'
        });

        // Win.
        memory.view('win').stream({
            header: [
                'session', 'player', 'round', 'greater', 'number', 'win'
            ],
            adapter: { number: 'randomnumber' },
            format: 'csv'
        });

        // Update player's guess with information if he or she won.
        memory.on('insert', (item) => {
            if (node.game.isStep('guess', item.stage)) {
                // Determine if player's guess is correct.
                let greater = item.greater;
                let r = J.randomInt(0, 10);
                let win = (r > 5 && greater) || (r <= 5 && !greater);
                item.randomnumber = r;
                item.win = win;
                // Update earnings if player won.
                if (win) gameRoom.updateWin(item.player, settings.COINS);
            }
        });

        node.on('get.result', function(msg) {
            let item = memory.player[msg.from].last();
            return {
                greater: item.greater,
                randomnumber: item.randomnumber,
                win: item.win
            };
        });

        node.on.data('WIN', function(msg) {

            let id = msg.from;

            // Saves bonus file, and notifies player.
            gameRoom.computeBonus({
                append: true,
                clients: [ id ]
            });

            let db = memory.player[id];
            // Select all 'done' items and save its time.
            db.select('done').save('times.csv', {
                header: [
                    'session', 'player', 'stage', 'step', 'round',
                    'time', 'timeup'
                ],
                append: true
            });
        });
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
