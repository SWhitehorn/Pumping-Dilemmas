import Level from "./levelTemplate.js";
import "/src/typedefs/typedefs.js";
import colours from "/src/utils/colours.js";
import { calculateStartingX } from "/src/utils/utils.js";
import lowerUIBox from "/src/objects/components/lowerUIBox.js";
import testAutomataUI from "/src/objects/components/testAutomataUI.js";
import popUp from "/src/objects/components/popUp.js";
import { changeBackground, resetBackground } from "/src/utils/utils.js";
import textBox from "/src/objects/components/textBox.js";

export default class TestCreateLevel extends Level {

    // Default value - startingX should be overridden for each word to ensure they are centred.
    startingX = 300;
    textY = 435;

    constructor(key){
        
        if (key){
            super(key)
        } else {
            super('TestCreateLevel');
        }
    }

    create({automata, words, alphabet, language, message=null, deterministic, loop=false}){
        
        changeBackground(this);

        super.create(automata, language);
        
        //Flags
        this.runTests = true;
        this.drawingLetters = false;
        this.passedTests = false;
        this.end = false;
        this.firstTest = true; // Set to false after first test
        this.loop = loop;

        this.letterDelay = 300;

        this.levelObjects = {letters: [], computedLetters: []}
        this.inputWords = words;

        this.tests = this.wordGenerator(words)
        this.test = this.tests.next();
        this.word = this.test.value.word;

        this.alphabet = alphabet;
        this.language = language;
        this.message = message;
        this.deterministic = deterministic;

        

        this.UI = testAutomataUI(this).layout();
        this.speedUp = this.UI.getElement('right').getElement('label').getElement('text');
        this.speedUp.selected = false;
    
        this.speedUp.setInteractive().on('pointerup', () => {
            this.automata.changeComputationSpeed();
            this.changeDrawingSpeed();
            
            if (this.speedUp.selected){
                this.speedUp.setColor(colours.TEXTWHITE);
            } else {
                this.speedUp.setColor(colours.TEXTRED);
            }

            this.speedUp.selected = !this.speedUp.selected;
        });

        this.speedUp.on('pointerover', () => {
            this.speedUp.setColor(colours.TEXTRED);
        });

        this.speedUp.on('pointerout', () => {
            if (!this.speedUp.selected){
                this.speedUp.setColor(colours.TEXTWHITE)
            }
        });
        
    }

    update(){
        if (!this.drawingLetters && !this.computing && this.runTests){
            this.performTest();
        } else if (!this.drawingLetters && !this.computing && !this.end){
            this.end = true;
            this.endingScreen();
        }
    }

    /**
     * 
     * @param {Object[]} words - List of word and result pairs
     */
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

        this.time.delayedCall(500, this.startDrawingLetters, [], this);

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
            if (this.firstTest && this.message){
                this.firstTest = false;
                this.time.delayedCall(500, this.displayMessage, [], this);
            } else {
                this.time.delayedCall(this.computationDelay, this.startComputation, [], this);
            }
            
            return;
        } 

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.word[i], { fontSize: '50px', color: colours.BLACK, fontFamily: 'Quantico'}))
        this.time.delayedCall(this.letterDelay, this.drawLetters, [i+1], this);
    }

    displayMessage(){
        textBox(this, this.message, 100);
    }

    textBoxCallback(){
        this.time.delayedCall(500, this.startComputation, [], this);
    }

    startDrawingLetters(){
        this.drawingLetters = true;
        this.startingX = calculateStartingX(this.word);
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
        
        if (this.passedTests){
            
            if (this.loop){
                this.startLoop(this.word)
            } else {
                popUp(["All words correct!"], this)
                this.time.delayedCall(2000, this.nextLevel, [true], this)
            }
            
        } else {
            const message = '"' + this.word + '"' + " classified incorrectly"
            popUp([message, "Try a different automata!"], this)
            this.time.delayedCall(3500, this.nextLevel, [false], this)
        }
    }

    nextLevel(passed){
        resetBackground(this);
        if (passed){
            this.scene.stop('CreateLevel');
            this.scene.start("LevelSelect", {passed:true})
        } else {
            this.scene.start('CreateLevel', {
                inputAutomata:this.automata, 
                words:this.inputWords, 
                alphabet:this.alphabet, 
                language:this.language,
                deterministic: this.deterministic
            });
        }
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

    changeDrawingSpeed(){
        if (this.letterDelay === 300){
            this.letterDelay = 150;
        } else {
            this.letterDelay = 300;
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

    /** Moves to loop level with current word */
    startLoop(word){
        this.scene.stop('CreateLevel');
        this.scene.start("ComputerLoopLevel", {
            automata: this.automata,
            word: word,
            language: this.language, 
        })
    }

}