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
                        id: 'age',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> How old are you?',
                        width: '95%',
                        type: 'int',
                        min: 18,
                        max: 100,
                        requiredChoice: true,
                    },
                    {
                        id: 'gender',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> What is your gender?',
                        choices: ['Male', 'Female', 'Other','Prefer not to say'],
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
                simplify: true,
                forms: [
                    {
                        name: 'Dropdown',
                        id: 'state',
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> Select the state in which you currently live. <span style="font-weight: normal;">*</span>',
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Select the district in which you currently live. <span style="font-weight: normal;">*</span>' +
                        '<br><span style="font-weight: normal;">In case you cannot find your district in the list, please choose the nearest one.</span>',
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
                        id: 'urban',
                        // orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Do you live in a village or a town/city?',
                        choices: [
                          ['rural', 'Village'],
                          ['urban', 'Town/city'],
                        ],
                        shuffleChoices: true,
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
        frame: 'income_page.htm',
        donebutton: false,
        cb: function() {

            node.get('districtData', function(data) {

            node.game.IncomeQuestions = node.widgets.append('ChoiceManager', "incomePage", {
                id: 'q4',
                className: 'centered',
                // ref: 'controlQuestions',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'education',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational training','Bachelor degree','Masters degree or higher'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'CustomInput',
                        id: 'hhsize',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How many people live in your household?<br>',
                        hint: '(Think about everyone that lives at least eight months per year in your house. Answer should include yourself.)',
                        width: '95%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        id: 'income',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> In 2021, what was the total annual income of your household?<br>' +
                        '<span style="font-weight: normal;"> Please refer to the total income of ALL members living in your household in 2021, ' +
                        'before any taxes or deductions. This includes:<br> '+
                        '- wages and salaries from all jobs <br>' +
                        '- the revenue from self-employment <br>' +
                        '- all income from casual labour.</span>',
                        choices: function() {
                            if (data.decile_number === 10) return [
                                ['Group 1', 'Less than ' + (data.pct10) + ' INR'],
                                ['Group 2', 'Between ' + (data.pct10) + ' INR and ' + (data.pct20) + ' INR'],
                                ['Group 3', 'Between ' + (data.pct20) + ' INR and ' + (data.pct30) + ' INR'],
                                ['Group 4', 'Between ' + (data.pct30) + ' INR and ' + (data.pct40) + ' INR'],
                                ['Group 5', 'Between ' + (data.pct40) + ' INR and ' + (data.pct50) + ' INR'],
                                ['Group 6', 'Between ' + (data.pct50) + ' INR and ' + (data.pct60) + ' INR'],
                                ['Group 7', 'Between ' + (data.pct60) + ' INR and ' + (data.pct70) + ' INR'],
                                ['Group 8', 'Between ' + (data.pct70) + ' INR and ' + (data.pct80) + ' INR'],
                                ['Group 9', 'Between ' + (data.pct80) + ' INR and ' + (data.pct90) + ' INR'],
                                ['Group 10', 'More than ' + (data.pct90) + ' INR']
                            ]
                            else if  (data.decile_number === 9) return [
                                ['Group 2', 'Less than ' + (data.pct20) + ' INR'],
                                ['Group 3', 'Between ' + (data.pct20) + ' INR and ' + (data.pct30) + ' INR'],
                                ['Group 4', 'Between ' + (data.pct30) + ' INR and ' + (data.pct40) + ' INR'],
                                ['Group 5', 'Between ' + (data.pct40) + ' INR and ' + (data.pct50) + ' INR'],
                                ['Group 6', 'Between ' + (data.pct50) + ' INR and ' + (data.pct60) + ' INR'],
                                ['Group 7', 'Between ' + (data.pct60) + ' INR and ' + (data.pct70) + ' INR'],
                                ['Group 8', 'Between ' + (data.pct70) + ' INR and ' + (data.pct80) + ' INR'],
                                ['Group 9', 'Between ' + (data.pct80) + ' INR and ' + (data.pct90) + ' INR'],
                                ['Group 10', 'More than ' + (data.pct90) + ' INR']
                            ]
                            else if (data.decile_number === 8) return [
                                ['Group 3', 'Less than ' + (data.pct30) + ' INR'],
                                ['Group 4', 'Between ' + (data.pct30) + ' INR and ' + (data.pct40) + ' INR'],
                                ['Group 5', 'Between ' + (data.pct40) + ' INR and ' + (data.pct50) + ' INR'],
                                ['Group 6', 'Between ' + (data.pct50) + ' INR and ' + (data.pct60) + ' INR'],
                                ['Group 7', 'Between ' + (data.pct60) + ' INR and ' + (data.pct70) + ' INR'],
                                ['Group 8', 'Between ' + (data.pct70) + ' INR and ' + (data.pct80) + ' INR'],
                                ['Group 9', 'Between ' + (data.pct80) + ' INR and ' + (data.pct90) + ' INR'],
                                ['Group 10', 'More than ' + (data.pct90) + ' INR']
                            ]
                        },
                        shuffleChoices: false,
                        requiredChoice: true,
                        choicesSetSize: 2
                    }
                ]
            });
            node.game.doneButton.enable();
        });
    },
    done: function() {
        return node.game.IncomeQuestions.getValues();
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
                        id: 'employment_dummy',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> Are you currently employed?',
                        choices: [ 'No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, w2, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.employment_dummy.choices.length - 1;
                            w1 = forms.employment_sector;
                            w2 = forms.commute;
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
                        id: 'employment_sector',
                        orientation: 'H',
                        choicesSetSize: 2,
                        mainText: '<span style="font-weight: normal;color:gray;">Q10</span> In which sector do you work?',
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
                            len = forms.employment_sector.choices.length - 1;
                            w = forms.employment_specify;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'employment_specify',
                        mainText: '<span style="font-weight: normal;color:gray;">Q10b</span> Please specify.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'commute',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q11</span> During a typical day, how long does it take you to go from home to work?<br>',
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
                        id: 'lighting_fuel',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q12</span> What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Gas','Solar lamp','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.lighting_fuel.choices.length - 1;
                            w1 = forms.lighting_fuel_other;
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
                        id: 'lighting_fuel_other',
                        mainText: '<span style="font-weight: normal;color:gray;">Q12b</span> Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'cooking_fuel',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q13</span> What do you use for cooking fuel at home?<br>',
                        choices: ['Dung cakes','Wood','Coal','Kerosene','Gas','Electric stove','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        selectMultiple: 7,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.cooking_fuel.choices.length - 1;
                            w1 = forms.cooking_fuel_other;
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
                        id: 'cooking_fuel_other',
                        mainText: '<span style="font-weight: normal;color:gray;">Q13b</span> Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'cooking_location',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q14</span> In your home, in which room is food prepared usually?',
                        choices: [
                          ['indoors', 'Cooking is done in the main living area.'],
                          ['separate','Cooking is done in a separate kitchen.'],
                        ],
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
                        id: 'ac_ownership',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q15</span> Do you own an air conditioner (AC) at home?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        id: 'purifier_ownership',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16</span> Do you own an air purifier or particle filter at home?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                        onclick: function(value, removed) {
                            var w1, w2, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.purifier_ownership.choices.length - 1;
                            w1 = forms.purifier_year;
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
                        id: 'purifier_year',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16b</span> Which year did you purchase your air purifier',
                        width: '95%',
                        hidden: true,
                        type:'int',
                        min: 1900,
                        max: 2022,
                        requiredChoice: true,
                    },
                    {
                        id: 'purifier_friends',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q17</span> How many people in your circle of family and friends own an air purifier?',
                        choices: ['Nobody','Very few','Less than half','Most of them','Everyone',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        id: 'strategy_exposure',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q18</span> When you are home, do you do something to reduce your own exposure to air pollution?',
                        choices:['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.strategy_exposure.choices.length - 1;
                            w1 = forms.strategy_home;
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
                        id: 'strategy_home',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q19</span> What do you do to reduce air pollution in your home?',
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
                        id: 'exercise',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q20</span> How often do you do physical exercise?<br>',
                        hint:'(Think of when you play sports, go jogging, go to the gym, practice yoga/pilates at home etc.)',
                        choices: [ 'Never','Very rarely','Once a month','Every week','Several times per week'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'smoking',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q21</span> Do you smoke tobacco (cigarettes, hookah, bidi, etc.)?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'health_five_years',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q22</span> In the past 5 years, did YOU have any of the following health conditions?<br>',
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



    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    // PART II
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // Instructions Part II
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
                mainText: 'Based on the box above, find the correct answer to the questions below.<br>' +
                '<span style="color:gray;font-size:14px;">(All your answers need to be correct in order to be able to proceed to the next page.) </span>',
                forms: [
                    {
                        id: 'comprehension_leaflet1_1',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q1</span> Which of the following statements is correct?',
                        choices: [
                          [1, 'Air pollution is mostly generated outdoors, but not indoors.'],
                          [2, 'Air pollution can be generated both indoors and outdoors.'],
                          [3, 'Air pollution is mostly generated indoors, but not outdoors.'],
                        ],
                        correctChoice: 1,
                    },
                    {
                        id: 'comprehension_leaflet1_2',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Which of the following statements is correct?',
                        choices: [
                          [1, 'Only industries cause air pollution.'],
                          [2, 'Air pollution is generated by many sources and everyone is responsible to different degrees for the air pollution problem.'],
                        ],
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
                mainText: 'Based on the box above, find the correct answer to the questions below.<br>',
                forms: [
                    {
                        id: 'comprehension_leaflet2_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q3</span> How many deaths are caused each year by air pollution in India?',
                        choices: [
                          [1, "Less than 1 million"],
                          [2, "About 1.67 million"],
                          [3, "More than 3 million"],
                        ],
                        correctChoice: 1,
                    },
                    {
                        id: 'comprehension_leaflet2_2',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Which of the following statements is correct?',
                        choices: [
                          [1, "Air pollution causes only health damages."],
                          [2, "Air pollution causes both health and economic damages."],
                          [3, "Air pollution causes no damages."],
                      ],
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
                mainText: 'Based on the box above, find the correct answer to the question below.',
                 forms: [
                    {
                        id: 'comprehension_leaflet3',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q5</span> Which of the following health conditions are caused by exposure to air pollution?<br>',
                        hint: '<span style="color:gray;font-size:14px;">(There are several correct answers and you have to find all of them.)</span>',
                        // Number of choices per row/column.
                        choicesSetSize: 6,
                        choices: [
                          [1, "HIV/AIDS"],
                          [2, "Hepatitis"],
                          [3, "Lung cancer"],
                          [4, "Heart disease"],
                          [5, "Respiratory infections"],
                        ],
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
                mainText: 'Based on the box above, find the correct answer to the questions below.',
                forms: [
                    {
                        id: 'comprehension_leaflet4_1',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> How many years of life do we lose on average by being exposed for a long time to air pollution that is 10 &mu;/m<sup>3</sup> higher than the WHO recommended level?<br>',
                        choices: ["0 years", "0.25 years", "0.5 years", "1 year", "2 years"],
                        correctChoice: 3,
                    },
                    {
                        id: 'comprehension_leaflet4_2',
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

                var image = 'district_maps/' + state_fig + '.png';

                W.gid('img').src = image;

                console.log(data);
                W.setInnerHTML('state', data.state);
                W.setInnerHTML('state2', data.state);
                W.setInnerHTML('state3', data.state);
                W.setInnerHTML('pm25', data.pm25.toFixed(2));
                W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
                W.setInnerHTML('years', data.life_lost.toFixed(1));

                node.game.controlQuestions = node.widgets.append('ChoiceManager', "ComprehquestionsL5", {
                    id: 'p5_q',
                    // ref: 'controlQuestions',
                    mainText: '',
                    simplify: true,
                    forms: [
                        {
                            id: 'comprehension_leaflet5',
                            orientation: 'H',
                            mainText: '<span style="font-weight: normal;color:gray;">Q8</span> On average, how many years of life does a person living in ' +data.state+ ' lose because of air pollution?<br>',
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
    // PART III
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // Instructions Part 3
    stager.extendStep('Instructions_Part_3', {
        name: 'Part 3: Instructions',
        frame: 'instructions_part3.htm'
    });



    // Commitment of full attention
    stager.extendStep('Part3_Commitment', {
        name: 'Part 3: Full Attention',
        widget: {
            name: 'ChoiceTable',
            id: 'commitment',
            title: false,
            panel: false,
            mainText: '<p>It is vital to our study that' +
                ' we only include responses from people who devoted ' +
                'their <strong>full attention</strong> to this study.<br><br></p>' +
                '<p><b><span style="font-weight: normal;color:gray;">Q1</span> In your honest opinion, ' +
                'should we use your responses or should we discard your ' +
                'responses since you did not devote your full attention ' +
                'to the questions so far?</b></p>',
            choices: [
                ['Yes', 'Yes, I have devoted full attention to the questions so ' +
                    'far and I think you should use my responses for ' +
                    'your study.'],
                ['No', 'No, I have not devoted full attention to the questions ' +
                    'so far and I think you should not use my ' +
                    'responses for your study.']
            ],
            orientation: 'V',
            requiredChoice: true,
            shuffleChoices: true,
            hint: 'This will not affect in any way the payment you will receive for taking this survey.'
        },
        done: function(values) {
            // Simplify.
            values.commit = true;
            values.value = values.value.charAt(0);
            return values;
        }
    });


    ////////////////////////////////////////////////////
    // TREATMENT: Income low
    //////////////////////////////////////
    stager.extendStep('Part3_T_Income_Low', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'PI_low',
            options: {
                simplify: true,
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                          'population living in <b>your state</b> is divided into 10 income groups, '+
                          'each with the same number of households. The figure below illustrates ' +
                          'the 10 groups, ordered from left to right from the poorest 10% '+
                          'to the richest 10%.' +
                '</span><br><br><img src="https://i.ibb.co/stw49nM/deciles-clean.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_anchor_low',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of a household living ' +
                                  'in the same state as you and earning a total annual income of 15,000 INR.<br><br>'+
                                  'In your opinion, which income group is this household part of?',
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
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            // len = forms.P3_q1_1.choices.length - 1;
                            w = forms.perceived_income_own;
                            w.show();
                            // w.hide();
                        }
                    },
                    {
                        id: 'perceived_income_own',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2b</span> Think of <span style="color:red;">YOUR</span> household now. ' +
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
                        requiredChoice: true,
                        hidden: true
                    }
                ]
            }
        }
    });


    ////////////////////////////////////////////////////
    // TREATMENT: Income HIGH
    //////////////////////////////////////
    stager.extendStep('Part3_T_Income_High', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'PI_high',
            options: {
                simplify: true,
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                          'population living in <b>your state</b> is divided into 10 income groups, '+
                          'each with the same number of households. The figure below illustrates ' +
                          'the 10 groups, ordered from left to right from the poorest 10% '+
                          'to the richest 10%.' +
                '</span><br><br><img src="https://i.ibb.co/stw49nM/deciles-clean.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_anchor_high',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of a household living ' +
                                  'in the same state as you and earning a total annual income of 1,00,00,000 INR.<br><br>'+
                                  'In your opinion, which income group is this household part of?',
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
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            // len = forms.P3_q1_1.choices.length - 1;
                            w = forms.perceived_income_own;
                            w.show();
                            // w.hide();
                        }
                    },
                    {
                        id: 'perceived_income_own',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2b</span> Think of <span style="color:red;">YOUR</span> household now. ' +
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
                        requiredChoice: true,
                        hidden: true
                    }
                ]
            }
        }
    });

    ////////////////////////////////////////////////////
    // TREATMENT: Control Income
    //////////////////////////////////////
    stager.extendStep('Part3_T_Income_Control', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'PI_control',
            options: {
                simplify: true,
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                          'population living in <b>your state</b> is divided into 10 income groups, '+
                          'each with the same number of households. The figure below illustrates ' +
                          'the 10 groups, ordered from left to right from the poorest 10% '+
                          'to the richest 10%.' +
                '</span><br><br><img src="https://i.ibb.co/stw49nM/deciles-clean.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_own',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of <span style="color:red;">YOUR</span> household. ' +
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

    ////////////////////////////////////////////////////
    // TREATMENT: Control Corrected Income
    //////////////////////////////////////
    stager.extendStep('Part3_T_Income_Corr_Control1', {
        name: "Part 3: Your opinion",
        //frame: 'Income_correction.htm',
        donebutton: false,
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'PI_correction',
            options: {
                simplify: true,
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                'population living in <b>your state</b> is divided into 10 income groups, '+
                'each with the same number of households. The figure below illustrates ' +
                'the 10 groups, ordered from left to right from the poorest 10% '+
                'to the richest 10%.' +
                '</span><br><br><img src="https://i.ibb.co/stw49nM/deciles-clean.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_own',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of <span style="color:red;">YOUR</span> household. ' +
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
                        requiredChoice: true,
                        onclick: function() {
                            node.game.doneButton.enable();
                        },
                    }
                ]
            }
        },
    });

//////////////////////////////////////////////////////////////////
    stager.extendStep('Part3_T_Income_Corr_Control2', {
        name: "Part 3: Your opinion",
        frame: 'Income_correction.htm',
        donebutton: false,
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');

            node.get('incomeDecile', function(data) {
                console.log(data);

                var income = data.income;
                var incomeGroup = income.substr("Group ".length);
                var incomeG = parseInt(incomeGroup, 10);
                console.log(incomeG);

                var guess = data.income_guess;
                var guessGroup = guess.substr("Group ".length);
                var guessG = parseInt(guessGroup, 10);
                console.log(guessG);

                var decile_number = data.row.decile_number;
                console.log(decile_number);

                W.show('data', 'flex');

                var evaluation;

                if (guessGroup === incomeGroup) {
                    evaluation = 'correct';
                    W.setInnerHTML('guess', guessGroup);
                    W.setInnerHTML('evaluation', evaluation);
                    W.setInnerHTML('group', income);
                    W.gid('img').src = 'Leaflet_images/' + income + '.png';
                    //W.gid('is_correct').src = 'correct.png';
                }
                else {
                    //W.gid('is_correct').src = 'incorrect.png';
                    if (decile_number === 10) {
                        evaluation = 'incorrect';
                        W.setInnerHTML('guess', guessGroup);
                        W.setInnerHTML('evaluation', evaluation);
                        W.setInnerHTML('group', income);
                        W.gid('img').src = 'Leaflet_images/' + income + '.png';
                    }
                    else if (decile_number === 9) {
                        if (guessG !== incomeG && guessG < 3 && incomeG < 3) {
                            evaluation = 'correct';
                            W.setInnerHTML('guess', guessGroup);
                            W.setInnerHTML('evaluation', evaluation);
                            W.setInnerHTML('group', guess);
                            W.gid('img').src = 'Leaflet_images/' + guess + '.png';
                        }
                        else {
                            evaluation = 'incorrect';
                            W.setInnerHTML('guess', guessGroup);
                            W.setInnerHTML('evaluation', evaluation);
                            W.setInnerHTML('group', income);
                            W.gid('img').src = 'Leaflet_images/' + income + '.png';
                        }
                    }
                    else if (decile_number === 8) {
                        if (guessG !== incomeG && guessG < 4 && incomeG < 4) {
                            evaluation = 'correct';
                            W.setInnerHTML('guess', guessGroup);
                            W.setInnerHTML('evaluation', evaluation);
                            W.setInnerHTML('group', guess);
                            W.gid('img').src = 'Leaflet_images/' + guess + '.png';
                        }
                        else {
                            evaluation = 'incorrect';
                            W.setInnerHTML('guess', guessGroup);
                            W.setInnerHTML('evaluation', evaluation);
                            W.setInnerHTML('group', income);
                            W.gid('img').src = 'Leaflet_images/' + income + '.png';
                        }
                    }
                }
                node.game.doneButton.enable();
            });
        }
    });

    stager.extendStep('Part3_T_Income_Corr_Control3', {
        name: "Part 3: Your opinion",
        //frame: 'Income_correction.htm',
        donebutton: false,
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'PI_correction_posterior',
            options: {
                simplify: true,
                mainText: '<img src="https://i.ibb.co/stw49nM/deciles-clean.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_own_posterior',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2b</span> After seeing the information from the Indian Ministry of Statistics and Programme Implementation: ' +
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
                        requiredChoice: true,
                        onclick: function() {
                            node.game.doneButton.enable();
                        },
                    }
                ]
            }
        },
    });

    ////////////////////////////////////////////////////////////////////////////
    /////// LYL OWN
    stager.extendStep('Part3_Impact', {
        name: 'Part 3: Your opinion',
        frame: 'Impact_on_you.htm',
        donebutton: false,
        widget: {
            name: 'ChoiceManager',
            panel: false,
            simplify: true,
            forms: [
                // Just to create the choice manager
                // without an empty forms array.
                {
                    id: 'T_dummy',
                    hidden: true,
                    mainText: 'Nothing',
                    choices: [0, 1]
                }
            ]
        },
        cb: function() {
            node.get('districtData', function(data) {

                var lifeLost = data.life_lost;
                var state = data.state;
                lifeLost = Number(lifeLost.toFixed(1));
                node.game.lifeLost = lifeLost;
                node.game.state = state;

                // console.log(data);
                W.setInnerHTML('state', data.state);
                W.setInnerHTML('state2', data.state);
                W.setInnerHTML('state3', data.state);
                W.setInnerHTML('pm25', data.pm25.toFixed(2));
                W.setInnerHTML('higher', (data.pm25 / 5).toFixed(0));
                W.setInnerHTML('years', lifeLost);


              node.game.choicesMoreOrLess = [
                  [ 'less', 'Less than ' + lifeLost  + ' years' ],
                  [ 'same', 'About ' + lifeLost  + ' years' ],
                  [ 'more', 'More than ' + lifeLost  + ' years' ]
              ];

                W.show('data', 'flex');
                node.game.doneButton.enable();
            });
        },
        done: function() {
            var q2, q3, q4, v, intro, left, right, text, initialValue;
            var state, lifeLost, avg, avg2, w;

            lifeLost = node.game.lifeLost;
            state = node.game.state;


            // DISPLAY 1.
            intro = W.gid('intro');
            if (intro.style.display === 'none') {
                intro.style.display = '';
                return false;
            }

            text = function(widget, value) {
                var y = (value / 100) * lifeLost;
                if (v !== 'less') y += lifeLost;
                y = y.toFixed(1);
                // Remove unused trailing zeros.
                if (y.charAt(y.length-1 === '0')) y.substr(0, y.length - 2);
                if (y.charAt(y.length-1 === '0')) y.substr(0, y.length - 3);
                y += ' <span style="font-size: x-large !important">years of life lost because of air pollution.</span>';
                return y;
            };

            // Labels for sliders' extremes.
            avg = '<span style="font-size: small; font-style: italic">(average)</span>';
            avg2 = '<span style="font-size: small; font-style: italic">(2x average)</span>';

            w = node.widgets.last;

            // DISPLAY 4.
            q2 = w.formsById.LYL_more_less;
            if (!q2) {
                // if (q1) q1.disable();
                node.widgets.last.addForm({
                    id: 'LYL_more_less',
                    orientation: 'H',
                    mainText: '<span style="font-weight: normal;color:gray;">Q3</span> Think about <span style="color:#ff0000">YOURSELF</span> now.<br><br>' +
                              'Are you losing more or less years of life than the average person in ' + state + '?',
                    choices: node.game.choicesMoreOrLess,
                    requiredChoice: true
                });

                return false;
            }

            // DISPLAY 5.
            q3 = w.formsById.LYL_own;
            v = q2.getValues({ markAttempt: false }).value;
            q2.disable();
            if (v !== 'same' && !q3) {

                if (v === 'less') {
                    left = Math.max(0, (lifeLost - 2*lifeLost));
                    if (left !== 0) left = left.toFixed(1);
                    right = avg + ' ' + lifeLost;
                    initialValue = 100;
                }
                else {
                    left = lifeLost + ' ' + avg;
                    right = avg2 + ' ' + 2*lifeLost;
                    initialValue = 0;
                }

                node.widgets.last.addForm({
                    id: 'LYL_own',
                    mainText: '<span style="font-weight: normal;color:gray;">Q4</span> Please specify how many years of life you think YOU are losing.' +
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

            // DISPLAY 6 -- How confident?
            q4 = w.formsById.LYL_own_confident;
            if (!q4) {
                node.widgets.last.addForm({
                    id: 'LYL_own_confident',
                    orientation: 'H',
                    mainText: '<span style="font-weight: normal;color:gray;">Q5</span> How confident are you about your answer?</span> <span style="font-weight: normal;">*</span>',
                    hint: false,
                    choices: [
                      ['1', 'Not confident at all'],
                      ['2', 'Not very confident'],
                      ['3', 'Neutral'],
                      ['4', 'Quite confident'],
                      ['5', 'Completely confident']
                    ],
                    shuffleChoices: false,
                    requiredChoice: true
                });

                return false;
            }

            return w.getValues();
        }
    });


    ///////////////////////////////////////////////////////////////////////////////
    /// SENTIMENT
    stager.extendStep('Part3_Sentiment', {
        name: "Part 3: Your opinion",
        widget: {
            name: 'ChoiceManager',
            id: 'Part3_q',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        id: 'general_happy',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q6</span> How happy are you in general?',
                        choices: ['Very happy','Rather happy','Neutral','Not very happy','Not at all happy'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        id: 'general_healthy',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q7</span> How healthy do you feel these days?',
                        choices: ['Very healthy','Healthy','Neutral','A bit unhealthy','Very unhealthy'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        id: 'general_satisfied',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> All things considered, ' +
                        'how satisfied are you with your life as a whole these ' + 'days? <br>' +
                        '<span style="font-weight: normal; font-size: 16px;"> Using a scale on which "1" means you are <em>"completely dissatisfied"</em> and "10" means you are <em>"completely satisfied"</em> where would you put your ' +
                        'satisfaction with your life as a whole?</span>',
                        left: 'Completely dissatisfied',
                        right: 'Completely satisfied',
                        choices: ['1','2','3','4','5','6','7','8','9','10'],
                        shuffleChoices: false,
                        requiredChoice: true
                    }
                ]
            }
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
        cb: function() {
            node.get('contributionReminder', function(data) {

                console.log(data.district);
                console.log(data.own);

                W.setInnerHTML('districtLYL', data.district);
                W.setInnerHTML('ownLYL', data.own);

            });
        },
        widget: {
            name: 'ChoiceManager',
            id: 'D_f',
            options: {
                simplify: true,
                mainText: "",
                forms: [
                    {
                        id: 'donation_target',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q9</span> Which non-governmental initiative do you want to support in the fight against air pollution?',
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
                                '<div class="aligned"><img src="https://lcf.org.in/wp-content/uploads/logo-lcf1.png" width="100px"><span>The <b>Lung Care Foundation</b> supports - among other things - the "Doctors for clean air" initiative that is active in more than 20 states of India and aims to raise awareness for the air pollution crisis. For information, see https://lcf.org.in/.</span></div>'
                            ],
                            [
                                'WWF India',
                                '<div class="aligned"><img src="https://s3.amazonaws.com/wwfinternational/landing/img/logo.png" width="100px"><span><b> WWF India</b> is an environmental organisation that aims to stop the degradation of the natural environment by, among other things, promoting the reduction of pollution and wasteful consumption. For more information, see https://www.wwfindia.org/.</span></div>',
                            ],
                            [
                                'none',
                                '<div class="aligned"><img src="x.png" width="100px"><span>None.</span></div>',
                            ]
                        ],
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var e1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.donation_target.choices.length - 1;
                            e1 = forms.donation_amount;
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
                        id: 'donation_amount',
                        name: 'Slider',
                        type: 'flat',
                        hidden: true,
                        min: 0,
                        max: 150,
                        panel: false,
                        initialValue: 0,
                        requiredChoice: true,
                        displayNoChange: false,
                        mainText: '<span style="font-weight: normal;color:gray;">Q10</span> How much of the bonus reward of $1.50 do you want to contribute?',
                        hint: '<b>Please move the slider to your preferred contribution amount.</b> <br> <span style="font-size:12px;"> Your contribution will be given to the initiative of your choice by the researchers at Heidelberg University. The rest will go to you.',
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
                                    '$1.50'
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
                        mainText: '' ,
                    },
                    {
                        id: 'confirmation',
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
            org = values.donation_target.value;

            // Nothing to do.
            if (org === 'none') return;

            forms = node.widgets.lastAppended.formsById;

            // Note. Simplify: true.
            amount = values.donation_amount.value
            if (amount === 0) {
                forms.donation_amount.highlight();
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
            forms.donation_target.hide();
            forms.donation_amount.hide();

            // Show official consent form.
            forms.info_cc.show();
            forms.confirmation.reset(); // removes highlight.
            forms.confirmation.show();
            //forms.CC2.show();

            if ('undefined' === typeof node.game.confirm) {
                node.game.confirm = true;
                return false;
            }
        }
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    stager.extendStep('Part3_Policies_to_reduce_pollution', {
        name: "Part 3: Your opinion",
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'stated_preferences',
                mainText: '<b>Think of the following policies to reduce air pollution</b>.',
                simplify: true,
                forms: [
                    {
                        name: 'ChoiceTableGroup',
                        id: 'stated_support',
                        mainText: '<span style="font-weight: normal;color:gray;">Q11</span> <span style=\'font-size:18px;font-weight:normal;\'>How willing are you' +
                        ' to support the implementation of the following policies in <b>your state</b></span>?',
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
                        mainText: '<span style="font-weight: normal;color:gray;">Q12</span> <span style=\'font-size:18px;font-weight:normal;\'>How likely are you to adopt or continue using the following <b>defensive strategies</b> against air pollution?</span>',
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

    ///////////////////////////////////////////////////////////////////////////////
    /// FINAL QUESTIONS
    stager.extendStep('Part3_EnvJustice', {
        name: "Part 3: Your opinion",
        widget: {
            name: 'ChoiceManager',
            id: 'env_just',
            options: {
                simplify: true,
                mainText: 'For each pair of statements below, tell us how much you agree with one <em>or</em> the other statement, using a 7-point scale.<br>'+
                '<span style="font-weight: normal; font-size: 15px;"> - <strong>"1"</strong> means you completely agree with the sentence on the left (Statement A);<br>' +
                '- <strong>"7"</strong> means you fully agree with the sentence on the right (Statement B);<br>' +
                '- If your opinion is somewhere in between, choose a number in between to reflect that.</span>',
                forms: [
                    {
                        id: 'env_justice_protection',
                        mainText: '<span style="font-weight: normal;color:gray;">Q13</span> Do you agree more with Statement A or with Statement B?<br><br>' +
                        '<span style="font-weight: normal;font-size:18px"><b>Statement A:</b> "Everyone should have equal access to protection measures against air pollution."<br>' +
                        '<b>Statement B</b>: "How much one is impacted by air pollution should depend mostly on how much effort she or he puts into reducing the impacts for themselves."</span>',
                        left: 'Statement A',
                        right: 'Statement B',
                        choices: [ '1', '2', '3', '4', '5', '6', '7'],
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            w = forms.env_justice_wealth;
                            w.show();
                        }
                    },
                    {
                        id: 'env_justice_wealth',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q14</span> Do you agree more with Statement A or with Statement B?<br><br>' +
                        '<span style="font-weight: normal;font-size:18px"><b>Statement A:</b> "All people should put the same effort into reducing air pollution in their state."<br>' +
                        '<b>Statement B</b>: "People that are more wealthy should contribute more to reducing air pollution in their state."</span>',
                        left: 'Statement A',
                        right: 'Statement B',
                        choices: [ '1', '2', '3', '4', '5', '6', '7'],
                        requiredChoice: true,
                        hidden: true,
                    }
                ]
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////////
    /// FINAL QUESTIONS
    stager.extendStep('Part3_Redistribution', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('button { width: 4%; height: 5%;}');
        },
        widget: {
            name: 'ChoiceManager',
            id: 'redis',
            options: {
                simplify: true,
                mainText: 'For each pair of statements below, tell us how much you agree with one <em>or</em> the other statement, using a 7-point scale.<br>' +
                '<span style="font-weight: normal; font-size: 15px;"> -  <strong>"1"</strong> means you fully agree with the statement on the left (Statement A);<br>' +
                '- <strong>"7"</strong> means you agree completely with the statement on the right (Statement B);<br>' +
                '- If your opinion is somewhere in between, choose a number in between to reflect that.</span>',
                forms: [
                    {
                        id: 'redis_income',
                        mainText: '<span style="font-weight: normal;color:gray;">Q15</span> Do you agree more with Statement A or with Statement B?<br><br>' +
                        '<span style="font-weight: normal;font-size:18px"><b>Statement A:</b> "Incomes should be made more equal."<br>' +
                        '<b>Statement B:</b> "There should be greater incentives for individual effort."</span>',
                        left: 'Statement A',
                        right: 'Statement B',
                        // header: ['Incomes should'],
                        choices: [ '1', '2', '3', '4', '5', '6', '7'],
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w, forms;
                            forms = node.widgets.lastAppended.formsById
                            w = forms.redis_work;
                            w.show();
                        }
                    },
                    // {
                    //     id: 'redis_responsibility',
                    //     orientation: 'H',
                    //     mainText: '<span style="font-weight: normal;color:gray;">Q16</span> Do you agree more with Statement A or with Statement B?<br><br>' +
                    //     '<span style="font-weight: normal;font-size:18px"><b>Statement A:</b> "Government should take more responsibility to ensure that everyone is provided for."<br>' +
                    //     '<b>Statement B:</b> "People should take more responsibility to provide for themselves."</span>',
                    //     left: 'Statement A',
                    //     right: 'Statement B',
                    //     choices: [ '1', '2', '3', '4', '5', '6', '7'],
                    //     requiredChoice: true,
                    //     hidden: true,
                    //     onclick: function(value, removed) {
                    //         var w, forms, len;
                    //         forms = node.widgets.lastAppended.formsById
                    //         w = forms.redis_work;
                    //         w.show();
                    //     }
                    // },
                    {
                        id: 'redis_work',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q16</span> Do you agree more with Statement A or with Statement B?<br><br>' +
                        '<span style="font-weight: normal;font-size:18px"><b>Statement A:</b> "In the long run, hard work usually brings a better life."<br>' +
                        '<b>Statement B</b>: "Hard work doesn’t generally bring success — it’s more a matter of luck and connections."</span>',
                        left: 'Statement A',
                        right: 'Statement B',
                        choices: [ '1', '2', '3', '4', '5', '6', '7'],
                        requiredChoice: true,
                        hidden: true,
                    }
                ]
            }
        }
    });


////////////////////////////////////////////////////////////////////////////////
    stager.extendStep('Part3_Inequality', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'inequality',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        id: 'inequality_gap',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q17</span> Do you agree or disagree that:<br><br> <u>"The gap between the rich and the poor in India is too large"?</u>',
                        choices: ['Strongly agree', 'Agreee', 'Neutral', 'Disgree', 'Strongly disagree'],
                        requiredChoice: true,
                    },
                    {
                        id: 'inequality_government',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q18</span> To what extent do you agree or disagree that:<br><br> <u>"It is the responsibility of the government to reduce the gap between the rich and the poor"?</u>',
                        choices: ['Strongly agree', 'Agreee', 'Neutral', 'Disgree', 'Strongly disagree'],
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

////////////////////////////////////////////////////////////////////////////////
    stager.extendStep('Part3_Altruism', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'altruism',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                  {
                      id: 'general_altruism',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q19</span> How do you assess your willingness to do good for others without expecting anything in return?',
                      left: 'Completely unwilling',
                      right: 'Very willing',
                      choices: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                      requiredChoice: true,
                      onclick: function(value, removed) {
                          var w, forms;
                          forms = node.widgets.lastAppended.formsById
                          w = forms.donate_charity;
                          w.show();
                      }
                  },
                    {
                        id: 'donate_charity',
                        name: 'Slider',
                        type: 'flat',
                        hidden: true,
                        min: 0,
                        max: 100,
                        panel: false,
                        initialValue: 0,
                        requiredChoice: true,
                        displayNoChange: false,
                        mainText: '<span style="font-weight: normal;color:gray;">Q20</span> Assume you won 1 lakh Indian rupees (1,00,000 INR) in a lottery. Considering your current situation, how much would you donate to a good cause?',
                        //hint: '<b>Please move the slider to your preferred contribution amount.</b> <br> <span style="font-size:12px;"> Your contribution will be given to the initiative of your choice by the researchers at Heidelberg University. The rest will go to you.',
                        texts: {
                            currentValue: function(widget, value) {
                                if (value === 100) {
                                    return '<span style=\'font-size:20px;\'>You would donate: <b>1,00,000 INR</b> to a good cause.</span>';
                                }
                                else {
                                return '<span style=\'font-size:20px;\'>You would donate: <b>' + value + ',000 INR</b> to a good cause.</span>';
                            }
                            }
                        },
                    },
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////7
    // POLITICAL orientation
    stager.extendStep('Part3_Politics', {
        name: "Part 3: Your opinion",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'politics',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                    {
                        id: 'political_orientation',
                        orientation: 'V',
                        mainText: '<span style="font-weight: normal;color:gray;">Q21</span>  If an election was held today, which political party would you vote for?</u>',
                        choices: ['Bharatiya Janata Party (BJP)',
                                  'Indian National Congress (INC)',
                                  'All India Trinamool Congress (AITC)',
                                  'Communist Party of India (Marxist) (CPI(M))',
                                  'Nationalist Congress Party (NCP)',
                                  'Bahujan Samaj Party (BSP)',
                                  'Communist Party of India (CPI)',
                                  "National People's Party (NPP)",
                                  'Other',
                                  'I would not vote',
                                  'Prefer not to say'
                                ],
                        requiredChoice: true,
                    },
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
                minChars: 5,
                requiredChoice: true,
                showSubmit: false,
                mainText: 'Thank you for participating. ' +
                '<br><br>' +
                "If you want to get in touch with us for questions or suggestions, " +
                "please write us an email at <em><span style='color:#bf2b42'>academic.research.India@gmail.com</span></em>." +
                '<br><br>' +
                'We are very interested in ' +
                'hearing your <strong>feedback</strong> about the ' +
                'following points:<br/><br/><em><ol>' +
                '<li>Was the survey too long or too short?</li>' +
                '<li>Did you find any question unclear or ' +
                'uncomfortable?</li>' +
                '<li>Did you experience any technical difficulty?</li>' +
                '<li>Did the map of your state loaded correctly?</li>' +
                '<li>How can we improve the study?</li></ol>'
            }
        }
    });

    /////////////////////////////////////////////////////////////////////////////
    // DISCLAIMER
    /////////////////////////////////////////////////////////////////////////////
    // Disclaimer protection measures
    stager.extendStep('Disclaimer', {
        name: 'Disclaimer',
        frame: 'leaflet_protection.htm'
    });

    // Disclaimer Income
        stager.extendStep('Disclaimer_income_high', {
            name: "Disclaimer",
            frame: 'Income_correction_disclaimer.htm',
            donebutton: false,
            cb: function() {
                W.cssRule('table.choicetable td { text-align: center !important; ' +
                'font-weight: normal; padding-left: 10px; }');

                node.get('incomeDecileHigh', function(data) {
                    console.log(data);

                    var income = data.income;
                    var incomeGroup = income.substr("Group ".length);
                    var incomeG = parseInt(incomeGroup, 10);
                    console.log(incomeG);

                    var guess = data.income_guess;
                    var guessGroup = guess.substr("Group ".length);
                    var guessG = parseInt(guessGroup, 10);
                    console.log(guessG);

                    var decile_number = data.row.decile_number;
                    console.log(decile_number);

                    W.show('data', 'flex');

                    var evaluation;

                    if (guessGroup === incomeGroup) {
                        evaluation = 'correct';
                        W.setInnerHTML('guess', guessGroup);
                        W.setInnerHTML('evaluation', evaluation);
                        W.setInnerHTML('group', income);
                        W.gid('img').src = 'Leaflet_images/' + income + '.png';
                        W.gid('is_correct').src = 'correct.png';
                    }
                    else {
                        W.gid('is_correct').src = 'incorrect.png';
                        if (decile_number === 10) {
                            evaluation = 'incorrect';
                            W.setInnerHTML('guess', guessGroup);
                            W.setInnerHTML('evaluation', evaluation);
                            W.setInnerHTML('group', income);
                            W.gid('img').src = 'Leaflet_images/' + income + '.png';
                        }
                        else if (decile_number === 9) {
                            if (guessG !== incomeG && guessG < 3 && incomeG < 3) {
                                evaluation = 'correct';
                                W.setInnerHTML('guess', guessGroup);
                                W.setInnerHTML('evaluation', evaluation);
                                W.setInnerHTML('group', guess);
                                W.gid('img').src = 'Leaflet_images/' + guess + '.png';
                            }
                            else {
                                evaluation = 'incorrect';
                                W.setInnerHTML('guess', guessGroup);
                                W.setInnerHTML('evaluation', evaluation);
                                W.setInnerHTML('group', income);
                                W.gid('img').src = 'Leaflet_images/' + income + '.png';
                            }
                        }
                        else if (decile_number === 8) {
                            if (guessG !== incomeG && guessG < 4 && incomeG < 4) {
                                evaluation = 'correct';
                                W.setInnerHTML('guess', guessGroup);
                                W.setInnerHTML('evaluation', evaluation);
                                W.setInnerHTML('group', guess);
                                W.gid('img').src = 'Leaflet_images/' + guess + '.png';
                            }
                            else {
                                evaluation = 'incorrect';
                                W.setInnerHTML('guess', guessGroup);
                                W.setInnerHTML('evaluation', evaluation);
                                W.setInnerHTML('group', income);
                                W.gid('img').src = 'Leaflet_images/' + income + '.png';
                            }
                        }
                    }
                    node.game.doneButton.enable();
                });
            }
        });


        // Disclaimer Income
            stager.extendStep('Disclaimer_income_low', {
                name: "Disclaimer",
                frame: 'Income_correction_disclaimer.htm',
                donebutton: false,
                cb: function() {
                    W.cssRule('table.choicetable td { text-align: center !important; ' +
                    'font-weight: normal; padding-left: 10px; }');

                    node.get('incomeDecileLow', function(data) {
                        console.log(data);

                        var income = data.income;
                        var incomeGroup = income.substr("Group ".length);
                        var incomeG = parseInt(incomeGroup, 10);
                        console.log(incomeG);

                        var guess = data.income_guess;
                        var guessGroup = guess.substr("Group ".length);
                        var guessG = parseInt(guessGroup, 10);
                        console.log(guessG);

                        var decile_number = data.row.decile_number;
                        console.log(decile_number);

                        W.show('data', 'flex');

                        var evaluation;

                        if (guessGroup === incomeGroup) {
                            evaluation = 'correct';
                            W.setInnerHTML('guess', guessGroup);
                            W.setInnerHTML('evaluation', evaluation);
                            W.setInnerHTML('group', income);
                            W.gid('img').src = 'Leaflet_images/' + income + '.png';
                            //W.gid('is_correct').src = 'correct.png';
                        }
                        else {
                            //W.gid('is_correct').src = 'incorrect.png';
                            if (decile_number === 10) {
                                evaluation = 'incorrect';
                                W.setInnerHTML('guess', guessGroup);
                                W.setInnerHTML('evaluation', evaluation);
                                W.setInnerHTML('group', income);
                                W.gid('img').src = 'Leaflet_images/' + income + '.png';
                            }
                            else if (decile_number === 9) {
                                if (guessG !== incomeG && guessG < 3 && incomeG < 3) {
                                    evaluation = 'correct';
                                    W.setInnerHTML('guess', guessGroup);
                                    W.setInnerHTML('evaluation', evaluation);
                                    W.setInnerHTML('group', guess);
                                    W.gid('img').src = 'Leaflet_images/' + guess + '.png';
                                }
                                else {
                                    evaluation = 'incorrect';
                                    W.setInnerHTML('guess', guessGroup);
                                    W.setInnerHTML('evaluation', evaluation);
                                    W.setInnerHTML('group', income);
                                    W.gid('img').src = 'Leaflet_images/' + income + '.png';
                                }
                            }
                            else if (decile_number === 8) {
                                if (guessG !== incomeG && guessG < 4 && incomeG < 4) {
                                    evaluation = 'correct';
                                    W.setInnerHTML('guess', guessGroup);
                                    W.setInnerHTML('evaluation', evaluation);
                                    W.setInnerHTML('group', guess);
                                    W.gid('img').src = 'Leaflet_images/' + guess + '.png';
                                }
                                else {
                                    evaluation = 'incorrect';
                                    W.setInnerHTML('guess', guessGroup);
                                    W.setInnerHTML('evaluation', evaluation);
                                    W.setInnerHTML('group', income);
                                    W.gid('img').src = 'Leaflet_images/' + income + '.png';
                                }
                            }
                        }
                        node.game.doneButton.enable();
                    });
                }
            });

    //////////////////////////////////////////////////////////////////////////////
    // END OF SURVEY
    //////////////////////////////////////////////////////////////////////////////
    stager.extendStep('end', {
        widget: {
            name: 'EndScreen',
            options: {
                feedback: false,
                showEmailForm: false
            }
        },
        init: function() {
            node.game.doneButton.destroy();
            node.say('end');
        }
    });
};
