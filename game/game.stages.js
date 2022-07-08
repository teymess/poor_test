/**
 * # Game stages definition file
 * Copyright(c) 2021 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager

    stager
    .stage('consent')

    stager
    .stage('Welcome')

    stager
    .stage('Part_1_Survey')
    .step('Part_1_q2')
    .step('Part_1_q3')


    .stage('Part3_Treatment')
    .step('Comparison_low')
    .step('Description_low')
    .step('Description_high')
    .step('Control')

    .stage('feedback')

    .stage('end')

    .gameover();

    if (treatmentName === 'control') {
            stager.skip('Part3_Treatment', [
                'Comparison_low',
                'Description_low',
                'Description_high'
            ])
        }
    else if (treatmentName === 'low_comparison') {
            stager.skip('Part3_Treatment', [
              'Control',
              'Description_low',
              'Description_high'
            ])
        }
    else if (treatmentName === 'high_description') {
              stager.skip('Part3_Treatment', [
                'Comparison_low',
                'Control',
                'Description_low'
              ])
          }
    else if (treatmentName === 'low_description') {
                    stager.skip('Part3_Treatment', [
                      'Comparison_low',
                      'Control',
                      'Description_high'
                    ])
                }

};
