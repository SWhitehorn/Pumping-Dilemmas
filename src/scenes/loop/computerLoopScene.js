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

    create({automata, word, language, repeats, message=null}){

        super.create({automata, word, language, repeats});
        
        // Flags
        this.runTests = false;
        this.testsStarted = false;
        
        this.message = message; // String to display in popUp (null if not defined);
        
        this.tests = undefined;
        this.nextTest = undefined;
        
        this.UIElements.play.on('pointerup', () => {
            changeBackground();
            this.automata.stopComputation();
            this.runTests = true;
            this.testsStarted = true;
            this.tests = this.testGenerator(repeats);
            this.nextTest = this.tests.next(); 
        })
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
        if (this.message) {
            
            popUp(this.message.message, this);
            
            this.help = this.add.text(25, 25, "?", {color: colours.TEXTWHITE, fontSize: '30px', fontFamily: 'Quantico'})
            .setOrigin(0.5).setInteractive().on('pointerup', () => {
                textBox(this, this.message.lines, 200);
            });

            console.log(this.help);
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
        this.startComputation();
       
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

 }