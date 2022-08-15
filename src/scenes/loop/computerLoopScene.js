import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import LoopLevel from "./baseLoopScene.js";
import popUp from "../../objects/components/popUp.js";
import { changeBackground } from "/src/utils/utils.js";
import textBox from "/src/objects/components/textBox.js";

/** 
 * Level where computer chooses the number of loops
 * @class
 */
 export default class ComputerLoopLevel extends LoopLevel{

    constructor(){
        super('ComputerLoopLevel');
    }

    create({automata, word, language, repeats, lines}){

        super.create({automata, word, language, repeats});
        
        // Flags
        this.runTests = false;
        this.testsStarted = false;
        
        this.lines = lines; // String to display in popUp (null if not defined);
        this.repeats = repeats; 
        
        this.nextTest = undefined;
        this.tests = undefined;
    }

    update(){
        super.update();
        if (this.runTests && !this.computing){
            this.performTest()
        } else if (this.passedTests){
            this.passedTests = false;
            this.startEnd();
        }
    }

    addElements(){
        
        

        if (this.lines) {
            
            popUp(["Drag the bars to select a part of the word corresponding to a loop in the automaton", "Click the arrows under the number to try repeating or removing your selection", "Then click play when ready to test your selection!"], this, true);
            
            this.help = this.add.text(25, 25, "?", {color: colours.TEXTWHITE, fontSize: '30px', fontFamily: 'Quantico'})
            .setOrigin(0.5).setInteractive().on('pointerup', () => {
                textBox(this, this.lines);
            });
            this.help.on('pointerover', () => {
                this.help.setColor(colours.TEXTRED)
            });
            this.help.on('pointerout', () => {
                this.help.setColor(colours.TEXTWHITE)
            });
        } else {
            popUp(["Drag the bars to select a part of the word corresponding to a loop in the automaton"], this, true)
        }
        super.addElements();
    }

    addUI(){
        this.help.setVisible(true)
    }


    *testGenerator(repeats){
        for (let i = 0; i < repeats.length; i++){
            yield repeats[i];
        }
    }

    /** Pulls a number from generator, then starts computation with that part of word repeated*/
    performTest(){
        const test = this.nextTest;
        this.numRepeats = test.value;
        this.UIElements.repeats.text = test.value;
        
        this.selectedWord = this.addSections(test.value);
        this.computing = true;

        this.time.delayedCall(1000, this.startComputation, [], this);
        this.nextTest = this.tests.next(); 
        
        if (this.nextTest.done){
            this.runTests = false;
        }
    }

    startEnd(){
        this.numRepeats = 1;
        this.selectedWord = "";
        this.end = true;
        popUp(["Pumping Succeeded!"], this)
        this.time.delayedCall(2000, this.endingScreen, [], this)
    }

    endingScreen(){
        this.scene.start('LevelSelect', {passed: true})
    }

    /** Called when play button is pressed. */
    pressPlay(){
        
        if (this.finishedAddingWord && this.decomposeWord()[1] !== ""){
            
            if (this.loopLength > Object.keys(this.automata.states).length){
                const message = `The loop must be within the first ${Object.keys(this.automata.states).length} letters`
                popUp([message], this, true);
            } else {
                changeBackground(this);
                
                this.UIElements.increase.visible = false;
                this.UIElements.decrease.visible = false;
                
                this.automata.stopComputation();
                
                // Reset tests
                this.tests = this.testGenerator(this.repeats);
                this.nextTest = this.tests.next(); 

                // Flag to start running tests
                this.runTests = true;
                this.testsStarted = true;
            }
    
            
        }
    }

 }