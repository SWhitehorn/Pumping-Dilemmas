import Level from "./levelTemplate.js";
import Colours from "./colours.js";
import "./typedefs/typedefs.js";

/**
 * @typedef {Object} Input
 * @property {Automata} automata - Input automata
 * @property {string} word - Input word
 */

/**
 * First Level 
 * @class
 */
export default class Level1 extends Level {

    levelObjects = {letters: [], computedLetters: []}
    textX = 450;
    textY = 375;
    sections = []

    interactive = false;
    repeat = true;

    constructor(){
        super('Level1')
    }

    /**
     * Create level
     * @param {Input}
     */
    create({automata, word}){
        
        // Original value of input word
        this.inputWord = word
        
        // Word the player has selected, including repeats
        //this.selectedWord = word;

        // Word that computation is performed on
        this.word = word;
        
        // Level template handles drawing automaton
        super.create(automata);
       
        const alpha = 0.5;
        
        // Add letters individually
        this.drawLetters(this.textX, this.textY);

        // Add left bar
        const leftTop = this.levelObjects.letters[0].getTopLeft();
        this.levelObjects.leftBar = this.add.rectangle(leftTop.x-20, leftTop.y, 20, 50, Colours.WHITE).setAlpha(alpha).setOrigin(0).setInteractive();
        
        // Add right bar
        const rightTop = this.levelObjects.letters.at(-1).getTopRight();
        this.levelObjects.rightBar = this.add.rectangle(rightTop.x, rightTop.y, 20, 50, Colours.WHITE).setAlpha(alpha).setOrigin(0).setInteractive();

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
        
        // Add text for selected text and number of repeats
        this.selected = this.add.text(20, 60, "", { fontSize: '30px', color: '#ffffff' });

        // Add label for number of repeats
        this.levelObjects.repeats = this.add.text(0, 0, "", { fontSize: '20px', color: '#d40000' })
        this.levelObjects.repeats.num = 1;

        // Increase button
        const increase = this.add.text(650, 400, "Increase", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        increase.on('pointerup', () => {
            
            // Cap at 4
            if (this.levelObjects.repeats.num < 4) {this.levelObjects.repeats.num += 1};
        });
        
        // Decrease button
        const decrease = this.add.text(650, 450, "Decrease", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        decrease.on('pointerup', () => {
            console.log('click')
            if (this.levelObjects.repeats.num > 0){ this.levelObjects.repeats.num -= 1; }
        });
    }

    /**
     * Called every frame to update game objects
     */
    update(){
        this.updateBox();
        this.selectedWord = this.addSections(this.levelObjects.repeats.num);
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
        this.levelObjects.slider = this.add.rectangle(origin.x, origin.y, width, height, Colours.WHITE).setOrigin(0).setAlpha(0.2);
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
        super.computation();
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
     */
    endComputation(){
        super.endComputation();
        this.word = this.selectedWord;
    }

    /**
     * Render the letters of the word on screen
     * @param {number} textX 
     * @param {number} textY 
     */
    drawLetters(textX, textY){

        // Remove current letters
        this.levelObjects.letters.forEach((letter) => {
            letter.destroy();
        })
        this.levelObjects.letters = [];
        for (let i = 0; i < this.inputWord.length; i++){
    
            // Count backwards through letters
            let place = this.inputWord.length - 1 - i
            this.levelObjects.letters.unshift(this.add.text(textX-(i*35), textY, this.inputWord[place], { fontSize: '50px', color: '#ffffff' }))
        }
    }

    /**
     * Draws the word as it is being computed
     */
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

    /**
     * Repeats selected part of word according to number of repeats
     * @param {number} numRepeats - number of times the selection of word is repeated 
     * @returns {String} String with repeated sections
     */
    addSections(numRepeats){
            
            const wordParts = this.decomposeWord(); 
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
                letter.setColor('#d40000');
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

        this.selected.text = "Selected: " + selected;
        return [stringBefore, selected, stringAfter];
    }
}