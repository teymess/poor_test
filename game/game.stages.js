/**
 * # Game stages definition file
 * Copyright(c) 2022 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

     stager
        .stage('instructions')

        .stage('quiz')

        .repeatStage('game', settings.ROUNDS)
            .step('guess')
            .step('results')

        .stage('end')

        .gameover();

    // Notice: here all stages but 'game' have
    // one step named after the stage.

    // Skip one stage.
    // stager.skip('instructions');

    // Skip multiple stages:
    // stager.skip([ 'instructions', 'quiz' ])

    // Skip a step within a stage:
    // stager.skip('game', 'results');
};
