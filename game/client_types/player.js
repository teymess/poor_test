/**
* # Player type implementation of the game stages
* Copyright(c) 2021 Anca <anca.balietti@gmail.com>
* MIT Licensed
*
* Each client type must extend / implement the stages defined in `game.stages`.
* Upon connection each client is assigned a client type and it is automatically
* setup with it.
*
* http://www.nodegame.org
* ---
*/

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

//var req = false;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {

        // Initialize the client.

        var header;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visualStage = node.widgets.append('VisualStage', header, {
            next: false
        });

        //this.visualRound = node.widgets.append('VisualRound', header, {
        // displayMode: [
        // 'COUNT_UP_STAGES_TO_TOTAL',
        //'COUNT_UP_STEPS_TO_TOTAL'
        //  ]
        //});

        this.doneButton = node.widgets.append('DoneButton', header, {
            text: 'Next'
        });

        this.discBox = node.widgets.append('DisconnectBox', header, {
            disconnectCb: function() {
                W.init({
                    waitScreen: true
                });
                node.game.pause('Disconnection detected. Please refresh ' +
                'to reconnect.');
                alert('Disconnection detected. Please refresh the page ' +
                'to continue. You might have to use the original link provided on MTurk.');
            },
            connectCb: function() {
                // If the user refresh the page, this is not called, it
                // is a normal (re)connect.
                if (node.game.isPaused()) node.game.resume();
            }
        });

        // No need to show the wait for other players screen in single-player
        // games.
        W.init({ waitScreen: false });

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)

    });

    stager.extendStep('consent', {
        donebutton: false,
        widget: 'Consent'
    });

    //////////////////////////////////////////////////////////////////
    stager.extendStep('Welcome', {
        frame: 'instructions_start.htm'
    });


    //////////////////////////////////////////////////////////////////////////
    // START OF THE SURVEY
    //////////////////////////////////////////////////////////////////////////
    //
    // stager.extendStage('Part1_Survey', {
    //     frame: 'survey.htm'
    // });

    //////////////////////////////////////////////////////////////////////////
    // Page 1. Language
    stager.extendStep('Part_1_q1', {
        name: "Part 1: Survey",
        cb: function() {
            // Modify CSS rules on the fly.
            W.cssRule('.choicetable-left, .choicetable-right ' +
            '{ width: 200px !important; }');

            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q1',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        id: 'q1_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> Which language(s) do you feel most comfortable to use on mTurk?<br>',
                        hint: '(Select 1 or 2 languages)',
                        choices: ['English', 'Assamese','Bengali','Bodo','Dogri',
                        'Gujarati','Hindi','Kannada','Kashmiri','Konkani',
                        'Maithili','Malayalam','Marathi','Mora','Meitei','Nepali',
                        'Odia','Punjabi','Sanskrit','Santali','Sindhi','Tamil',
                        'Telugu','Urdu','Other'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 2,
                        // Number of choices per row/column.
                        choicesSetSize: 6,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q1_1.choices.length - 1;
                            w = forms.q1_2;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();

                            w = forms.q1_4;
                            if (this.currentChoice.length === 2) w.show();
                            else w.hide();

                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_2',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1b</span> Please specify your language.',
                        width: '95%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_3',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> What is your favorite color?<br>',
                        hint: '(Write the answer in the language you selected above.)',
                        width: '95%',
                        requiredChoice: true,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_4',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2.b</span> You selected two languages. What is the name of your favorite color in the second language you selected above?',
                        width: '95%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 2. Year of birth
    stager.extendStep('Part_1_q2', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q2',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q2_1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> How old are you?',
                        width: '95%',
                        type: 'int',
                        min: 0,
                        max: 100,
                        requiredChoice: true,
                    },
                    {
                        id: 'q2_2',
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> What is your gender?',
                        choices: ['Male', 'Female', 'Other'],
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. LOCATION
    stager.extendStep('Part_1_q3', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        donebutton: false,
        widget: {
            name: 'ChoiceManager',
            options: {
                forms: [
                    {
                        name: 'Dropdown',
                        id: 'state',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> Select the state in which you currently live.',
                        choices: setup.states,
                        tag: 'select', // 'datalist'
                        placeholder: '--',
                        onchange: function(choice, select, widget) {
                            var w = node.widgets.lastAppended;
                            w = w.formsById.district;
                            w.hide();
                            node.game.doneButton.disable();

                            node.get('districts', function(districts) {
                                w.setChoices(districts, true);
                                w.show();
                                W.adjustFrameHeight();
                            }, 'SERVER', { data: choice });
                        }
                    },
                    {
                        name: 'Dropdown',
                        id: 'district',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> Select the district in which you currently live.',
                        tag: 'select', // 'datalist'
                        // Will be auto-filled later.
                        choices: [ '--' ],
                        hidden: true,
                        placeholder: '--',
                        requiredChoice: true,
                        onchange: function() {
                            node.game.doneButton.enable();
                        }

                    },
                    {
                        id: 'q3_3',
                        // orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> Do you live in a village or a town/city?',
                        choices: [ 'Village', 'Town/city'],
                        shuffleChoices: true,
                        requiredChoice: true
                    },
                    {
                        name: 'CustomInput',
                        id: 'q3_4',
                        // orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> What is the name of your village/town/city?',
                        width: '95%',
                        type: 'text',
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 4. Nr household members + HH INCOME
    stager.extendStep('Part_1_q4', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q4',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q4_1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q10</span> How many people live in your household?<br>',
                        hint: '(Think about everyone that lives at least eight months per year in your house. Answer should include yourself in the count.)',
                        width: '95%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        id: 'q4_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q11</span> What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational training','Bachelor degree','Masters degree or higher'],
                        shuffleChoices: false,
                        requiredChoice: true
                    }
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Part1. WORK and Commute
    stager.extendStep('Part_1_q5', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'q5',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q5_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q12</span> Are you currently employed?',
                        choices: [ 'No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, w2, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q5_1.choices.length - 1;
                            w1 = forms.q5_2;
                            w2 = forms.q5_4;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                                w2.show({ scroll: false });
                            }
                            else {
                                w1.hide();
                                w2.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q5_2',
                        orientation: 'H',
                        choicesSetSize: 2,
                        mainText: '<span style="font-weight: normal;color:gray;">Q13</span> In which sector do you work?',
                        choices: ['Mining',
                        'Manufacturing',
                        'Electricty/water/gas/waste',
                        'Construction',
                        'Transportation',
                        'Buying and selling',
                        'Financial/insurance/real estate services',
                        'Personal services',
                        'IT',
                        'Education',
                        'Health',
                        'Public administration',
                        'Professional/scientific/technical activities',
                        'Other'],
                        shuffleChoices: false,
                        hidden: true,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q5_2.choices.length - 1;
                            w = forms.q5_3;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q5_3',
                        mainText: '<span style="font-weight: normal;color:gray;">Q13b</span> Please specify.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q5_4',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q14</span> During a typical day, how long does it take you to go from home to work?<br>',
                        hint: '(Think about the number of minutes you need for a one-way commute.)',
                        choices: ['I work at home',
                        'Less than 10 minutes',
                        '10-30 minutes',
                        '30-60 minutes',
                        'More than 60 minutes'],
                        shuffleChoices: false,
                        hidden: true,
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Part 1. HOME environment
    stager.extendStep('Part_1_q6', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q6',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q6_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q15</span> What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Gas','Solar lamp','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q6_1.choices.length - 1;
                            w1 = forms.q6_2;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q6_2',
                        mainText: '<span style="font-weight: normal;color:gray;">Q15b</span> Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q6_3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16</span> What do you use for cooking fuel at home?<br>',
                        choices: ['Dung cakes','Wood','Coal','Kerosene','Gas','Electric stove','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        selectMultiple: 7,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q6_3.choices.length - 1;
                            w1 = forms.q6_4;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q6_4',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16b</span> Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q6_5',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q17</span> In your home, in which room is food prepared usually?',
                        choices: ['Cooking is done in the main living area.','Cooking is done in a separate kitchen.'],
                        shuffleChoices: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Part 1. Protection against pollution: HOME
    stager.extendStep('Part_1_q7', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q7',
            options: {
                simplify: true,
                forms: [
                    {
                        id: 'q7_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q18</span> Do you own an air conditioner (AC) at home?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        id: 'q7_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q19</span> Do you own an air purifier or particle filter at home?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                        onclick: function(value, removed) {
                            var w1, w2, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q7_2.choices.length - 1;
                            w1 = forms.q7_3;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q7_3',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q19b</span> Which year did you purchase your air purifier',
                        width: '95%',
                        hidden: true,
                        type:'int',
                        min: 1900,
                        max: 2021,
                        requiredChoice: true,
                    },
                    {
                        id: 'q7_4',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q20</span> How many people in your circle of family and friends own an air purifier?',
                        choices: ['Nobody','Very few','Less than half','Most of them','Everyone',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        id: 'q7_5',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q21</span> When you are home, do you do something to reduce your own exposure to air pollution?',
                        choices:['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q7_5.choices.length - 1;
                            w1 = forms.q7_6;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q7_6',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q22</span> What do you do to reduce air pollution in your home?',
                        width: '95%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // PAST ILLNESSES
    stager.extendStep('Part_1_q8', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q8',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q8_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q23</span> How often do you do physical exercise?<br>',
                        hint:'(Think of when you play sports, go jogging, go to the gym, practice yoga/pilates at home etc.)',
                        choices: [ 'Never','Very rarely','Once a month','Every week','Several times per week'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q24</span> Do you smoke tobacco (cigarettes, hookah, bidi, etc.)?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_3',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q25</span> In the past 5 years, did YOU have any of the following health conditions?<br>',
                        hint: '(Select <strong><em>all</strong></em> that apply.)',
                        choices: ["Allergies",'High blood pressure','Heart disease','Lung disease','Diabetes','None','Prefer not to say'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: true
                    }
                ]
            }
        }
    });

    // //////////////////////////////////////
    // stager.extendStep('Part_1_q9_C', {
    //     name: "Part 1: Survey",
    //     cb: function() {
    //         W.cssRule('table.choicetable td { text-align: center !important; ' +
    //         'font-weight: normal; padding-left: 10px; }');
    //     },
    //     widget: {
    //         name: 'ChoiceManager',
    //         id: 'P4_lq',
    //         options: {
    //             simplify: true,
    //             mainText: '',
    //             forms: [
    //                 {
    //                     id: 'income_control',
    //                     orientation: 'H',
    //                     mainText: '<span style="font-weight: normal;color:gray;">Q26</span> In 2020, what was the annual income of your household?<br>',
    //                     hint: 'Please refer to the <strong>total income</strong> of ALL members living in your household in 2020. The household annual income includes total sum of income earned in your household in 2020, before any taxes or deductions. This includes wages and salaries from all jobs (incl. in-kind payments valued at retail price), the revenue from self-employment, and all income from casual labour.',
    //                     choices: ['Less than 2,00,000 INR',
    //                               '2,00,000 INR – 5,00,000 INR',
    //                               '5,00,000 INR – 10,00,000 INR',
    //                               '10,00,000 INR – 20,00,000 INR',
    //                               '20,00,000 INR or more'],
    //                     shuffleChoices: false,
    //                     requiredChoice: true
    //                 },
    //                 {
    //                     id: 'income_group',
    //                     orientation: 'H',
    //                     mainText: '<span style="font-weight: normal;color:gray;">Q27</span> What is your income group?<br><br>'+
    //                     '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire population living in <b>your district</b> is divided into 10 income groups,'+
    //                     ' each with the same number of households. The figure below illustrates the 10 groups, ordered from left to right from the poorest 10%'+
    //                     ' to the richest 10%.' +
    //                     '</span><br><br><img src="https://i.ibb.co/sbMXxDd/District-groups.png" alt="Indian-groups" border="0" width="800px"></a><br><br>' +
    //                     'In your opinion, which income group is your household part of?',
    //                     choices: [
    //                         ['Group 1', '<span style=\'font-size:14px;font-weight:normal;\'>Group 1</span>'],
    //                         ['Group 2', '<span style=\'font-size:14px;font-weight:normal;\'>Group 2</span>'],
    //                         ['Group 3', '<span style=\'font-size:14px;font-weight:normal;\'>Group 3</span>'],
    //                         ['Group 4', '<span style=\'font-size:14px;font-weight:normal;\'>Group 4</span>'],
    //                         ['Group 5', '<span style=\'font-size:14px;font-weight:normal;\'>Group 5</span>'],
    //                         ['Group 6', '<span style=\'font-size:14px;font-weight:normal;\'>Group 6</span>'],
    //                         ['Group 7', '<span style=\'font-size:14px;font-weight:normal;\'>Group 7</span>'],
    //                         ['Group 8', '<span style=\'font-size:14px;font-weight:normal;\'>Group 8</span>'],
    //                         ['Group 9', '<span style=\'font-size:14px;font-weight:normal;\'>Group 9</span>'],
    //                         ['Group 10', '<span style=\'font-size:14px;font-weight:normal;\'>Group 10</span>'],
    //                         ],
    //                     shuffleChoices: false,
    //                     requiredChoice: true
    //                 },
    //                 // {
    //                 //     id: 'lq4',
    //                 //     name: 'Slider',
    //                 //     type: 'flat',
    //                 //     hidden: false,
    //                 //     min: 0,
    //                 //     max: 400,
    //                 //     initialValue: 1,
    //                 //     requiredChoice: true,
    //                 //     displayNoChange: false,
    //                 //     mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the total Indian population is divided into 10 income groups,'+
    //                 //     ' each with the same number of households.'+
    //                 //     '</span><br><br><a href="https://ibb.co/mJn5Ksm"><img src="https://i.ibb.co/K6txgZY/Indian-population.png" alt="Indian-population" border="0" width="750px"></a><br><br>' +
    //                 //     'In your opinion, what annual income is required to be in the top 10% of all Indian households?',
    //                 //     texts: {
    //                 //         currentValue: function(widget, value) {
    //                 //             let inrAmount = String(value);
    //                 //             if (value > 99) {
    //                 //                 var output = [inrAmount.slice(0,2),",", inrAmount.slice(2)].join('');
    //                 //                 return '<span style=\'font-size:20px;\'>You think an income of</span><span style=\';font-size:25px;\'> ' + output + '0,000 INR</span><span style=\'font-size:20px;\'> is required to be in the top 10% of all Indian households.</span>';
    //                 //             }
    //                 //             else {
    //                 //                 return '<span style=\'font-size:20px;\'>You think an income of</span><span style=\';font-size:25px;\'> ' + inrAmount + '0,000 INR</span><span style=\'font-size:20px;\'> is required to be in the top 10% of all Indian households.</span>';
    //                 //             }
    //                 //         }
    //                 //     }
    //                 // }
    //             ]
    //         }
    //     }
    // });

    ////////////////////////////////////////////////////////////////
    // TREATMENT LOW
    stager.extendStep('Part_1_q9_TH', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'P3_T_high',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                  {
                      id: 'T_high_income_q1',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q26</span> In 2020, what was the annual income of your household?<br><br>',
                      hint: 'Please refer to the <strong>total income</strong> of ALL members living in your household in 2020,'+
                      ' before any taxes or deductions. You should include all wages and salaries from all jobs '+
                      '(incl. in-kind payments valued at retail price), the revenue from self-employment, '+
                      'and all income from casual labour.',
                      choices: ['Less than 50,000 INR',
                                '50,000 INR – 1,00,000 INR',
                                '1,00,000 INR – 1,50,000 INR',
                                '1,50,000 INR – 2,00,000 INR',
                                '2,00,000 INR or more'],
                      shuffleChoices: false,
                      requiredChoice: true
                  },
                  {
                    id: 'T_high_income_q2',
                    orientation: 'H',
                    mainText: '<span style="font-weight: normal;color:gray;">Q27</span> What is your income group?<br><br>'+
                    '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire population living in <b>your district</b> is divided into 10 income groups,'+
                    ' each with the same number of households. The figure below illustrates the 10 groups, ordered from left to right from the poorest 10%'+
                    ' to the richest 10%.' +
                    '</span><br><br><img src="https://i.ibb.co/sbMXxDd/District-groups.png" alt="Indian-groups" border="0" width="800px"></a><br><br>' +
                    'In your opinion, which income group is your household part of?',
                    choices: [
                        ['Group 1', '<span style=\'font-size:14px;font-weight:normal;\'>Group 1</span>'],
                        ['Group 2', '<span style=\'font-size:14px;font-weight:normal;\'>Group 2</span>'],
                        ['Group 3', '<span style=\'font-size:14px;font-weight:normal;\'>Group 3</span>'],
                        ['Group 4', '<span style=\'font-size:14px;font-weight:normal;\'>Group 4</span>'],
                        ['Group 5', '<span style=\'font-size:14px;font-weight:normal;\'>Group 5</span>'],
                        ['Group 6', '<span style=\'font-size:14px;font-weight:normal;\'>Group 6</span>'],
                        ['Group 7', '<span style=\'font-size:14px;font-weight:normal;\'>Group 7</span>'],
                        ['Group 8', '<span style=\'font-size:14px;font-weight:normal;\'>Group 8</span>'],
                        ['Group 9', '<span style=\'font-size:14px;font-weight:normal;\'>Group 9</span>'],
                        ['Group 10', '<span style=\'font-size:14px;font-weight:normal;\'>Group 10</span>'],
                        ],
                    shuffleChoices: false,
                    requiredChoice: true
                  }
                ]
            }
        }
    });

////////////////////////////////////////////////////////////////
// TREATMENT LOW
    stager.extendStep('Part_1_q9_TL', {
        name: "Part 1: Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'P3_T_low',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                  {
                      id: 'T_low_income_q1',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q26</span> In 2020, what was the annual income of your household?<br><br>',
                      hint: 'Please refer to the <strong>total income</strong> of ALL members living in your household in 2020,'+
                      ' before any taxes or deductions. You should include all wages and salaries from all jobs '+
                      '(incl. in-kind payments valued at retail price), the revenue from self-employment, '+
                      'and all income from casual labour.',
                      choices: ['Less than 20,00,000 INR',
                                '20,00,000 INR – 40,00,000 INR',
                                '40,00,000 INR – 60,00,000 INR',
                                '60,00,000 INR – 80,00,000 INR',
                                '80,00,000 INR or more'],
                      shuffleChoices: false,
                      requiredChoice: true
                  },
                  {
                    id: 'T_low_income_q2',
                    orientation: 'H',
                    mainText: '<span style="font-weight: normal;color:gray;">Q27</span> What is your income group?<br><br>'+
                    '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire population living in <b>your district</b> is divided into 10 income groups,'+
                    ' each with the same number of households. The figure below illustrates the 10 groups, ordered from left to right from the poorest 10%'+
                    ' to the richest 10%.' +
                    '</span><br><br><img src="https://i.ibb.co/sbMXxDd/District-groups.png" alt="Indian-groups" border="0" width="800px"></a><br><br>' +
                    'In your opinion, which income group is your household part of?',
                    choices: [
                        ['Group 1', '<span style=\'font-size:14px;font-weight:normal;\'>Group 1</span>'],
                        ['Group 2', '<span style=\'font-size:14px;font-weight:normal;\'>Group 2</span>'],
                        ['Group 3', '<span style=\'font-size:14px;font-weight:normal;\'>Group 3</span>'],
                        ['Group 4', '<span style=\'font-size:14px;font-weight:normal;\'>Group 4</span>'],
                        ['Group 5', '<span style=\'font-size:14px;font-weight:normal;\'>Group 5</span>'],
                        ['Group 6', '<span style=\'font-size:14px;font-weight:normal;\'>Group 6</span>'],
                        ['Group 7', '<span style=\'font-size:14px;font-weight:normal;\'>Group 7</span>'],
                        ['Group 8', '<span style=\'font-size:14px;font-weight:normal;\'>Group 8</span>'],
                        ['Group 9', '<span style=\'font-size:14px;font-weight:normal;\'>Group 9</span>'],
                        ['Group 10', '<span style=\'font-size:14px;font-weight:normal;\'>Group 10</span>'],
                        ],
                    shuffleChoices: false,
                    requiredChoice: true
                  }
                ]
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    stager.extendStep('Instructions_Part_2', {
        name: 'Part 2: Instructions',
        frame: 'instructions_part2.htm'
    });


    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P1
    stager.extendStep('Part2_Air_pollution_and_its_sources', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p1.htm',
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'P1_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P1_q1',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> Which of the following statements is correct?',
                        choices: ['Air pollution is mostly generated outdoors, but not indoors.',
                        'Air pollution can be generated both indoors and outdoors.',
                        'Air pollution is mostly generated indoors, but not outdoors.'],
                        correctChoice: 1,
                    },
                    {
                        id: 'P1_q2',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Which of the following statements is correct?',
                        choices: ['In India, only industries cause air pollution.',
                        'In India, air pollution is generated by many sources and everyone is responsible to different degrees for the air pollution problem.'],
                        correctChoice: 1,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P2
    stager.extendStep('Part2_Air_pollution_is_costly', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p2.htm',
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'P2_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P2_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> How many deaths are caused yearly by air pollution in India?',
                        choices: ["Less than 1 million", "About 1.67 million", "More than 3 million"],
                        correctChoice: 1,
                    },
                    {
                        id: 'P2_q2',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Which of the following statements is correct?',
                        choices: ["Air pollution causes only health damages.",
                        "Air pollution causes both health and economic damages.",
                        "Air pollution causes no damages."],
                        correctChoice: 1,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P3
    stager.extendStep('Part2_Air_pollution_damages_your_health', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p3.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P3_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P3_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Which of the following health conditions are caused by exposure to air pollution?<br>',
                        hint: '<span style="color:gray;font-size:14px;">(There are several correct answers and you have to find all of them.)</span>',
                        // Number of choices per row/column.
                        choicesSetSize: 6,
                        choices: ["HIV/AIDS", "Hepatitis",
                        "Lung cancer", "Heart disease", "Respiratory infections"],
                        selectMultiple: true,
                        correctChoice: [2,3,4],
                    }
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // LEAFLET P4
    stager.extendStep('Part2_Pollution_and_life_expectancy', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p4.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'P4_q',
            options: {
                simplify: true,
                mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'P4_q1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> How many years of life do we lose on average by being exposed for a long time to air pollution that is 10 &mu;/m<sup>3</sup> higher than the WHO recommended level?<br>',
                        choices: ["0 years", "0.25 years", "0.5 years", "1 year", "2 years"],
                        correctChoice: 3,
                    },
                    {
                        id: 'P4_q2',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How many years of life do we lose on average by being exposed for a long time to air pollution that is 30 &mu;/m<sup>3</sup> higher than the WHO recommended level?<br>',
                        choices: ["0 years", "1 year", "2 years", "3 years", "5 years"],
                        correctChoice: 3,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Pollution in your district
    stager.extendStep('Part2_Pollution_in_your_district', {
        name: 'Part 2: Reading and comprehension',
        frame: 'leaflet_p5.htm',
        donebutton: false,
        cb: function() {
            node.get('districtData', function(data) {

                var state_fig = data.state.replace(/ /g, '_');
                state_fig = state_fig.replace(/&/g, 'and');
                state_fig = state_fig.replace(/-/g, '_');

                var district_fig = data.district.replace(/ /g, '_');
                district_fig = district_fig.replace(/&/g, 'and');
                district_fig = district_fig.replace(/-/g, '_');

                var image = 'district_maps/' + state_fig + '_' + district_fig + '.png';

                W.gid('img').src = image;

                console.log(data);
                W.setInnerHTML('state', data.state);
                W.setInnerHTML('district', data.district);
                W.setInnerHTML('districtAgain', data.district);
                W.setInnerHTML('districtAgainAgain', data.district);
                W.setInnerHTML('pm25', data.pm25.toFixed(2));
                W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
                W.setInnerHTML('years', data.life_lost.toFixed(1));

                node.game.controlQuestions = node.widgets.append('ChoiceManager', "ComprehquestionsL5", {
                    id: 'p5_q',
                    // ref: 'controlQuestions',
                    mainText: 'Based on the information provided in the box above, find the correct answer to the questions below.<br>' +
                    '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                    simplify: true,
                    forms: [
                        {
                            id: 'p5_q1',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q8</span> What is the WHO recommendation for the annual average PM 2.5 concentrations?<br>',
                            choices: [
                                ['0', "0 &mu;/m<sup>3</sup>"],
                                ['5', "5 &mu;/m<sup>3</sup>"],
                                ['15', "15 &mu;/m<sup>3</sup>"],
                                ['30', "30 &mu;/m<sup>3</sup>"],
                            ],
                            correctChoice: 1,
                        },
                        {
                            id: 'p5_q2',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q9</span> On average, how many years of life does a person living in your district lose because of air pollution?<br>',
                            choices: [
                                (data.life_lost * 0.5).toFixed(1) + ' years',
                                (data.life_lost * 0.8).toFixed(1) + ' years',
                                data.life_lost.toFixed(1) + ' years',
                                (data.life_lost * 1.2).toFixed(1) + ' years',
                                (data.life_lost * 1.5).toFixed(1) + ' years'
                            ],
                            correctChoice: 2,
                        }
                    ]
                    // formsOptions: {
                    //     requiredChoice: true
                    // }
                });

                W.show('data', 'flex');
                node.game.doneButton.enable();
            });
        },
        done: function() {
            return node.game.controlQuestions.getValues();
        }
    });



    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    stager.extendStep('Instructions_Part_3', {
        name: 'Part 3: Instructions',
        frame: 'instructions_part3.htm'
    });

    //////////////////////////////////////////////////////////////////////////
    // // POOR -- How are you impacted?
    // stager.extendStep('Part3_Impact_Poor', {
    //     name: 'Part 3: Your opinion',
    //     frame: 'Impact_on_you_poor.htm',
    //     donebutton: false,
    //     cb: function() {
    //         node.get('districtData', function(data) {
    //
    //             console.log(data);
    //             W.setInnerHTML('state', data.state);
    //             W.setInnerHTML('district', data.district);
    //             W.setInnerHTML('districtAgain', data.district);
    //             W.setInnerHTML('districtQ', data.district);
    //             W.setInnerHTML('districtAgainAgain', data.district);
    //             W.setInnerHTML('pm25', data.pm25.toFixed(2));
    //             W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
    //             W.setInnerHTML('years', data.life_lost.toFixed(1));
    //
    //         node.game.Q_poor = node.widgets.append('ChoiceManager', "T_impact_poor", {
    //                 id: 'T_impact_poor_q',
    //                 mainText: '',
    //                 simplify: true,
    //                 forms: [
    //                     {
    //                         id: 'T_impact_poor_q1',
    //                         orientation: 'H',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q1</span> In your opinion, how many years' +
    //                         ' of life does a household living in ' + data.district + ' and' +
    //                         ' earning a total income of <b>less than 40,000 INR annually</b>' +
    //                         ' lose because of air pollution?',
    //                         choices: [
    //                           'Less than ' + (data.life_lost * 0.5).toFixed(0) + ' years',
    //                           (data.life_lost * 0.5).toFixed(0) + ' - ' + data.life_lost.toFixed(0) + ' years',
    //                           data.life_lost.toFixed(0) + ' - ' + (data.life_lost * 1.5).toFixed(0) + ' years',
    //                           (data.life_lost * 1.5).toFixed(0) + ' - ' + (data.life_lost * 2).toFixed(0) + ' years',
    //                           'more than ' + (data.life_lost * 2).toFixed(0) + ' years'
    //                         ],
    //                         requiredChoice: true,
    //                     },
    //                     {
    //                         id: 'T_impact_poor_q2',
    //                         orientation: 'H',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q2</span> According to your best guess,' +
    //                         ' how many years of life are <b><span style="color:#ff0000">YOU</span></b> likely to lose because of air pollution?',
    //                         choices: [
    //                           'Less than ' + (data.life_lost * 0.5).toFixed(0) + ' years',
    //                           (data.life_lost * 0.5).toFixed(0) + ' - ' + data.life_lost.toFixed(0) + ' years',
    //                           data.life_lost.toFixed(0) + ' - ' + (data.life_lost * 1.5).toFixed(0) + ' years',
    //                           (data.life_lost * 1.5).toFixed(0) + ' - ' + (data.life_lost * 2).toFixed(0) + ' years',
    //                           'more than ' + (data.life_lost * 2).toFixed(0) + ' years'
    //                         ],
    //                         requiredChoice: true,
    //                     }
    //                 ]
    //             });
    //
    //             W.show('data', 'flex');
    //             node.game.doneButton.enable();
    //         });
    //     },
    //     done: function() {
    //         return node.game.Q_poor.getValues();
    //     }
    // });
    //
    // //////////////////////////////////////////////////////////////////////////
    // // RICH -- How are you impacted?
    // stager.extendStep('Part3_Impact_Rich', {
    //     name: 'Part 3: Your opinion',
    //     frame: 'Impact_on_you_rich.htm',
    //     donebutton: false,
    //     cb: function() {
    //         node.get('districtData', function(data) {
    //
    //             console.log(data);
    //             W.setInnerHTML('state', data.state);
    //             W.setInnerHTML('district', data.district);
    //             W.setInnerHTML('districtQ', data.district);
    //             W.setInnerHTML('districtAgain', data.district);
    //             W.setInnerHTML('districtAgainAgain', data.district);
    //             W.setInnerHTML('pm25', data.pm25.toFixed(2));
    //             W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
    //             W.setInnerHTML('years', data.life_lost.toFixed(1));
    //
    //         node.game.Q_rich = node.widgets.append('ChoiceManager', "T_impact_rich", {
    //                 id: 'T_impact_rich_q',
    //                 // ref: 'controlQuestions',
    //                 mainText: '',
    //                 simplify: true,
    //                 forms: [
    //                     {
    //                         id: 'T_impact_rich_q1',
    //                         orientation: 'H',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q1</span> In your opinion, how many years' +
    //                         ' of life does a household living in ' + data.district + ' and' +
    //                         ' earning a total income of more than 40,000,000 INR annually</b>' +
    //                         ' lose because of air pollution?',
    //                         choices: [
    //                           'Less than ' + (data.life_lost * 0.5).toFixed(0) + ' years',
    //                           (data.life_lost * 0.5).toFixed(0) + ' - ' + data.life_lost.toFixed(0) + ' years',
    //                           data.life_lost.toFixed(0) + ' - ' + (data.life_lost * 1.5).toFixed(0) + ' years',
    //                           (data.life_lost * 1.5).toFixed(0) + ' - ' + (data.life_lost * 2).toFixed(0) + ' years',
    //                           'more than ' + (data.life_lost * 2).toFixed(0) + ' years'
    //                         ],
    //                         requiredChoice: true,
    //                     },
    //                     {
    //                         id: 'T_impact_rich_q2',
    //                         orientation: 'H',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q2</span> According to your best guess,' +
    //                         ' how many years of life are <b><span style="color:#ff0000">YOU</span></b> likely to lose because of air pollution?',
    //                         choices: [
    //                           'Less than ' + (data.life_lost * 0.5).toFixed(0) + ' years',
    //                           (data.life_lost * 0.5).toFixed(0) + ' - ' + data.life_lost.toFixed(0) + ' years',
    //                           data.life_lost.toFixed(0) + ' - ' + (data.life_lost * 1.5).toFixed(0) + ' years',
    //                           (data.life_lost * 1.5).toFixed(0) + ' - ' + (data.life_lost * 2).toFixed(0) + ' years',
    //                           'more than ' + (data.life_lost * 2).toFixed(0) + ' years'
    //                         ],
    //                         requiredChoice: true
    //                     }
    //                 ]
    //             });
    //
    //             W.show('data', 'flex');
    //             node.game.doneButton.enable();
    //         });
    //     },
    //     done: function() {
    //         return node.game.Q_rich.getValues();
    //     }
    // });
    //
    // //////////////////////////////////////////////////////////////////////////
    // // MIDDLE -- How are you impacted?
    // stager.extendStep('Part3_Impact_Middle', {
    //     name: 'Part 3: Your opinion',
    //     frame: 'Impact_on_you_middle.htm',
    //     donebutton: false,
    //     cb: function() {
    //         node.get('districtData', function(data) {
    //
    //             console.log(data);
    //             W.setInnerHTML('state', data.state);
    //             W.setInnerHTML('district', data.district);
    //             W.setInnerHTML('districtQ', data.district);
    //             W.setInnerHTML('districtAgain', data.district);
    //             W.setInnerHTML('districtAgainAgain', data.district);
    //             W.setInnerHTML('pm25', data.pm25.toFixed(2));
    //             W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
    //             W.setInnerHTML('years', data.life_lost.toFixed(1));
    //
    //         node.game.Q_middle = node.widgets.append('ChoiceManager', "T_impact_middle", {
    //                 id: 'T_impact_middle_q',
    //                 // ref: 'controlQuestions',
    //                 mainText: '',
    //                 simplify: true,
    //                 forms: [
    //                     {
    //                         id: 'T_impact_middle_q1',
    //                         orientation: 'H',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
    //                         'Think about a housold living in ' + data.district +
    //                         'with a total annual income around 10,000,000 INR annually. <br><br>' +
    //                         'How many years of life do you think they lose because of air pollution?<br>',
    //                         choices: [
    //                           'Less than ' + (data.life_lost * 0.5).toFixed(0) + ' years',
    //                           (data.life_lost * 0.5).toFixed(0) + ' - ' + data.life_lost.toFixed(0) + ' years',
    //                           data.life_lost.toFixed(0) + ' - ' + (data.life_lost * 1.5).toFixed(0) + ' years',
    //                           (data.life_lost * 1.5).toFixed(0) + ' - ' + (data.life_lost * 2).toFixed(0) + ' years',
    //                           'more than ' + (data.life_lost * 2).toFixed(0) + ' years'
    //                         ],
    //                         requiredChoice: true
    //                     },
    //                     {
    //                         id: 'T_impact_middle_q2',
    //                         orientation: 'H',
    //                         mainText: '<span style="font-weight: normal;color:gray;">Q2</span> According to your best guess,' +
    //                         ' how many years of life are <b><span style="color:#ff0000">YOU</span></b> likely to lose because of air pollution?',
    //                         choices: [
    //                           'Less than ' + (data.life_lost * 0.5).toFixed(0) + ' years',
    //                           (data.life_lost * 0.5).toFixed(0) + ' - ' + data.life_lost.toFixed(0) + ' years',
    //                           data.life_lost.toFixed(0) + ' - ' + (data.life_lost * 1.5).toFixed(0) + ' years',
    //                           (data.life_lost * 1.5).toFixed(0) + ' - ' + (data.life_lost * 2).toFixed(0) + ' years',
    //                           'more than ' + (data.life_lost * 2).toFixed(0) + ' years'
    //                         ],
    //                         requiredChoice: true,
    //                         hidden: true
    //                     }
    //                 ]
    //             });
    //
    //             W.show('data', 'flex');
    //             node.game.doneButton.enable();
    //         });
    //     },
    //     done: function() {
    //
    //
    //         return node.game.Q_middle.getValues();
    //     }
    // });
    //
    //
    // //////////////////////////////////////////////////////////////////////////


    stager.extendStep('commitment', {
        name: 'Part 3: Full Attention',
        widget: {
            name: 'ChoiceTable',
            id: 'commitment',
            title: false,
            panel: false,
            mainText: '<p>Before proceeding to the next set of questions,' +
                ' we want to ask for your feedback about the responses ' +
                'you provided so far.</p><p>It is vital to our study that' +
                ' we only include responses from people who devoted ' +
                'their <strong>full attention</strong> to this study. ' +
                '<em>This will not ' +
                'affect in any way the payment you will receive for ' +
                'taking this survey.</em></p><p>In your honest opinion, ' +
                'should we use your responses, or should we discard your ' +
                'responses since you did not devote your full attention ' +
                'to the questions so far?</p><br/>',
            choices: [
                'Yes, I have devoted full attention to the questions so ' +
                    'far and I think you should use my responses for ' +
                    'your study',
                'No, I have not devoted full attention to the questions ' +
                    'so far and I think you should not use my ' +
                    'responses for your study'
            ],
            orientation: 'V',
            requiredChoice: true,
            shuffleChoices: true,
            hint: 'Please answer'
        },
        done: function(values) {
            // Simplify.
            values.commit = true;
            values.value = values.value.charAt(0);
            return values;
        }
    });

    stager.extendStep('Part3_Impact', {
        name: 'Part 3: Your opinion',
        frame: 'Impact_on_you.htm',
        donebutton: false,
        cb: function() {
            node.get('districtData', function(data) {

                var lifeLost = data.life_lost;
                lifeLost = Number(lifeLost.toFixed(1));
                node.game.lifeLost = lifeLost;

                // console.log(data);
                W.setInnerHTML('state', data.state);
                W.setInnerHTML('district', data.district);
                W.setInnerHTML('districtQ', data.district);
                W.setInnerHTML('districtAgain', data.district);
                W.setInnerHTML('districtAgainAgain', data.district);
                W.setInnerHTML('district4', data.district);
                W.setInnerHTML('district5', data.district);
                W.setInnerHTML('pm25', data.pm25.toFixed(2));
                W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
                W.setInnerHTML('years', lifeLost);

                // ChoiceTable.
              //   var choices = [
              //     'Less than ' + (lifeLost * 0.5).toFixed(0) + ' years',
              //     (lifeLost * 0.5).toFixed(0) + ' - ' + lifeLost.toFixed(0) + ' years',
              //     lifeLost.toFixed(0) + ' - ' + (lifeLost * 1.5).toFixed(0) + ' years',
              //     (lifeLost * 1.5).toFixed(0) + ' - ' + (lifeLost * 2).toFixed(0) + ' years',
              //     'more than ' + (lifeLost * 2).toFixed(0) + ' years'
              // ];

              var choicesMoreOrLess = node.game.choicesMoreOrLess = [
              [ 'less', 'Less than ' + lifeLost  + ' years' ],
              [ 'same', 'About ' + lifeLost  + ' years' ],
              [ 'more', 'More than ' + lifeLost  + ' years' ]
          ];

              // Slider.
              // var upperLimit = lifeLost * 2;
              // var texts = {
              //     currentValue: function(widget, value) {
              //         var y = ((value / 100) * upperLimit).toFixed(2);
              //         // Remove unused trailing zeros.
              //         if (y.charAt(y.length-1 === '0')) y.substr(0, y.length - 2);
              //         if (y.charAt(y.length-1 === '0')) y.substr(0, y.length - 3);
              //         y += ' <span style="font-size: smaller">Year' +
              //              (y === '1' ? '' : 's') + ' of life lost.</span>';
              //         return y;
              //     }
              // };


            node.game.Q_impact = node.widgets.append('ChoiceManager', "T_impact", {
                    id: 'T_impact_q',
                    // ref: 'controlQuestions',
                    simplify: true,
                    panel: false,
                    forms: [
                        // {
                        //     id: 'T_impact_q1',
                        //     orientation: 'H',
                        //     mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                        //     'Think about a household living in ' + data.district +
                        //     ' with a total annual income ' + node.game.settings.money + '. <br><br>' +
                        //     'How many years of life do you think they lose because of air pollution?<br>',
                        //     choices: choices,
                        //     requiredChoice: true
                        // },
                        // {
                        //     id: 'T_impact_q2',
                        //     orientation: 'H',
                        //     mainText: '<span style="font-weight: normal;color:gray;">Q2</span> According to your best guess,' +
                        //     ' how many years of life are <b><span style="color:#ff0000">YOU</span></b> likely to lose because of air pollution?',
                        //     choices: choices,
                        //     requiredChoice: true,
                        //     hidden: true
                        // }
                        {
                            id: 'T_impact_more_or_less',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                                      'Think about a household living in ' + data.district +
                                      ' with a total annual income of ' + node.game.settings.money + '. <br><br>' +
                                      'Is this household losing more or less years of life than the average?',
                            // mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                            // 'A household in ' + data.district +
                            // ' with a total annual income ' + node.game.settings.money +
                            // ' would lose more or less years of life than the average?',
                            choices: choicesMoreOrLess,
                            requiredChoice: true,
                            hidden: true
                        },

                        // {
                        //     id: 'T_impact_q1',
                        //     mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                        //     'Please type how many years of life they would lose.',
                        //     name: 'CustomInput',
                        //     hidden: true,
                        //     requiredChoice: true,
                        //     min: 0,
                        //     width: '25%',
                        //     hint: 'You can use fractions of numbers',
                        //     // preprocess: function(input) {
                        //     //     var value;
                        //     //     value = input.value;
                        //     //     value = value.replace(/\D/g, '');
                        //     //     input.value = value += " YEARS";
                        //     // },
                        //     // validation: function(value) {
                        //     //     var out;
                        //     //     value = value.replace("YEARS", '');
                        //     //     out = { value: value };
                        //     //     if (false === J.isNumber(value) || value < 0) {
                        //     //         out.err = 'Must be >= 0';
                        //     //     }
                        //     //     return out;
                        //     // },
                        //     placeholder: 'YEARS'
                        // },


                        // With sliders.
                        // {
                        //     id: 'T_impact_q1',
                        //     // mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                        //     // 'A household living in ' + data.district +
                        //     // ' with a total annual income ' + node.game.settings.money + '. <br><br>' +
                        //     // 'How many years of life do you think people in this houseld lose because of air pollution?<br>',
                        //     mainText: 'Please specify how many years of life they would lose.' +
                        //     ' <span style="font-size: smaller; font-weight: normal">Movement required.</span><br><br>',
                        //     hint: false,
                        //     name: 'Slider',
                        //     hidden: true,
                        //     requiredChoice: true,
                        //     // initialValue: Math.round((lifeLost / upperLimit) * 100),
                        //     initialValue: 0,
                        //     min: 0,
                        //     max: 100,
                        //     left: 0,
                        //     right: upperLimit,
                        //     displayNoChange: false,
                        //     type: 'flat',
                        //     panel: false,
                        //     texts: texts
                        // },

                        // {
                        //     id: 'T_impact_q2',
                        //     mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think about <span style="color:#ff0000">YOURSELF</span> now.<br><br>' +
                        //     'How many years of life do you think you lose because of air pollution?',
                        //     name: 'Slider',
                        //     hidden: true,
                        //     requiredChoice: true,
                        //     // initialValue: Math.round((lifeLost / upperLimit) * 100),
                        //     initialValue: 0,
                        //     min: 0,
                        //     max: 100,
                        //     left: 0,
                        //     right: upperLimit,
                        //     displayNoChange: false,
                        //     type: 'flat',
                        //     panel: false,
                        //     texts: texts
                        // }
                    ]
                });

                W.show('data', 'flex');
                node.game.doneButton.enable();
            });
        },
        done: function() {
            var w, q0, q1, q2, q3, v, intro, left, right, text, initialValue;
            var lifeLost, avg, avg2;

            lifeLost = node.game.lifeLost;

            w = node.game.Q_impact;

            // DISPLAY 1.
            intro = W.gid('intro');
            if (intro.style.display === 'none') {
                intro.style.display = '';
                return false;
            }

            // DISPLAY 2.
            q0 = w.formsById.T_impact_more_or_less;
            if (q0.isHidden()) {
                q0.reset(); // removes error.
                q0.show();
                return false;
            }

            // Define the slider update function.

            text = function(widget, value) {
                var y = (value / 100) * lifeLost;
                if (v !== 'less') y += lifeLost;
                y = y.toFixed(2);
                // Remove unused trailing zeros.
                if (y.charAt(y.length-1 === '0')) y.substr(0, y.length - 2);
                if (y.charAt(y.length-1 === '0')) y.substr(0, y.length - 3);
                y += ' <span style="font-size: x-large !important">Year' +
                     (y === '1' ? '' : 's') + ' of life lost because of air pollution.</span>';
                return y;
            };

            // Labels for sliders' extremes.
            avg = '<span style="font-size: small; font-style: italic">(average)</span>';
            avg2 = '<span style="font-size: small; font-style: italic">(2x average)</span>';

            // DISPLAY 3.
            q1 = w.formsById.T_impact_family;
            v = q0.getValues({ markAttempt: false }).value;
            q0.disable();
            if (v !== 'same' && !q1) {

                if (v === 'less') {
                    left = Math.max(0, (lifeLost - 2*lifeLost));
                    if (left !== 0) left = left.toFixed(2);
                    right = avg + ' ' + lifeLost;
                    initialValue = 100;
                }
                else {
                    left = lifeLost + ' ' + avg;
                    right = avg2 + ' ' + 2*lifeLost;
                    initialValue = 0;
                }

                node.widgets.last.addForm({
                    id: 'T_impact_family',
                    // mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                    // 'A household living in ' + data.district +
                    // ' with a total annual income ' + node.game.settings.money + '. <br><br>' +
                    // 'How many years of life do you think people in this houseld lose because of air pollution?<br>',
                    mainText: 'Please specify how many years of life you think they are losing.' +
                    ' <span style="font-size: small; font-weight: normal">(Movement required.)</span><br><br>',
                    hint: false,
                    name: 'Slider',
                    requiredChoice: true,
                    // initialValue: Math.round((lifeLost / upperLimit) * 100),
                    initialValue: initialValue,
                    min: 0,
                    max: 100,
                    left: left,
                    right: right,
                    displayNoChange: false,
                    type: 'flat',
                    panel: false,
                    texts: { currentValue: text }
                });

                return false;

            }

            // DISPLAY 4.
            q2 = w.formsById.T_impact_more_or_less_you;
            if (!q2) {
                if (q1) q1.disable();
                node.widgets.last.addForm({
                    id: 'T_impact_more_or_less_you',
                    orientation: 'H',
                    mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think about <span style="color:#ff0000">YOURSELF</span> now.<br><br>' +
                              'Are you losing more or less years of life than the average?',
                    // mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                    // 'A household in ' + data.district +
                    // ' with a total annual income ' + node.game.settings.money +
                    // ' would lose more or less years of life than the average?',
                    choices: node.game.choicesMoreOrLess,
                    requiredChoice: true
                });

                return false;
            }

            // DISPLAY 5.
            q3 = w.formsById.T_impact_you;
            v = q2.getValues({ markAttempt: false }).value;
            q2.disable();
            if (v !== 'same' && !q3) {

                if (v === 'less') {
                    left = Math.max(0, (lifeLost - 2*lifeLost));
                    if (left !== 0) left = left.toFixed(2);
                    right = avg + ' ' + lifeLost;
                    initialValue = 100;
                }
                else {
                    left = lifeLost + ' ' + avg;
                    right = avg2 + ' ' + 2*lifeLost;
                    initialValue = 0;
                }

                node.widgets.last.addForm({
                    id: 'T_impact_you',
                    // mainText: '<span style="font-weight: normal;color:gray;">Q1</span> ' +
                    // 'A household living in ' + data.district +
                    // ' with a total annual income ' + node.game.settings.money + '. <br><br>' +
                    // 'How many years of life do you think people in this houseld lose because of air pollution?<br>',
                    mainText: 'Please specify how many years of life you think YOU are losing.' +
                    ' <span style="font-size: small; font-weight: normal">(Movement required.)</span><br><br>',
                    hint: false,
                    name: 'Slider',
                    requiredChoice: true,
                    // initialValue: Math.round((lifeLost / upperLimit) * 100),
                    initialValue: initialValue,
                    min: 0,
                    max: 100,
                    left: left,
                    right: right,
                    displayNoChange: false,
                    type: 'flat',
                    panel: false,
                    texts: { currentValue: text }
                });

                return false;
            }

            return w.getValues();
        }
    });



    //////////////////////////////////////////////////////////////////////////
    // Introduction to donation
    stager.extendStep('Part3_The_fight_against_air_pollution', {
        name: "Part 3: Your opinion",
        frame: 'Donation_card.htm'
    });


    // DONATION -- Action trigger page
    stager.extendStep('Part3_Time_to_act!', {
        name: "Part 3: Your opinion",
        frame: 'Donation_card2.htm',
        widget: {
            name: 'ChoiceManager',
            id: 'D_f',
            options: {
                simplify: true,
                mainText: "",
                forms: [
                    {
                        id: 'D_f_c1',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Which non-governmental initiative do you want to support in the fight against air pollution?',
                        choices: [
                            [
                                'Chintan',
                                '<div class="aligned"><img src="https://www.chintan-india.org/sites/default/files/logo_0.png" width="100px"><span><b>Chintan</b> aims to reduce air pollution by improving waste management across India. For information, see https://www.chintan-india.org/.</span></div>'
                            ],
                            [
                                'Indian Pollution Control Association',
                                '<div class="aligned"><img src="https://ipcaworld.co.in/wp-content/uploads/2018/04/IPCA-Logo-small-1.png" width="100px"><span>The <b>Indian Pollution Control Association</b> aims to fight air pollution by installing air purifying units, air pollution monitoring and testing, and research. For information, see https://ipcaworld.co.in/.</span></div>'
                            ],
                            [
                                'Lung Care Foundation',
                                '<div class="aligned"><img src="https://lcf.org.in/wp-content/uploads/logo-lcf1.png" width="100px"><span>The <b>Lung Care Foundation</b> supports - among other things - the "Doctors for clean air" intiative that is active in more than 20 states of India and aims to raise awareness for the air pollution crisis. For information, see https://lcf.org.in/.</span></div>'
                            ],
                            [
                                'WWF India',
                                '<div class="aligned"><img src="https://s3.amazonaws.com/wwfinternational/landing/img/logo.png" width="100px"><span><b> WWF India</b> is an environmental organisation that aims to stop the degredation of the natural environment by, among other things, promoting the reduction of pollution and wasteful consumption. For more information, see https://www.wwfindia.org/.</span></div>',
                            ],
                            [
                                'none',
                                '<div class="aligned"><img src="x.png" width="100px"><span>I <strong>don\'t want</strong> to support the fight against air pollution.</span></div>',
                            ]
                        ],
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var e1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.D_f_c1.choices.length - 1;
                            e1 = forms.D_f_c2;
                            if (this.isChoiceCurrent(len)) {
                                e1.setValues(0);
                                e1.hide();
                            }
                            else {
                                e1.show();
                            }
                        }
                    },
                    {
                        id: 'D_f_c2',
                        name: 'Slider',
                        type: 'flat',
                        hidden: true,
                        min: 0,
                        max: 150,
                        panel: false,
                        initialValue: 0,
                        requiredChoice: true,
                        displayNoChange: false,
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> How much of the bonus reward of $1.50 do you want to contribute?',
                        hint: '<b>Please move the slider to your preferred contribution amount.</b> <br> <span style="font-size:12px;"> Your contribution will be given to the intiative of your choice by the researchers at Heidelberg University. The rest will go to you.',
                        texts: {
                            currentValue: function(widget, value) {
                                let contribution = [
                                    '$0.00', '$0.01', '$0.02', '$0.03', '$0.04', '$0.05', '$0.06', '$0.07', '$0.08', '$0.09',
                                    '$0.10', '$0.11', '$0.12', '$0.13', '$0.14', '$0.15', '$0.16', '$0.17', '$0.18', '$0.19',
                                    '$0.20', '$0.21', '$0.22', '$0.23', '$0.24', '$0.25', '$0.26', '$0.27', '$0.28', '$0.29',
                                    '$0.30', '$0.31', '$0.32', '$0.33', '$0.34', '$0.35', '$0.36', '$0.37', '$0.38', '$0.39',
                                    '$0.40', '$0.41', '$0.42', '$0.43', '$0.44', '$0.45', '$0.46', '$0.47', '$0.48', '$0.49',
                                    '$0.50', '$0.51', '$0.52', '$0.53', '$0.54', '$0.55', '$0.56', '$0.57', '$0.58', '$0.59',
                                    '$0.60', '$0.61', '$0.62', '$0.63', '$0.64', '$0.65', '$0.66', '$0.67', '$0.68', '$0.69',
                                    '$0.70', '$0.71', '$0.72', '$0.73', '$0.74', '$0.75', '$0.76', '$0.77', '$0.78', '$0.79',
                                    '$0.80', '$0.81', '$0.82', '$0.83', '$0.84', '$0.85', '$0.86', '$0.87', '$0.88', '$0.89',
                                    '$0.90', '$0.91', '$0.92', '$0.93', '$0.94', '$0.95', '$0.96', '$0.97', '$0.98', '$0.99',
                                    '$1.00', '$1.01', '$1.02', '$1.03', '$1.04', '$1.05', '$1.06', '$1.07', '$1.08', '$1.09',
                                    '$1.10', '$1.11', '$1.12', '$1.13', '$1.14', '$1.15', '$1.16', '$1.17', '$1.18', '$1.19',
                                    '$1.20', '$1.21', '$1.22', '$1.23', '$1.24', '$1.25', '$1.26', '$1.27', '$1.28', '$1.29',
                                    '$1.30', '$1.31', '$1.32', '$1.33', '$1.34', '$1.35', '$1.36', '$1.37', '$1.38', '$1.39',
                                    '$1.40', '$1.41', '$1.42', '$1.43', '$1.44', '$1.45', '$1.46', '$1.47', '$1.48', '$1.49',
                                    '$1.50' //, '$1.51', '$1.52', '$1.53', '$1.54', '$1.55', '$1.56', '$1.57', '$1.58', '$1.59',
                                    //'$1.60', '$1.61', '$1.62', '$1.63', '$1.64', '$1.65', '$1.66', '$1.67', '$1.68', '$1.69',
                                    //'$1.70', '$1.71', '$1.72', '$1.73', '$1.74', '$1.75', '$1.76', '$1.77', '$1.78', '$1.79',
                                    //'$1.80', '$1.81', '$1.82', '$1.83', '$1.84', '$1.85', '$1.86', '$1.87', '$1.88', '$1.89',
                                    //'$1.90', '$1.91', '$1.92', '$1.93', '$1.94', '$1.95', '$1.96', '$1.97', '$1.98', '$1.99',
                                    //'$2.00', '$2.01', '$2.02', '$2.03', '$2.04', '$2.05', '$2.06', '$2.07', '$2.08', '$2.09',
                                    //'$2.10', '$2.11', '$2.12', '$2.13', '$2.14', '$2.15', '$2.16', '$2.17', '$2.18', '$2.19',
                                    //'$2.20', '$2.21', '$2.22', '$2.23', '$2.24', '$2.25', '$2.26', '$2.27', '$2.28', '$2.29',
                                    //'$2.30', '$2.31', '$2.32', '$2.33', '$2.34', '$2.35', '$2.36', '$2.37', '$2.38', '$2.39',
                                    //'$2.40', '$2.41', '$2.42', '$2.43', '$2.44', '$2.45', '$2.46', '$2.47', '$2.48', '$2.49',
                                    //'$2.50'
                                ];
                                node.game.contributionAmount = contribution[(value)];
                                return '<span style=\'color:green;font-size:20px;\'>Your contribution to fighting air pollution: ' + contribution[(value)] + '</span>';
                            }
                        }
                    },
                    {
                        id: 'info_cc',
                        name: 'ContentBox',
                        hidden: true,
                        mainText: '' ,// '<div style="font-weight: normal; margin-left: 0">' +
                            // 'Please confirm your contribution decision.' +
                            // 'On the previous page, you indicated that you would like to use part of your bonus to support' +
                            // ' an organization fighting air pollution.<br><br>',
                            // ' Below, we ask you to confirm your choice. ' +
                            // ' By clicking the "Yes, I confirm my contribution of<span id="amount4"></span>to the<span id="org2" style="display: contents"></span>." button below, you' +
                            // ' authorize Dr. Tillmann Eymess (Heidelberg University, tillmann.eymess@awi.uni-heidelberg.de) to transfer the specified amount to the selected organization.<br><br>' +
                            // ' After the study concludes, all contribution receipts will be' +
                            // " available on our research group's webpage at" +
                            // ' <a target="_blank" href="https://www.uni-heidelberg.de/fakultaeten/wiso/awi/professuren/umwelt/breathing.html">Heidelberg University</a>.<br>' +
                            // ' If you click "No, I do not consent.", we will not be able to make the transfer in your name.'
                    },
                    {
                        id: 'CC2',
                        name: 'CustomInput',
                        mainText: 'You have the option' +
                        ' to have your name appear on the University\'s website among the list of contributors.<br>',
                        hint: '<div style="margin-left: 0">If you wish to have your name displayed, please enter your name below,' +
                        ' or leave blank to contribute anonymously.' +
                        ' After the study concludes, all contribution receipts will be' +
                        " available on our research group's webpage at Heidelberg University" +
                        ' <a target="_blank" href="https://www.uni-heidelberg.de/fakultaeten/wiso/awi/professuren/umwelt/breathing.html">(link to webpage)</a>.<br>',
                        width: '95%',
                        requiredChoice: false,
                        hidden: true
                    },
                    {
                        id: 'CC1',
                        orientation: 'H',
                        mainText: 'Please confirm your contribution.<br>',
                        hint:  '<div style="margin-left: 0">By clicking the "Yes, I confirm my contribution of<span id="amount4"></span>to the <span id="org2" style="display: contents"></span>." button below, you' +
                        ' authorize Dr. Tillmann Eymess (Heidelberg University, tillmann.eymess@awi.uni-heidelberg.de) to transfer the specified amount to the selected organization.<br>' +
                        ' If you click "No, I do not consent", we will not be able to make the transfer in your name.',
                        choices: [
                            [ 'confirm', 'Yes, I confirm my contribution of<span id="amount2"></span>to the<span id="org1">.</span>' ],
                            [ 'deny', 'No, I do not consent.' ]
                        ],
                        requiredChoice: true,
                        hidden: true,
                        onclick: function() {
                            node.done();
                        }
                    },

                ]
            }
        },
        done: function(values) {
            var org, amount, forms;
            // Note. Simplify: true.
            org = values.D_f_c1.value;

            // Nothing to do.
            if (org === 'none') return;

            forms = node.widgets.lastAppended.formsById;

            // Note. Simplify: true.
            amount = values.D_f_c2.value
            if (amount === 0) {
                forms.D_f_c2.highlight();
                return false;
            }

            node.game.doneButton.disable();

            W.setInnerHTML("amount", node.game.contributionAmount || "");
            W.setInnerHTML("amount2", node.game.contributionAmount || "");
            W.setInnerHTML("amount3", node.game.contributionAmount || "");
            W.setInnerHTML("amount4", node.game.contributionAmount || "");
            W.setInnerHTML("org1", org || "");
            W.setInnerHTML("org2", org || "");
            W.setInnerHTML("org3", org || "");


            // Hide other page details.
            W.hide('info_top');
            forms.D_f_c1.hide();
            forms.D_f_c2.hide();

            // Show official consent form.
            forms.info_cc.show();
            forms.CC1.reset(); // removes highlight.
            forms.CC1.show();
            forms.CC2.show();

            if ('undefined' === typeof node.game.confirm) {
                node.game.confirm = true;
                return false;
            }

        }
    });


    // //////////////////////////////////////////////////////////////////////////
    // // Introduction to donation
    // stager.extendStep('Part3_Intro_stated_pref', {
    //     name: "Part 3: What can you do?",
    //     frame: 'Stated_preferences_intro.htm'
    // });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    stager.extendStep('Part3_Policies_to_reduce_pollution', {
        name: "Part 3: Your opinion",
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'stated_preferences',
                mainText: '<b>Policies to reduce air pollution</b>',
                simplify: true,
                forms: [
                    {
                        name: 'ChoiceTableGroup',
                        id: 'stated_support',
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> <span style=\'font-size:18px;font-weight:normal;\'>How willing are you' +
                        ' to support the implementation of the following policies in <b>your district</b></span>?',
                        choices: [
                            'Strongly oppose', 'Somewhat oppose', 'Undecided',
                            'Somewhat support', 'Strongly support'
                        ],
                        items: [
                            {
                                id: 'burn',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Ban on burning waste and agricultural residues</span>'
                            },
                            {
                                id: 'reg_tax',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Higher vehicle registration taxes and road taxes</span>'
                            },
                            {
                                id: 'fuel_tax',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Higher fuel taxes</span>'
                            },
                            {
                                id: 'no_drive',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Extension or introduction of days when vehicles are not allowed to drive</span>'
                            }
                        ],
                        shuffleChoices: false
                    }
                ],
                formsOptions: {
                    requiredChoice: true
                    // shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    stager.extendStep('Part3_Protection_measures', {
        name: "Part 3: Your opinion",
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'Prot_q',
                mainText: '<b>Methods to protect yourself against air pollution</b>',
                simplify: true,
                forms: [
                    {
                        name: 'ChoiceTableGroup',
                        id: 'stated_defense',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> <span style=\'font-size:18px;font-weight:normal;\'>How likely are you to adopt or continue using the following <b>defensive strategies</b> against air pollution?</span>',
                        choices: [
                            'Not likely at all', 'Rather unlikely', 'Undecided',
                            'Rather likely', 'Very likely'
                        ],
                        items: [
                            {
                                id: 'air_pur',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Use an air purifier indoors</span>'
                            },
                            {
                                id: 'avoid',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Do preventive medical check-ups</span>'
                            },
                            {
                                id: 'change',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Change your commute route or time schedule to avoid high pollution areas</span>'
                            },
                            {
                                id: 'ventilate',
                                left: '<span style=\'font-size:16px;font-weight:bold;\'>Ventilate rooms frequently</span>'
                            }
                        ],
                        shuffleChoices: false
                    }
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });

    // ///////////////////////////////////////////////////////////////////////////////
    // /// Instructions FINAL QUESTIONS
    // stager.extendStep('Instructions_Part_4', {
    //     name: "Part 4: Instructions",
    //     frame: 'Instructions_part4.htm'
    // });



    ///////////////////////////////////////////////////////////////////////////////
    /// FINAL QUESTIONS
    stager.extendStep('Part3_About_yourself', {
        name: "Part 3: Your opinion",
        widget: {
            name: 'ChoiceManager',
            id: 'Part3_q',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'Part3_q1',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How old are you?',
                        width: '95%',
                        type: 'int',
                        min: 0,
                        max: 100,
                        requiredChoice: true,
                    },
                    {
                        id: 'Part3_q2',
                        orientation: 'V',
                        mainText: 'What caste do you belong to?',
                        choices: [ 'Upper caste', 'Lower caste (Scheduled caste / Scheduled tribe)', 'No caste / other'],
                        requiredChoice: true
                    },
                    {
                        id: 'Part3_q3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> How happy are you in general?',
                        choices: ['Very happy','Rather happy','Neutral','Not very happy','Not at all happy'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        id: 'Part3_q4',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> How healthy do you feel these days?',
                        choices: ['Very healthy','Healthy','Neutral','A bit unhealthy','Very unhealthy'],
                        shuffleChoices: false,
                        requiredChoice: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////
    stager.extendStep('Part3_Income', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'P4_lq',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        id: 'income_control',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q10</span> In 2020, what was the annual income of your household?<br>',
                        hint: 'Please refer to the <strong>total income</strong> of ALL members living in your household in 2020. The household annual income includes total sum of income earned in your household in 2020, before any taxes or deductions. This includes wages and salaries from all jobs (incl. in-kind payments valued at retail price), the revenue from self-employment, and all income from casual labour.',
                        choices: ['Less than 2,00,000 INR',
                                  '2,00,000 INR – 5,00,000 INR',
                                  '5,00,000 INR – 10,00,000 INR',
                                  '10,00,000 INR – 20,00,000 INR',
                                  '20,00,000 INR or more'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        id: 'income_group',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q11</span> What is your income group?<br><br>'+
                        '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire population living in <b>your district</b> is divided into 10 income groups,'+
                        ' each with the same number of households. The figure below illustrates the 10 groups, ordered from left to right from the poorest 10%'+
                        ' to the richest 10%.' +
                        '</span><br><br><img src="https://i.ibb.co/sbMXxDd/District-groups.png" alt="Indian-groups" border="0" width="800px"></a><br><br>' +
                        'In your opinion, which income group is your household part of?',
                        choices: [
                            ['Group 1', '<span style=\'font-size:14px;font-weight:normal;\'>Group 1</span>'],
                            ['Group 2', '<span style=\'font-size:14px;font-weight:normal;\'>Group 2</span>'],
                            ['Group 3', '<span style=\'font-size:14px;font-weight:normal;\'>Group 3</span>'],
                            ['Group 4', '<span style=\'font-size:14px;font-weight:normal;\'>Group 4</span>'],
                            ['Group 5', '<span style=\'font-size:14px;font-weight:normal;\'>Group 5</span>'],
                            ['Group 6', '<span style=\'font-size:14px;font-weight:normal;\'>Group 6</span>'],
                            ['Group 7', '<span style=\'font-size:14px;font-weight:normal;\'>Group 7</span>'],
                            ['Group 8', '<span style=\'font-size:14px;font-weight:normal;\'>Group 8</span>'],
                            ['Group 9', '<span style=\'font-size:14px;font-weight:normal;\'>Group 9</span>'],
                            ['Group 10', '<span style=\'font-size:14px;font-weight:normal;\'>Group 10</span>'],
                            ],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        id: 'income_top10',
                        name: 'CustomInput',
                        hidden: false,
                        min: 0,
                        type: 'int',
                        requiredChoice: true,
                        width: '95%',
                        mainText: '<span style="font-weight: normal;color:gray;">Q12</span> In your opinion,' +
                        ' what annual income is required to be in Group 10 (the richest 10%)?<br>',
                        hint: '(Please indicate your answer in INR.)'
                    }
                ]
            }
        }
    });


    ////////////////////////////////////////////////////////////////////////////
    // FEEDBACK
    stager.extendStep('feedback', {
        widget: {
            name: 'Feedback',
            options: {
                title: false,
                panel: false,
                minChars: 50,
                showSubmit: false,
                mainText: 'Thank you for participating. ' +
                '<br><br>' +
                "If you want to get in touch with us for questions or suggestions, " +
                "please write us an email at <em><span style='color:#bf2b42'>pob.heidelberg@gmail.com</span></em>." +
                '<br><br>' +
                'We are very interested in ' +
                'hearing your <strong>feedback</strong> about the ' +
                'following points:<br/><br/><em><ol>' +
                '<li>Was the survey too long or too short?</li>' +
                '<li>Did you find any question unclear or ' +
                'uncomfortable?</li>' +
                '<li>Did you experience any technical difficulty?</li>' +
                '<li>Was the map of your district loading correctly?</li>' +
                '<li>How can we improve the study?</li></ol>'
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////////
    // END OF SURVEY
    //////////////////////////////////////////////////////////////////////////////
    stager.extendStep('end', {
        widget: {
            name: 'EndScreen',
            options: {
                feedback: false
            }
        },
        init: function() {
            node.game.doneButton.destroy();
            node.say('end');
        }
    });
};
