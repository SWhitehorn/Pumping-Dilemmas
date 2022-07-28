import Level from "../levelTemplate.js";
import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import { calculateStartingX } from "/src/utils/utils.js"

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
    textY = 400;
    

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
        this.repeat = false;
        this.finishedAddingWord = false;
        this.passedTests = false;

        // Set words
        this.inputWord = word // Original value of input word
        this.word = word; // Word that computation is performed on
       
        // Add letters individually
        this.startingX = calculateStartingX(this.word);
        this.drawLetters(0);
        
        // Add text for selected text and number of repeats
        //this.textObjects.selected = this.add.text(20, 60, "", { fontSize: '30px', color: '#ffffff' });
        
        // Add compute button
        this.textObjects.compute = this.add.text(20, 20, 'Compute', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        if (this.scene.key !== "ComputerLoopLevel"){
            this.textObjects.compute.on('pointerup', () => {
                if (!this.computing) {this.startComputation()};
            });
        }


        // Remove compute button until word has rendered
        this.textObjects.compute.visible = false;

        // Add label for number of repeats
        this.levelObjects.repeats = this.add.text(0, 0, "", { fontSize: '20px', color: colours.TEXTRED })
        this.levelObjects.repeats.num = repeats;

        
    } 

    /** Called every frame to update game objects */
    update(){
        
        if (this.finishedAddingWord){
            this.updateBox();
            this.selectedWord = this.addSections(this.levelObjects.repeats.num);
            
            if (this.computing){
                this.drawComputedWord();
            } else if (!this.end){
                this.drawSelectedWord();
            }
        }    
        this.children.bringToTop(this.levelObjects.repeats);
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
     * Draw sliding window
     */
    drawBox(){
        const origin = this.levelObjects.leftBar.getTopRight();
        const width = this.levelObjects.rightBar.getTopLeft().x - origin.x;
        const height = this.levelObjects.leftBar.getBottomLeft().y - origin.y; 
        this.levelObjects.slider = this.add.rectangle(origin.x, origin.y, width, height, colours.WHITE).setOrigin(0).setAlpha(0.2);
    }

    /**
     * Update window to match where the sliders are.
     * @param {number} extend - Option to extend slider based on section repeats
     */
    updateBox(extend = 1){
        const origin = this.levelObjects.leftBar.getTopRight();
        const width = (this.levelObjects.rightBar.getTopLeft().x - origin.x) * extend; 
        this.levelObjects.slider.setX(origin.x - (width/2 * (extend-1) ) );
        this.levelObjects.slider.width = width;

        const point = this.levelObjects.rightBar.getTopLeft();
        this.levelObjects.repeats.setPosition(point.x, point.y);
        this.levelObjects.repeats.text = this.levelObjects.repeats.num;
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
        this.drawComputedWord();
        super.startComputation();
    }
    
    /**
     * Called to end the computation, extends levelTemplate method
     * @param {boolean} accepted - Indicates whether computation ended in accepting state
     */
    endComputation(accepted){
        super.endComputation(accepted);
        this.word = this.selectedWord;

        if (accepted && !this.runTests){
            this.passedTests = true;
        }
    }

    /**
     * Recursively render the letters of the word on screen, one at a time
     * @param {number} i - Index of letter to draw
     */
    drawLetters(i){

        // Base case 
        if (i === this.inputWord.length){
            
            this.textX = this.levelObjects.letters.at(-1).getTopLeft().x;
            this.addSlidingWindow();
            this.finishedAddingWord = true;
            this.textObjects.compute.visible = true;
            return;
        }

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.inputWord[i], { fontSize: '50px', color: '#ffffff' }))
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
            this.levelObjects.computedLetters.unshift(this.add.text(this.textX-(i*20), this.textY+50, this.word[place], { fontSize: '20px', color: '#ffffff' }))
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
            // Count backwards through letters
            let place = this.selectedWord.length - 1 - i
            this.levelObjects.computedLetters.unshift(this.add.text(this.textX-(i*20), this.textY+50, this.selectedWord[place], { fontSize: '20px', color: '#ffffff' }))
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
                this.textObjects.compute.visible = false;
            } else {
                this.textObjects.compute.visible = true;
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
                letter.setColor('#ffffff');
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
        this.levelObjects.leftBar = this.add.rectangle(leftTop.x-20, leftTop.y, 20, 50, colours.WHITE).setAlpha(alpha).setOrigin(0).setInteractive();
        
        // Add right bar
        const rightTop = this.levelObjects.letters.at(-1).getTopRight();
        this.levelObjects.rightBar = this.add.rectangle(rightTop.x, rightTop.y, 20, 50, colours.WHITE).setAlpha(alpha).setOrigin(0).setInteractive();

        // Word is added from end, so position of first letter is variable
        const letterBounds = this.levelObjects.letters[0].getBounds();

        // Enabling dragging on bars
        this.input.setDraggable(this.levelObjects.leftBar);
        this.input.setDraggable(this.levelObjects.rightBar);
        const _this = this
        this.input.on('drag', function(pointer, line, dragX, dragY){
            
            // Set bounds for dragging
            if (dragX >= letterBounds.x -20 && dragX <= _this.textX + 30){
                line.x = dragX;
            }
        })
        this.drawBox();
    }

    addControlButtons(){
        // Increase button
        this.textObjects.increase = this.add.text(650, 400, "Increase", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        this.textObjects.increase.on('pointerup', () => {
            // Cap at 4
            if (this.levelObjects.repeats.num < 4) {this.levelObjects.repeats.num += 1};
        });
        
        // Decrease button
        this.textObjects.decrease = this.add.text(650, 450, "Decrease", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        this.textObjects.decrease.on('pointerup', () => {
            if (this.levelObjects.repeats.num > 0){ this.levelObjects.repeats.num -= 1; }
        });  
    }
}