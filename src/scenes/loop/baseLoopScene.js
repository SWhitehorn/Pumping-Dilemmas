import Level from "../levelTemplate.js";
import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import { calculateStartingX, resetBackground } from "/src/utils/utils.js"
import loopSelectBox from "/src/objects/components/loopSelectBox.js";
import popUp from "/src/objects/components/popUp.js";

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
    textY = 420;
    

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
    create({automata, word, language}){
        
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
            repeats: box.getElement('left').getElement('top').getElement('label').getElement('text'), 
            increase: box.getElement('left').getElement('bottom').getElement('increase').getElement('icon'),
            decrease: box.getElement('left').getElement('bottom').getElement('decrease').getElement('icon'), 
            play: box.getElement('right').getElement('label').getElement('icon') 
        };
        
        // Hide all interactive elements
        this.UIElements.play.visible = false;
        this.UIElements.increase.visible = false;
        this.UIElements.decrease.visible = false;
        this.UIElements.repeats.visible = false;
        


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
        const origin = this.levelObjects.leftBar.getTopRight();
        
        const width = (this.levelObjects.rightBar.getTopLeft().x - origin.x) * extend; 
        
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

        if (!accepted && this.testsStarted){
            this.time.delayedCall(500, this.automata.clearStates, [], this.automata)
            popUp(["Not accepted!", "Try a different selection"], this);
            this.UIElements.increase.visible = true;
            this.UIElements.decrease.visible = true;
            resetBackground(this);
            this.runTests = false;
            this.testsStarted = false;
            this.numRepeats = 1;
            this.UIElements.repeats.text = this.numRepeats;
            this.time.delayedCall(2000, this.startComputation, [], this); 

        } else if (accepted && !this.runTests && this.testsStarted){
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
            this.addElements();
            return;
        }

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.inputWord[i], { fontSize: '50px', color: colours.TEXTBLACK, fontFamily: 'Quantico'}))
        this.time.delayedCall(400, this.drawLetters, [i+1], this);
    }

    addElements(){
        this.textX = this.levelObjects.letters.at(-1).getTopRight().x;
        this.addSlidingWindow();
        this.finishedAddingWord = true;
        this.UIElements.play.visible = true;
        this.UIElements.repeats.visible = true;
        this.enableControlButtons();
        this.selectedWord = this.addSections(this.numRepeats);
        this.startComputation();
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
            this.levelObjects.computedLetters.unshift(this.add.text(this.textX-(i*20), this.textY+50, this.word[place], { fontSize: '20px', color: colours.TEXTBLACK, fontFamily: 'Quantico'}))
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
                this.add.text(calculateStartingX(this.selectedWord, true) + i*18, this.textY+55, this.selectedWord[i], { fontSize: '20px', color: colours.TEXTBLACK, fontFamily: 'Quantico' })
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
            this.loopLength = wordParts[0].length + wordParts[1].length;
            
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
        this.levelObjects.leftBar = this.add.rexRoundRectangle(leftTop.x-20, leftTop.y, 10, 50, 
            {
                tl: 8, bl: 8
            }, 
        colours.DARKBLUE).setOrigin(0).setInteractive();

        this.levelObjects.leftBar.on('pointerover', () => {
            this.levelObjects.leftBar.setFillStyle(colours.RED)
        });
        this.levelObjects.leftBar.on('pointerout', () => {
            this.levelObjects.leftBar.setFillStyle(colours.DARKBLUE)
        });
        
        // Add right bar
        const rightTop = this.levelObjects.letters.at(-1).getTopRight();
        this.levelObjects.rightBar = this.add.rexRoundRectangle(rightTop.x+10, rightTop.y, 10, 50, 
            {
                tr: 8, br: 8
            }, 
        colours.DARKBLUE).setOrigin(0).setInteractive();

        this.levelObjects.rightBar.on('pointerover', () => {
            this.levelObjects.rightBar.setFillStyle(colours.RED)
        });
        this.levelObjects.rightBar.on('pointerout', () => {
            this.levelObjects.rightBar.setFillStyle(colours.DARKBLUE)
        });

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
        const origin = this.levelObjects.leftBar.getTopRight();
        const width = this.levelObjects.rightBar.getTopLeft().x - origin.x;
        const height = this.levelObjects.leftBar.getBottomLeft().y - origin.y; 
        this.levelObjects.slider = this.add.rectangle(origin.x, origin.y, width, height)
            .setStrokeStyle(2, colours.DARKBLUE, 1)
            .setOrigin(0);

        // Render letters above box
        for (let letter of this.levelObjects.letters){
            letter.setDepth(1);
        }
    }

    enableControlButtons(){
        
        this.UIElements.increase.visible = true;
        this.UIElements.decrease.visible = true;

        this.UIElements.increase.on('pointerup', () => {
            
            // Cap at 3
            if (this.numRepeats < 3) {
                this.numRepeats += 1;
                this.UIElements.repeats.text = this.numRepeats;
            };
        });
        this.UIElements.increase.on('pointerover', () => {
            this.UIElements.increase.setFillStyle(colours.RED)
        });
        this.UIElements.increase.on('pointerout', () => {
            this.UIElements.increase.setFillStyle(colours.WHITE)
        });
        
        this.UIElements.decrease.on('pointerup', () => {
            if (this.numRepeats > 0) { 
                this.numRepeats -= 1;
                this.UIElements.repeats.text = this.numRepeats 
            }
        });  
        this.UIElements.decrease.on('pointerover', () => {
            this.UIElements.decrease.setFillStyle(colours.RED)
        });
        this.UIElements.decrease.on('pointerout', () => {
            this.UIElements.decrease.setFillStyle(colours.WHITE)
        });
        
        this.UIElements.play.on('pointerover', () => {
            this.UIElements.play.setFillStyle(colours.RED)
        });
        this.UIElements.play.on('pointerout', () => {
            this.UIElements.play.setFillStyle(colours.WHITE)
        });
    }
}