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

    stager.extendStep('Part_1_q3', {
        name: "Brief Survey",
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q3',
            options: {
                simplify: true,
                mainText: '',
                forms: [
                  {
                      id: 'education',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q3</span> What is the highest educational level that you have completed?',
                      choices: ['No formal education', 'Below High School', 'High School','Bachelor degree','Masters degree or higher'],
                      shuffleChoices: false,
                      requiredChoice: true
                  },
                  {
                      name: 'CustomInput',
                      id: 'hhsize',
                      mainText: '<span style="font-weight: normal;color:gray;">Q4</span> How many people live in your household?<br>',
                      hint: '(Think about everyone that lives at least eight months per year in your house. Answer should include yourself.)',
                      width: '95%',
                      type: 'int',
                      requiredChoice: true,
                      min: 1
                  },
                  {
                      id: 'income',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q5</span> In 2021, what was the total annual income of your household?<br>' +
                      '<span style="font-weight: normal;"> Please refer to the total income of ALL members living in your household in 2021, ' +
                      'before any taxes or deductions.',
                      choices: [
                        ['Q1', 'Below $27,000'],
                        ['Q2', 'Between $27,000 and $52,000'],
                        ['Q3', 'Between $52,000 and $85,000'],
                        ['Q4', 'Between $85,000 and $140,000'],
                        ['Q5', 'More than $140,000']
                      ],
                      shuffleChoices: false,
                      requiredChoice: true,
                      choicesSetSize: 2
                  }
                ]
            }
        }
    });

    ////////////////////////////////////////////////////
    // TREATMENT: Income low
    //////////////////////////////////////
    stager.extendStep('Comparison_low', {
        name: "Brief Survey",
        frame: 'income_page.htm',
        cb: function() {
            node.game.lowComparison = node.widgets.append('ChoiceManager', "incomePage", {
                id: 'PI_low',
                className: 'centered',
                // ref: 'controlQuestions',
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                          'population living in <b>your state</b> is equally divided into 10 income groups, ' +
                          'each with the same number of households.<br>' +
                          'The figure below illustrates the 10 groups, ordered from left to right from the 10% with the lowest income '+
                          'to the 10% with the highest income.' +
                '</span><br><br><img src="https://i.ibb.co/CBgw21N/deciles-clean-alt.png" alt="Indian-groups" border="0" width="800px"></a><br>' +
                '<span style=\'font-size:14px;\'><i><u>Remember, there are the same number of households in each of the 10 groups!</i></span>',
                simplify: true,
                forms: [
                    {
                      id: 'perceived_income_comparison_low',
                      orientation: 'H',
                      mainText: '<span style="font-weight: normal;color:gray;">Q2</span> Think of a household ' +
                                'in your state where people:<br>' +
                                '<span style="font-weight: normal;"><ul><li>have <b>minimum education</b></li>' +
                                '<li>are long-term <b>unemployed</b></li>' +
                                '<li>live in a <b>small apartment</b> with <b>poor facilities</b></li>' +
                                '<li>live in a <b>bad neighbourhood</b></li></ul></span><br>' +
                                'In your opinion, which income group is this household part of?',
                      hint: '<br>Remember, there are the same number of households in each of the 10 groups!',
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
                                  hint: '<br>Remember, there are the same number of households in each of the 10 groups!',
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
              });
      },
      done: function() {
          return node.game.lowComparison.getValues();
      }
    });


    ////////////////////////////////////////////////////
    // TREATMENT: Income HIGH
    //////////////////////////////////////
    stager.extendStep('Description_high', {
        name: "Brief Survey",
        frame: 'income_page.htm',
        cb: function() {
              node.game.highDescription = node.widgets.append('ChoiceManager', "incomePage", {
                id: 'D_high',
                className: 'centered',
                // ref: 'controlQuestions',
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                          'population living in <b>your state</b> is equally divided into 10 income groups, ' +
                          'each with the same number of households.<br>' +
                          'The figure below illustrates the 10 groups, ordered from left to right from the 10% with the lowest income '+
                          'to the 10% with the highest income.' +
                '</span><br><br><img src="https://i.ibb.co/CBgw21N/deciles-clean-alt.png" alt="Indian-groups" border="0" width="800px"></a><br>' +
                '<span style=\'font-size:14px;\'><i><u>Remember, there are the same number of households in each of the 10 groups!</i></span>',
                simplify: true,
                forms: [
                    {
                      name: 'CustomInput',
                      id: 'group10_description',
                      mainText: '<span style="font-weight: normal;color:gray;">Q9</span> Please describe the characteristics of a household in your state that belongs to <u>Group 10</u> (the top 10% households with the highest income in your state).',
                      hint: '<br>For example, you can describe the household in terms of education, employment, and housing conditions.',
                      width: '95%',
                      min: 5,
                      requiredChoice: true,
                    },
                ]
              });
      },
      done: function() {
        var w, q2;
        w = node.widgets.last;

            // DISPLAY 4.
            q2 = w.formsById.perceived_income_own;
            if (!q2) {
              node.widgets.last.addForm({
                id: 'perceived_income_own',
                orientation: 'H',
                mainText: '<span style="font-weight: normal;color:gray;">Q10</span> Think of <span style="color:red;">YOUR</span> household. ' +
                          'In your opinion, which income group is your household part of?',
                          hint: '<br>Remember, there are the same number of households in each of the 10 groups!',
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
                      });
              return false;
            }
            return w.getValues();
          }
    });


    stager.extendStep('Description_low', {
        name: "Brief Survey",
        frame: 'income_page.htm',
        cb: function() {
              node.game.highDescription = node.widgets.append('ChoiceManager', "incomePage", {
                id: 'D_low',
                className: 'centered',
                // ref: 'controlQuestions',
                mainText: '<span style=\'font-size:18px;font-weight:normal;\'>Assume the entire ' +
                          'population living in <b>your state</b> is equally divided into 10 income groups, ' +
                          'each with the same number of households.<br>' +
                          'The figure below illustrates the 10 groups, ordered from left to right from the 10% with the lowest income '+
                          'to the 10% with the highest income.' +
                '</span><br><br><img src="https://i.ibb.co/CBgw21N/deciles-clean-alt.png" alt="Indian-groups" border="0" width="800px"></a><br>' +
                '<span style=\'font-size:14px;\'><i><u>Remember, there are the same number of households in each of the 10 groups!</i></span>',
                simplify: true,
                forms: [
                    {
                      name: 'CustomInput',
                      id: 'group1_description',
                      mainText: '<span style="font-weight: normal;color:gray;">Q9</span> Please describe the characteristics of a household in your state that belongs to <u>Group 1</u> (the bottom 10% households with the lowest income in your state).',
                      hint: '<br>For example, you can describe the household in terms of education, employment, and housing conditions.',
                      width: '95%',
                      min: 5,
                      requiredChoice: true,
                    },
                ]
              });
      },
      done: function() {
        var w, q2;
        w = node.widgets.last;

            // DISPLAY 4.
            q2 = w.formsById.perceived_income_own;
            if (!q2) {
              node.widgets.last.addForm({
                id: 'perceived_income_own',
                orientation: 'H',
                mainText: '<span style="font-weight: normal;color:gray;">Q10</span> Think of <span style="color:red;">YOUR</span> household. ' +
                          'In your opinion, which income group is your household part of?',
                          hint: '<br>Remember, there are the same number of households in each of the 10 groups!',
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
                      });
              return false;
            }
            return w.getValues();
          }
    });

    //////////////////////////////////////////////////
    //TREATMENT: Control Income
    ////////////////////////////////////
    stager.extendStep('Control', {
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




    stager.extendStep('feedback', {
      widget: {
          name: 'ChoiceManager',
          id: 'feedback',
          options: {
              simplify: true,
              mainText: '',
              forms: [
                  {
                    name: 'Feedback',
                    id: 'feedback1',
                    minChars: 5,
                    requiredChoice: true,
                    showSubmit: false,
                    mainText: 'Thank you for participating. ' +
                        '<br><br>' +
                        'We are very interested in ' +
                        'hearing your <strong>feedback</strong>.' +
                        '<ol><li>Did you find any question unclear or ' +
                        'uncomfortable?</li>' +
                        '<li>Did you experience any technical difficulty?</li></ol>',
                  }
                ]
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
