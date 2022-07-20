import "../../typedefs/typedefs.js";
import LoopLevel from "./loopLevel.js";

/** 
 * Level where computer chooses the number of loops
 * @class
 */
 export default class ComputerLoopLevel extends LoopLevel{

    numbers = [0, 2, 4];

    constructor(){
        super('ComputerLoopLevel');
    }

    create({automata, word, language}){
        super.create({automata, word, language});
        
        this.runTests = false;

        this.levelObjects.repeats.visible = false;

        this.textObjects.compute.on('pointerup', () => {
            if (!this.runTests) {
                this.tests = this.getNextTest();
                this.levelObjects.repeats.visible = true;
                this.runTests = true;
            }
        });
    }

    update(){
        super.update();
        if (this.runTests && !this.computing){
            this.performTest()
        }
    }


    *getNextTest(){
        for (let i = 0; i < this.numbers.length; i++){
            yield this.numbers[i];
        }
    }

    /** Pulls a number from generator, then starts computation with that part of word repeated*/
    performTest(){
        
        const test = this.tests.next();

        // All tests have been run, reset
        if (test.done){
            this.runTests = false;
            this.levelObjects.repeats.num = 1;
            this.selectedWord = this.addSections(1);
            this.levelObjects.repeats.visible = false;
            return;
        }


        this.levelObjects.repeats.num = test.value;
        this.selectedWord = this.addSections(test.value);
        this.startComputation();
    }
 }