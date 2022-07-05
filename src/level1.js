import Level from "./levelTemplate.js";
import Colours from "./colours.js";

// Loop finder
export default class Level1 extends Level {

    levelObjects = {letters: []}

     // Constants for letter placement
     textX = 400;
     textY = 400;
     sections = []

    constructor(){
        super('Level1')
    }

    // Automata and word are passed in when level is created
    create({automata, word}){
        console.log(word);
        
        // word changes with computations, inputWord stores original value
        this.word = word
        this.inputWord = word;
        this.interactive = false;
        
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
        
        // Add text
        this.selected = this.add.text(20, 60, "", { fontSize: '30px', color: '#ffffff' });
        this.levelObjects.repeats = this.add.text(20, 100, "Repeats: ", { fontSize: '30px', color: '#ffffff' });
        this.levelObjects.repeats.num = 1;  // Default value of 1
        
        // Increase button
        const increase = this.add.text(650, 400, "Increase", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        increase.on('pointerup', () => {
            console.log('click');
            this.levelObjects.repeats.num += 1;
        });
        
        // Decrease button
        const decrease = this.add.text(650, 450, "Decrease", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        decrease.on('pointerup', () => {
            console.log('click')
            if (this.levelObjects.repeats.num > 0){ this.levelObjects.repeats.num -= 1; }
        });

        
    }

    update(){
        // Only update the sliding box when computation is not happying
        if (!this.computing){
            this.updateBox();    
        }
        this.levelObjects.repeats.text = "Repeats: " + this.levelObjects.repeats.num;
        this.drawLetters(this.textX, this.textY);
        this.decomposeWord();
        
    }

    decomposeWord(){
        let before = true;

        let stringBefore = "" // Before current selection
        let stringAfter = "" // After current selection
        let selected = "" // Current selection
        
        // Change colour of text depending on whether it is within sliding window, add text to relevant section
         for (let letter of this.levelObjects.letters){
            
            if (this.isContained(letter, this.levelObjects.slider)){
                
                letter.setColor('#d40000');
                selected = selected.concat(letter.text)
                before = false;

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
        this.wordParts = [stringBefore, selected, stringAfter];
    }

    // Returns boolean value of whether slider is covering letter
    isContained(letter, slider){
        const sliderRect = slider.getBounds();
        const letterRect = letter.getBounds();

        return (sliderRect.x <= letterRect.x+letterRect.width/3 && sliderRect.x+sliderRect.width >= letterRect.x+letterRect.width/1.5)
    }

    // Draw sliding window
    drawBox(){
        const origin = this.levelObjects.leftBar.getTopRight();
        const width = this.levelObjects.rightBar.getTopLeft().x - origin.x;
        const height = this.levelObjects.leftBar.getBottomLeft().y - origin.y; 
        this.levelObjects.slider = this.add.rectangle(origin.x, origin.y, width, height, Colours.WHITE).setOrigin(0).setAlpha(0.2);
    }

    // Update window to match where the sliders are.
    // Extend is the num of repeats of the word. If called without parameter, it assumes there are no repeats.
    updateBox(extend = 1){
        const origin = this.levelObjects.leftBar.getTopRight();
        const width = (this.levelObjects.rightBar.getTopLeft().x - origin.x) * extend; 
        this.levelObjects.slider.setX(origin.x - (width/2 * (extend-1) ) );
        this.levelObjects.slider.width = width;
    }

    // Computation is handled by super class, but word is then updated onscreen
    computation(){
        super.computation();
        this.drawLetters();
    }

    startComputation(){
        this.addSections(this.levelObjects.repeats.num);
        // Remove sliding window 
        this.levelObjects.leftBar.setVisible(false);
        this.levelObjects.rightBar.setVisible(false);
        
        super.startComputation();
        
    }
 
    endComputation(){
        super.endComputation();
        
        // Add sliding window back
        this.levelObjects.leftBar.setVisible(true);
        this.levelObjects.rightBar.setVisible(true);
        this.levelObjects.slider.setVisible(true);
        if (this.levelObjects.repeatsText){
            this.levelObjects.repeatsText.destroy();
        }
    }

    drawLetters(textX, textY){

        // Remove current letters
        this.levelObjects.letters.forEach((letter) => {
            letter.destroy();
        })
        this.levelObjects.letters = [];
        for (let i = 0; i < this.inputWord.length; i++){
    
            // Count backwards through letters
            let place = this.inputWord.length - 1 - i
            this.levelObjects.letters.unshift(this.add.text(textX-(i*35), textY, this.word[place], { fontSize: '50px', color: '#ffffff' }))
        }
    }

    addSections(numRepeats){
        if (this.levelObjects.repeats.num > 2){
            
            this.word = this.wordParts[0] + this.wordParts[1] + this.wordParts[2];
            const point = this.levelObjects.slider.getTopRight()
            this.levelObjects.repeatsText = this.add.text(point.x-7, point.y-5, ""+numRepeats, { fontSize: '20px', color: '#d40000' })
        
        } else {
            
            this.word = this.wordParts[0] + this.wordParts[1].repeat(numRepeats) + this.wordParts[2];
            this.levelObjects.slider.setVisible(false);
        }
        
    }
}