import Level from "./levelTemplate.js";
import "/src/typedefs/typedefs.js";
import colours from "/src/utils/colours.js";
import { calculateStartingX } from "/src/utils/utils.js";
import lowerUIBox from "/src/objects/components/lowerUIBox.js";
import testAutomataUI from "/src/objects/components/testAutomataUI.js";

export default class TestCreateLevel extends Level {

    // Default value - startingX should be overridden for each word to ensure they are centred.
    startingX = 300;
    textY = 435;

    constructor(){
        super('TestCreateLevel');
    }

    create({automata, words, language}){
        super.create(automata, language);
        
        //Flags
        this.runTests = true;
        this.drawingLetters = false;
        this.passedTests = false;


        this.levelObjects = {letters: [], computedLetters: []}
        this.inputWords = words
        this.tests = this.wordGenerator(words)
        this.test = this.tests.next();
        this.word = this.test.value.word;

        this.UI = testAutomataUI(this).layout();
    }

    update(){
        if (!this.drawingLetters && !this.computing && this.runTests){
            this.performTest();
        } else if (this.passedTests){
            this.time.delayedCall(1000, this.endingScreen, [], this)
        }
    }

    *wordGenerator(words){
        for (let i = 0; i < words.length; i++){
            yield words[i];
        }
    }

    /** Pulls a number from generator, then starts computation with that part of word repeated*/
    performTest(){
        
        this.prevTest = this.test.value
        this.word = this.prevTest.word
        
        this.computing = true;
        this.removeLetters();
        const icon = this.UI.getElement('left').getElement('label').getElement('icon');

        this.prevTest.result ? icon.setFillStyle(colours.GREEN) : icon.setFillStyle(colours.RED)

        this.startDrawingLetters();

        this.test = this.tests.next(); 
        
        if (this.test.done){
            this.runTests = false;
        }
    }

    /**
     * Recursively render the letters of the word on screen, one at a time
     * @param {number} i - Index of letter to draw
     */
    drawLetters(i){
    
        // Base case 
        if (i === this.word.length){
            
            this.textX = this.levelObjects.letters.at(-1).getTopLeft().x;
            this.drawingLetters = false;
            this.time.delayedCall(400, this.startComputation, [], this);
            return;
        } 

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.word[i], { fontSize: '50px', color: colours.BLACK }))
        this.time.delayedCall(400, this.drawLetters, [i+1], this);
    }

    startDrawingLetters(){
        this.drawingLetters = true;
        this.startingX = calculateStartingX(this.word)+20;
        this.drawLetters(0);
    }

    /** Draws the word as it is being computed */
    drawComputedWord(){
        
        // Remove current letters
        this.levelObjects.computedLetters.forEach((letter) => {
            letter.destroy();
        });
        this.levelObjects.computedLetters = [];
        
        for (let i = 0; i < this.word.length; i++){
    
            // Count backwards through letters
            let place = this.word.length - 1 - i
            this.levelObjects.computedLetters.unshift(this.add.text(this.textX-(i*20), this.textY+50, this.word[place], { fontSize: '20px', color: '#ffffff' }))
        }
    }

    /**
     * Calls Level End Screen
     */
    endingScreen(){
        this.add.rectangle(0, 0, 800, 500, colours.BLACK, 0.8).setOrigin(0);
        this.scene.pause('TestCreateLevel');
        this.scene.run('LevelEnd', {prevScene:'TestCreateLevel'});
    }

    endComputation(accepted){
        
        super.endComputation();

        // If final test was accepted
        if ((this.prevTest.result === accepted) && !this.runTests){
            this.passedTests = true;
        
        // Stop tests if one is failed
        } else if (this.prevTest.result !== accepted){
            this.runTests = false;
        }

    }

    /**
     * Removes drawn letters
     */
    removeLetters(){
        // Remove current letters
        this.levelObjects.letters.forEach((letter) => {
            letter.destroy();
        });
    }

}