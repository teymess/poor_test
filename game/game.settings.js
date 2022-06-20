/**
 * # Game settings definition file
 * Copyright(c) 2021 Anca Balietti <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // Variables shared by all treatments.

    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
    TIMER: {

        'task_2_-_Counting': 120000,

        'task_1_-_Slider': 120000
    },

    // # Game specific properties

    BASE_PAY: 0.2,

    BONUS_PAY: 0,

    // Exchange rate coins to dollars.
    EXCHANGE_RATE: 1,


// treatments: {
//
//     control: {
//         description: "Main control",
//         money: 'about 1,00,00,000 INR'
//     },
//
//     income_poor: {
//         description: "Manipulation to feel relatively rich",
//         money: 'less than 40,000 INR'
//     },
//
//
//     income_rich: {
//         description: "Manipulation to feel relatively poor",
//         money: 'more than 4,00,00,000 INR'
//     },
//
//     income_super_rich: {
//         description: "Manipulation to feel even more relatively poor",
//         money: 'more than 10,00,00,000 INR'
//     }
//
//
// }


    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    treatments: {
        // control: {
        //     description: "No perceived income manipulation",
        // },
        low_anchor: {
            description: "Provide anchor to poor household",
        }

    }
};
