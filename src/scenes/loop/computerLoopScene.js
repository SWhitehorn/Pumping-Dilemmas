import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import LoopLevel from "./baseLoopScene.js";

/** 
 * Level where computer chooses the number of loops
 * @class
 */
 export default class ComputerLoopLevel extends LoopLevel{

    constructor(){
        super('ComputerLoopLevel');
    }

    create({automata, word, language, repeats}){
        super.create({automata, word, language, repeats});
        
        this.runTests = false;
        this.testsStarted = false;
        
        this.tests = undefined;
        this.nextTest = undefined;
        
        this.UIElements.play.on('pointerup', () => {
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
        let toast = this.rexUI.add.toast({
            x:400, 
            y:300, 
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, colours.WHITE),
            text: this.add.text(0,0, "", {fontSize: "24px", color: colours.DARKBLUE}),
            space: {left: 20, right: 20, top: 20, bottom: 20}
        })
        .showMessage("Pumping suceeded!")
        this.time.delayedCall(2000, this.endingScreen, [], this)
    }

    endingScreen(){
        
        
        
        this.scene.start('LevelSelect', {passed: true})
        
    }

 }