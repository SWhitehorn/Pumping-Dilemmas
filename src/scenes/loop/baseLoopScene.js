import Level from "../levelTemplate.js";
import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import { calculateStartingX } from "/src/utils/utils.js"
import loopSelectBox from "/src/objects/components/loopSelectBox.js";

/**
 * @typedef {Object} Input
 * @property {Automata} automata - Input automata
 * @property {string} word - Input word
 * @property {string} language - Definition of language of level
 */

/**
 * First Level 
 * @class
 */
export default class LoopLevel extends Level {

    startingX = 300;
    textY = 425;
    

    constructor(key){
        if (key){
            super(key);
        } else {
            super('LoopLevel')
        }
    }

    /**
     * Create level, initialising level objects and flags
     * @param {Input}
     */
    create({automata, word, language, repeats}){
        
        // Level template handles drawing automaton
        super.create(automata, language);
        
        // letters: array of text objects, unchanging
        // computedLetters: array of text objects, changes with player selection
        this.levelObjects = {letters: [], computedLetters: []}
        
        //Flags
        this.interactive = false;
        this.repeat = true;
        this.end = false;
        this.finishedAddingWord = false;
        this.passedTests = false;

        this.numRepeats = 1

        // Set words
        this.inputWord = word // Original value of input word
        this.word = word; // Word that computation is performed on
       
        const box = loopSelectBox(this, this.numRepeats);
        this.UIElements = {
            box: box, 
            repeats: box.getElement('left').getElement('label').getElement('text'), 
            play: box.getElement('right').getElement('label').getElement('icon') 
        };
        this.UIElements.play.visible = false;


        // Add letters individually
        this.startingX = calculateStartingX(this.word);
        this.drawLetters(0);
    } 

    /** Called every frame to update game objects */
    update(){
        
        if (this.finishedAddingWord){
            this.updateBox();
            this.selectedWord = this.addSections(this.numRepeats);
            
            if (!this.end){
                this.drawSelectedWord();
            }
        }    
    }

    /**
     * Returns true is letter is contained in slider
     * @param {Object} letter - Phaser text
     * @param {Object} slider - Phaser rectangle
     */
    isContained(letter, slider){
        const sliderRect = slider.getBounds();
        const letterRect = letter.getBounds();

        return (sliderRect.x <= letterRect.x+letterRect.width/3 && sliderRect.x+sliderRect.width >= letterRect.x+letterRect.width/1.5)
    }

    /**
     * Update window to match where the sliders are.
     * @param {number} extend - Option to extend slider based on section repeats
     */
    updateBox(extend = 1){
        const origin = this.levelObjects.leftBar.getTopLeft();
        
        const width = (this.levelObjects.rightBar.getTopRight().x - origin.x) * extend; 
        
        this.levelObjects.slider.setX(origin.x - (width/2 * (extend-1) ) );
        
        this.levelObjects.slider.displayWidth = width;

        const point = this.levelObjects.rightBar.getTopLeft();
    }

    /**
     * Calls super method, then draws letters. Extends levelTemplate method
     */
    computation(){
        this.automata.computation();
        this.drawComputedWord();
    }

    /**
     * Called to start the computation, extends levelTemplate method
     */
    startComputation(){
        this.word = this.selectedWord;
        super.startComputation();
    }
    
    /**
     * Called to end the computation, extends levelTemplate method
     * @param {boolean} accepted - Indicates whether computation ended in accepting state
     */
    endComputation(accepted){
        this.word = this.selectedWord;

        if (!accepted){
            this.time.delayedCall(500, this.automata.clearStates, [], this.automata)
            let toast = this.rexUI.add.toast({
                x:400, 
                y:300, 
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, colours.WHITE),
                text: this.add.text(0,0, "", {fontSize: "24px", color: colours.DARKBLUE}),
                space: {left: 20, right: 20, top: 20, bottom: 20}
            })
            .showMessage("Not accepted!")
            .showMessage("Try a different selection");
            
            this.runTests = false;
            this.numRepeats = 1;
            this.UIElements.repeats.text = this.numRepeats;
            this.time.delayedCall(2000, this.startComputation, [], this); 

        } else if (accepted && !this.runTests && this.testsStarted){
            console.log('good');
            this.time.delayedCall(500, this.automata.clearStates, [], this.automata)
            this.passedTests = true;
        } else {
            super.endComputation();
        }
    }

    /**
     * Recursively render the letters of the word on screen, one at a time
     * @param {number} i - Index of letter to draw
     */
    drawLetters(i){

        // Base case 
        if (i === this.inputWord.length){
            
            this.textX = this.levelObjects.letters.at(-1).getTopRight().x;
            this.addSlidingWindow();
            this.finishedAddingWord = true;
            this.UIElements.play.visible = true;
            this.selectedWord = this.addSections(this.numRepeats);
            this.startComputation();
            return;
        }

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.inputWord[i], { fontSize: '50px', color: colours.TEXTBLACK }))
        this.time.delayedCall(400, this.drawLetters, [i+1], this);
    }

    /** Draws the word as it is being computed */
    drawComputedWord(){
        // Remove current letters
        this.levelObjects.computedLetters.forEach((letter) => {
            letter.destroy();
        })
        this.levelObjects.computedLetters = [];
        
        for (let i = 0; i < this.word.length; i++){
    
            // Count backwards through letters
            let place = this.word.length - 1 - i
            this.levelObjects.computedLetters.unshift(this.add.text(this.textX-(i*20), this.textY+50, this.word[place], { fontSize: '20px', color: colours.TEXTBLACK }))
        }
    }

    /** Draws the word the player has selected */
    drawSelectedWord(){
        // Remove current letters
        this.levelObjects.computedLetters.forEach((letter) => {
            letter.destroy();
        });
        
        this.levelObjects.computedLetters = [];

        for (let i = 0; i < this.selectedWord.length; i++){
            
            this.levelObjects.computedLetters.push(
                this.add.text(calculateStartingX(this.selectedWord, true) + i*18, this.textY+55, this.selectedWord[i], { fontSize: '20px', color: colours.TEXTBLACK })
            );
        }
    }

    /**
     * Repeats selected part of word according to number of repeats and checks text is selected
     * @param {number} numRepeats - number of times the selection of word is repeated 
     * @returns {String} String with repeated sections
     */
    addSections(numRepeats){
            
            const wordParts = this.decomposeWord(); 

            // Check that selected section is not empty
            if (wordParts[1] === ""){
                this.UIElements.play.visible = false;
            } else {
                this.UIElements.play.visible = true;
            }

            return wordParts[0] + wordParts[1].repeat(numRepeats) + wordParts[2];
    }

    /**
     * Split word into three strings, depending on player's selection, and colours graphic appropriately.
     * @returns {string[]} String with three parts of word 
     */
     decomposeWord(){
        let before = true;

        let stringBefore = "" // Before current selection
        let stringAfter = "" // After current selection
        let selected = "" // Current selection
        
         for (let letter of this.levelObjects.letters){
            
            // Letter is selected
            if (this.isContained(letter, this.levelObjects.slider)){
                letter.setColor(colours.TEXTRED);
                selected = selected.concat(letter.text)
                before = false;

            // Letter is not selected
            } else {
                letter.setColor(colours.TEXTBLACK);
                if (before){
                    stringBefore += letter.text;

                } else {
                    stringAfter += letter.text;
                }
            }
        } 

        //this.textObjects.selected.text = "Selected: " + selected;
        return [stringBefore, selected, stringAfter];
    }

    /** Adds the window for the player to drag */
    addSlidingWindow(){
        const alpha = 0.5;

        // Add left bar
        const leftTop = this.levelObjects.letters[0].getTopLeft();
        this.levelObjects.leftBar = this.add.rexRoundRectangle(leftTop.x-20, leftTop.y-4, 10, 50, 
            {
                tl: 8, bl: 8
            }, colours.DARKBLUE).setOrigin(0).setInteractive();
        
        // Add right bar
        const rightTop = this.levelObjects.letters.at(-1).getTopRight();
        this.levelObjects.rightBar = this.add.rexRoundRectangle(rightTop.x+10, rightTop.y-4, 10, 50, 
            {
                tr: 8, br: 8
            }, colours.DARKBLUE).setOrigin(0).setInteractive();

        const letterBounds = this.levelObjects.letters[0].getBounds();

        // Enabling dragging on bars
        this.input.setDraggable(this.levelObjects.leftBar);
        this.input.setDraggable(this.levelObjects.rightBar);
        const rightBound = this.textX + 10
        this.input.on('drag', function(pointer, line, dragX, dragY){
            
            // Set bounds for dragging
            if (dragX >= letterBounds.x -20 && dragX <= rightBound){
                line.x = dragX;
            }
        })
        this.drawBox();
    }

    /**
     * Draw sliding window
     */
     drawBox(){
        const origin = this.levelObjects.leftBar.getTopLeft();
        const width = this.levelObjects.rightBar.getTopRight().x - origin.x;
        const height = this.levelObjects.leftBar.getBottomLeft().y - origin.y; 
        this.levelObjects.slider = this.add.rexRoundRectangle(origin.x, origin.y, width, height, 10)
            .setStrokeStyle(2, colours.DARKBLUE, 1)
            .setOrigin(0);

        // Render letters above box
        for (let letter of this.levelObjects.letters){
            letter.setDepth(1);
        }
    }

    addControlButtons(){
        // Increase button
        this.textObjects.increase = this.add.text(650, 400, "Increase", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        this.textObjects.increase.on('pointerup', () => {
            // Cap at 4
            if (this.numRepeats < 4) {this.numRepeats += 1};
        });
        
        // Decrease button
        this.textObjects.decrease = this.add.text(650, 450, "Decrease", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        this.textObjects.decrease.on('pointerup', () => {
            if (this.numRepeats > 0){ this.numRepeats -= 1; }
        });  
    }
}