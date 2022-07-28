import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import LoopLevel from "./baseLoopScene.js";

/** 
 * Level where computer chooses the number of loops
 * @class
 */
 export default class ComputerLoopLevel extends LoopLevel{

    numbers = [2];

    constructor(){
        super('ComputerLoopLevel');
    }

    create({automata, word, language, repeats}){
        super.create({automata, word, language, repeats});
        
        this.runTests = false;
        this.tests = this.getNextTest();
        this.nextTest = this.tests.next(); 

        this.levelObjects.repeats.visible = false;

        this.textObjects.compute.on('pointerup', () => {
            if (!this.runTests) {
                this.levelObjects.repeats.visible = true;
                this.runTests = true;
            }
        });
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


    *getNextTest(){
        for (let i = 0; i < this.numbers.length; i++){
            yield this.numbers[i];
        }
    }

    /** Pulls a number from generator, then starts computation with that part of word repeated*/
    performTest(){
        
        const test = this.nextTest;


        this.levelObjects.repeats.num = test.value;
        this.levelObjects.repeats.text = test.value;
        this.selectedWord = this.addSections(test.value);
        this.startComputation();
       
        this.nextTest = this.tests.next(); 
        
        if (this.nextTest.done){
            this.runTests = false;
        }
    }

    startEnd(){
        this.levelObjects.repeats.num = 1;
        this.selectedWord = "";
        this.end = true;
        this.levelObjects.repeats.visible = false;
        this.time.delayedCall(1000, this.endingScreen, [], this)
    }

    endingScreen(){
        this.add.rectangle(0, 0, 800, 500, colours.BLACK, 0.8).setOrigin(0);
        this.scene.pause();
        this.scene.run('LevelEnd', {prevScene:'ComputerLoopLevel'})
        
    }

 }