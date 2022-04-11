/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2021 Anca Balietti <anca.balietti@gmail.com>
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

        memory.stream();

        // Feedback.
        memory.view('feedback').stream({
            format: 'csv',
            header: [ 'time', 'timestamp', 'player', 'feedback' ]
        });

        // Email.
        memory.view('email').stream({
            format: 'csv',
            header: [ 'timestamp', 'player', 'email' ]
        });

        memory.index('district_player', item => {
            if (item.stepId === 'Part_1_q3') return item.player;
        });

        memory.index('income_decile', item => {
            if (item.stepId === 'Part_1_q4') return item.player;
        });

        memory.index('district_LYL', item => {
            if (item.stepId === 'Part2_Pollution_in_your_district') return item.player;
        });

        memory.index('income_guess', item => {
            if (item.stepId === 'Part3_T_Income_Corr_Control1') return item.player;
        });

        memory.index('income_guess_high', item => {
            if (item.stepId === 'Part3_T_Income_High') return item.player;
        });

        memory.index('income_guess_low', item => {
            if (item.stepId === 'Part3_T_Income_Low') return item.player;
        });

        memory.index('own_LYL_guess', item => {
            if (item.stepId === 'Part3_Impact') return item.player;
        });

        node.on.data('done', function(msg) {

            let id = msg.from;
            let step = node.game.getStepId(msg.stage);


            // if (step === 'task_1_-_Slider') {
            //     let bonus = msg.data.effort_slider * settings.TASK_1_BONUS;
            //     gameRoom.updateWin(id, bonus);
            // }
            // else if (step === 'task_2_-_Counting') {
            //     let bonus = msg.data.effort_count * settings.TASK_2_BONUS;
            //     gameRoom.updateWin(id, bonus);
            // }

            if (step === 'Part3_Time_to_act!') {
                console.log(msg.data);
                let bonus = 1.5*(msg.data.D_f_c2.value / 100);
                if (msg.data.CC1.value==='confirm') {
                    gameRoom.updateWin(id, (1.5 - bonus));
                }
                else {
                    //node.game.contributionAmount = bonus;
                    gameRoom.updateWin(id, 1.5);
                }
            }

            else if (step === 'feedback') {

                // Saves bonus file, and notifies player.
                //gameRoom.updateWin(id,settings.WIN);

                let db = memory.player[id];

                // Select all 'done' items and save its time.
                db.save('times.csv', {
                    header: [
                        'session', 'player', 'stage', 'step', 'round',
                        'time', 'timeup'
                    ],
                    append: true
                });

                db.save('survey.csv', {
                    header: 'all',
                    append: true,
                    flatten: true,
                    objectLevel: 3
                });
            }
        });

        node.on.data('end',function(message) {
            let id = message.from;
            gameRoom.computeBonus({
                append: true,
                clients: [ id ],
                amt: true
            });
        });

        node.on('get.districts', function(msg) {
            let state = msg.data;
            return setup.districts[state];
        });

        node.on('get.districtData', function(msg) {
            // Get item from database.

            // FOR EXPERIMENT.
            let district = memory.district_player.get(msg.from);
            // Actual district.
            console.log(district);
            district = district.forms.district.value;

            return setup.pollutionDb.district.get(district);
        });

        node.on('get.incomeDecile', function(msg) {
            let income = memory.income_decile.get(msg.from);
            console.log(income);
            income = income.income.value;

            let district = memory.district_player.get(msg.from);
            console.log(district);
            district = district.forms.district.value;


            let income_guess = memory.income_guess.get(msg.from);
            console.log(income_guess);
            income_guess = income_guess.P3_q1_1.value;

            return {
                row: setup.pollutionDb.district.get(district),
                income: income,
                income_guess: income_guess
            }
        });

        node.on('get.incomeDecileHigh', function(msg) {
            let income = memory.income_decile.get(msg.from);
            console.log(income);
            income = income.income.value;

            let district = memory.district_player.get(msg.from);
            console.log(district);
            district = district.forms.district.value;


            let income_guess = memory.income_guess_high.get(msg.from);
            console.log(income_guess);
            income_guess = income_guess.P3_q1_2.value;

            return {
                row: setup.pollutionDb.district.get(district),
                income: income,
                income_guess: income_guess
            }
        });

        node.on('get.incomeDecileLow', function(msg) {
            let income = memory.income_decile.get(msg.from);
            console.log(income);
            income = income.income.value;

            let district = memory.district_player.get(msg.from);
            console.log(district);
            district = district.forms.district.value;


            let income_guess = memory.income_guess_low.get(msg.from);
            console.log(income_guess);
            income_guess = income_guess.P3_q1_2.value;

            return {
                row: setup.pollutionDb.district.get(district),
                income: income,
                income_guess: income_guess
            }
        });

        node.on('get.contributionReminder', function(msg) {
            var districtLYL = memory.district_LYL.get(msg.from);
            console.log("District LYL1");
            console.log(districtLYL);
            console.log(typeof districtLYL);

            districtLYL = districtLYL.p5_q2.value;
            console.log("District LYL2");
            console.log(districtLYL);
            console.log(typeof districtLYL);

            var districtValue = districtLYL.slice(0,-" years".length);
            var districtValueIso = parseFloat(districtValue, 10);
            console.log("DV is " + districtValueIso);

            var ownLYLCategory = memory.own_LYL_guess.get(msg.from);
            ownLYLCategory = ownLYLCategory.forms.T_impact_more_or_less_you.value;
            console.log("LYL cat");
            console.log(ownLYLCategory);
            console.log(typeof ownLYLCategory)

            var ownLYL = memory.own_LYL_guess.get(msg.from);
            console.log("LYL1");
            console.log(ownLYL);
            console.log(typeof ownLYL);

            if (ownLYLCategory === 'same') {
                return {
                    district: districtLYL,
                    own: districtLYL
                }
            }

            else if (ownLYLCategory === 'less') {
                ownLYL = ownLYL.forms.T_impact_you.value;
                console.log("LYL2");
                console.log(ownLYL);
                console.log(typeof ownLYL);

                // ownLYL = 10;
                var ownLYL_less = ownLYL*districtValueIso/100;
                console.log("ownLYL_less");
                console.log(ownLYL_less);
                console.log(typeof ownLYL_less);

                var ownLYL_less_2d = ownLYL_less.toFixed(1);
                console.log("ownLYL_less_2d");
                console.log(ownLYL_less_2d);
                console.log(typeof ownLYL_less_2d);

                return {
                    district: districtLYL,
                    own: ownLYL_less_2d
                }
            }

            else {
                var ownLYL_more = districtValueIso + (ownLYL*districtValueIso/100);
                console.log("ownLYL_more");
                console.log(ownLYL_more);
                console.log(typeof ownLYL_more);

                var ownLYL_more_2d = ownLYL_more.toFixed(1);
                console.log("ownLYL_more_2d");
                console.log(ownLYL_more_2d);
                console.log(typeof ownLYL_more_2d);

                return {
                    district: districtLYL,
                    own: ownLYL_more_2d
                }
            }
        });
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
