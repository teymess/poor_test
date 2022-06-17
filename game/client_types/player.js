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
        name: "Brief Survey",
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
        name: "Brief Survey",
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
        name: "Brief Survey",
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


    ////////////////////////////////////////////////////
    // TREATMENT: Income low
    //////////////////////////////////////
    stager.extendStep('Part3_T_Income_Low', {
        name: "Brief Survey",
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
                          'the 10 groups, ordered from left to right from the 10% with the lowest income '+
                          'to the 10% with the highest income.' +
                '</span><br><br><img src="https://i.ibb.co/CBgw21N/deciles-clean-alt.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_anchor_low',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of a household living ' +
                                  'in your state. The <u>monthly value of consumption</u> (food, clothing, medicine) for each person ' +
                                  'in this households is <u>500 INR</u>.<br>'+
                                  '<span style="font-weight: normal;"> This includes:<br> '+
                                  '- the value of all products bought with cash<br>' +
                                  '- the value of all products that are produced and then consumed by oneself<br>' +
                                  '- the value of all products that are received as transfers or presents from friends or relatives.</span><br><br>' +
                                  'In your opinion, which income group is this household part of?',
                        hint: '<br>Remember, there are the same number of households in each of the ten groups!',
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
                        hint: 'Remember, there are the same number of households in each of the ten groups!',
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

    ////////////////////////////////////////////////////
    // TREATMENT: Control Income
    //////////////////////////////////////
    stager.extendStep('Part3_T_Income_Control', {
        name: "Brief Survey",
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
                          'the 10 groups, ordered from left to right from the 10% with the lowest income '+
                          'to the 10% with the highest income.' +
                '</span><br><br><img src="https://i.ibb.co/CBgw21N/deciles-clean-alt.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                forms: [
                    {
                        id: 'perceived_income_own',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of <span style="color:red;">YOUR</span> household. ' +
                                  'In your opinion, which income group is your household part of?',
                        hint: 'Remember, there are the same number of households in each of the ten groups!',
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

    stager.extendStep('Extra_Question', {
        name: "Brief Survey",
        frame: 'income_page.htm',
        donebutton: false,
        cb: function() {


            node.get('districtData', function(data) {

            node.game.IncomeQuestions = node.widgets.append('ChoiceManager', "incomePage", {
                id: 'q4',
                className: 'centered',
                // ref: 'controlQuestions',
                mainText: '</span><br><br><img src="https://i.ibb.co/CBgw21N/deciles-clean-alt.png" alt="Indian-groups" border="0" width="800px"></a><br><br>',
                simplify: true,
                forms: [
                    {
                        id: 'income_group10',
                        orientation: 'H',
                        mainText: '<span style="font-weight: normal;color:gray;">Q8</span> In your opinion, ' +
                        'what is the minimum annual income that a household needs to be in income Group 10?',
                        choices: function() {
                          return [
                                ['Group 7', 'Less than ' + (data.pct70) + ' INR'],
                                ['Group 8', 'Between ' + (data.pct70) + ' INR and ' + (data.pct80) + ' INR'],
                                ['Group 9', 'Between ' + (data.pct80) + ' INR and ' + (data.pct90) + ' INR'],
                                ['Group 10', 'Between ' + (data.pct90) + ' INR and ' + (data.pct92) + ' INR'],
                                ['Group 11', 'Between ' + (data.pct92) + ' INR and ' + (data.pct94) + ' INR'],
                                ['Group 12', 'More than ' + (data.pct94) + ' INR']
                            ]
                        },
                        shuffleChoices: false,
                        requiredChoice: true,
                        choicesSetSize: 2
                    },
                    {
                      id: 'consumption_group1',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q8</span> In your opinion, ' +
                      'what is the <u>monthly value of consumption</u> (food, clothing, medicine) of one person that lives in a household that belongs to <u>Group 1</u>?<br>' +
                      '<span style="font-weight: normal;"> This includes:<br> '+
                      '- the value of all products bought with cash<br>' +
                      '- the value of all products that are produced and then consumed by oneself<br>' +
                      '- the value of all products that are received as transfers or presents from friends or relatives.</span>',
                      choices: function() {
                        return [
                              ['1', 'Less than 200 INR'],
                              ['2', 'Between 200 INR and 400 INR'],
                              ['3', 'Between 400 INR and 600 INR'],
                              ['4', 'Between 600 INR and 800 INR'],
                              ['5', 'Between 800 INR and 1,000 INR'],
                              ['6', 'More than 1,000 INR']
                          ]
                      },
                      shuffleChoices: false,
                      requiredChoice: true,
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
