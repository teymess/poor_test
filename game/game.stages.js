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
    .step('Part_1_q5')
    .step('Part_1_q6')
    .step('Part_1_q7')
    .step('Part_1_q8')

    stager
    .stage('Part2_Info_Pollution')
    .step('Instructions_Part_2')
    .step('Part2_Air_pollution_and_its_sources')
    .step('Part2_Air_pollution_is_costly')
    .step('Part2_Air_pollution_damages_your_health')
    .step('Part2_Pollution_and_life_expectancy')
    .step('Part2_Pollution_in_your_district')

    .stage('Part3_Treatment')
    .step('Instructions_Part_3')
    .step('Part3_Commitment')
    .step('Part3_T_Income_Low')
    .step('Part3_T_Income_High')
    .step('Part3_T_Income_Control')
    .step('Part3_T_Income_Corr_Control1')
    .step('Part3_T_Income_Corr_Control2')
    .step('Part3_Impact')
    .step('Part3_Sentiment')

    //
    .step('Part3_The_fight_against_air_pollution')
    .step('Part3_Time_to_act!')
    .step('Part3_Policies_to_reduce_pollution')
    .step('Part3_Protection_measures')
    .step('Part3_Redistribution')
    .step('Part3_EnvJustice')


    stager
    .stage('feedback')
    .stage('Disclaimer')
    .stage('Disclaimer_income_high')
    .stage('Disclaimer_income_low')
    .stage('end')

    .gameover();

    if (treatmentName === 'pure_control') {
            stager.skip('Part3_Treatment', [
                'Part3_T_Income_Low',
                'Part3_T_Income_High',
                'Part3_T_Income_Control',
                'Part3_T_Income_Corr_Control1',
                'Part3_T_Income_Corr_Control2'
            ])
            stager.skip('Disclaimer_income_high')
            stager.skip('Disclaimer_income_low')
        }
        else if (treatmentName === 'control') {
            stager.skip('Part3_Treatment', [
                'Part3_T_Income_Low',
                'Part3_T_Income_High',
                'Part3_T_Income_Corr_Control1',
                'Part3_T_Income_Corr_Control2'
            ])
            stager.skip('Disclaimer_income_high')
            stager.skip('Disclaimer_income_low')
        }
        else if (treatmentName === 'income_correction') {
            stager.skip('Part3_Treatment', [
                'Part3_T_Income_Low',
                'Part3_T_Income_High',
                'Part3_T_Income_Control'
            ])
            stager.skip('Disclaimer_income_high')
            stager.skip('Disclaimer_income_low')
        }
        else if (treatmentName === 'poor_anchor') {
            stager.skip('Part3_Treatment', [
                'Part3_T_Income_High',
                'Part3_T_Income_Control',
                'Part3_T_Income_Corr_Control1',
                'Part3_T_Income_Corr_Control2'
            ])
            stager.skip('Disclaimer_income_high')
        }
        else if (treatmentName === 'rich_anchor') {
            stager.skip('Part3_Treatment', [
                'Part3_T_Income_Low',
                'Part3_T_Income_Control',
                'Part3_T_Income_Corr_Control1',
                'Part3_T_Income_Corr_Control2'
            ])
            stager.skip('Disclaimer_income_low')
        }
};
