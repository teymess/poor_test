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
    .step('Part_1_q1')
    .step('Part_1_q2')
    .step('Part_1_q3')
    .step('Part_1_q4')
    .step('Part_1_q5')
    .step('Part_1_q6')
    .step('Part_1_q7')
    .step('Part_1_q8')
    .step('Part_1_q9_C')
    .step('Part_1_q9_TH')
    .step('Part_1_q9_TL')

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
    .step('commitment')
    .step('Part3_Impact')
    // .step('Part_3_T_low')
    // .step('Part_3_T_high')
    // .step('What\'s_the_impact_on_you?')             // CONTROL
    // .step('Part3_Impact_Poor')
    // .step('Part3_Impact_Rich')
    // .step('Part3_Impact_Middle')

    // .step('What_is_the_impact_on_you?')             // TREATMENT POOR
    // .step('What_is_the_impact_on_yourself?')        // TREATMENT RICH
    //
    .step('Part3_The_fight_against_air_pollution')
    .step('Part3_Time_to_act!')
    // .step('Part3_Contribution_consent')
    // .step('Part3_Intro_stated_pref')
    .step('Part3_Policies_to_reduce_pollution')
    .step('Part3_Protection_measures')
    .step('Part3_About_yourself')
    .step('Part3_Income')

    // stager
    // .stage('Part_4_Final_survey')
    // .step('Instructions_Part_4')

    // .step('Part_4_q2')
    // .step('Part_4_q2_control')

    stager
    .stage('feedback')

    .stage('end')

    .gameover();

    // if (treatmentName.indexOf('control') !== -1) {
    //     stager.skip('Part3_Treatment', ['Part3_Impact_Poor','Part3_Impact_Rich'])
    // }
    // else if (treatmentName.indexOf('income_poor') !== -1) {
    //     stager.skip('Part3_Treatment', ['Part3_Impact_Middle','Part3_Impact_Rich'])
    // }
    // else if (treatmentName.indexOf('income_rich') !== -1) {
    //     stager.skip('Part3_Treatment', ['Part3_Impact_Poor','Part3_Impact_Middle'])
    // }


    stager.skip('Part_1_Survey','Part_1_q9_C')
    stager.skip('Part_1_Survey','Part_1_q9_TH')
    stager.skip('Part_1_Survey','Part_1_q9_TL')
    // stager.skip('Part2_Info_Pollution')
    // stager.skip('Part3_Treatment')

     // stager.skip('Part3_Treatment', 'Part3_Intro_stated_pref');

    // stager.skip('Part3_Treatment', 'Part3_Contribution_consent');
};
