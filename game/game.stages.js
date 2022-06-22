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
    // .step('Part_1_q1')
    .step('Part_1_q2')
    .step('Part_1_q3')
    .step('Part_1_q4')


    .stage('Part3_Treatment')
    .step('Part3_T_Income_Low')
    //.step('Part3_T_Income_High')
    .stage('feedback')

    .stage('end')

    .gameover();

    // if (treatmentName === 'control') {
    //         stager.skip('Part3_Treatment', [
    //             'Part3_T_Income_Low',
    //         ])
    //     }
      if (treatmentName === 'low_anchor') {
            stager.skip('Part3_Treatment', [
                'Part3_T_Income_High',
            ])
        }
      else if (treatmentName === 'high_anchor') {
              stager.skip('Part3_Treatment', [
                  'Part3_T_Income_Low',
              ])
          }

};
