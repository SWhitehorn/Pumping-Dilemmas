import LoopLevel from "./baseLoopScene.js";
import { randomNumber } from "/src/utils/utils.js"
import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import { CYK } from "/src/utils/CYK.js"

export default class Non_RegularSelectRepeats extends LoopLevel {
    
    startingX = 200
    textY = 300

    constructor(){
        super("Non_RegularSelectRepeats");
    }

    create({language, word, grammar}){  
        
        this.word = word;
        this.CYK = new CYK(grammar);

        //Flags 
        this.chosenLoops = false;

        super.create({automata:null, word, language});
        
        // Remove ability to drag bars
        this.input.setDraggable(this.levelObjects.leftBar, false);
        this.input.setDraggable(this.levelObjects.rightBar, false);

        // Add increase and decrease buttons, set to invisible until y has been chosen
        this.addControlButtons()
        this.textObjects.increase.visible = false;
        this.textObjects.decrease.visible = false;

        //Add option to rechoose word
        const rechoose = this.add.text(100, 500, "Rechoose word", {fontSize: '30px', color: colours.TEXTWHITE}).setInteractive();
        rechoose.on('pointerup', () => {
            this.scene.stop("Non_RegularSelectRepeats");
            this.scene.start("Non_RegularLevel", {language})
        })

        this.textObjects.testMembership = this.add.text(650, 350, "Test", {fontSize: '30px', color: colours.TEXTWHITE}).setInteractive();
        this.textObjects.testMembership.visible = false;
        this.textObjects.testMembership.on('pointerup', () => {
            const result = this.CYK.testMembership(this.selectedWord);
            console.log(result, this.selectedWord);
            if (result) {
                alert("Still in the language!");
            } else {
                alert ("Success! That word is not in the language");
                this.scene.stop("Non_RegularSelectRepeats");
                this.scene.start("IntroScene");

            }
        })

        // Animate bars moving
        this.moveBars();
        
    }

    update(){
        super.update();
        if (this.chosenLoops){
            this.textObjects.increase.visible = true;
            this.textObjects.decrease.visible = true;
            this.textObjects.testMembership.visible = true;

        }
        
    }

    /**
     * Overrides loopLevel drawLetters to remove delay in adding letters
     */
    drawLetters(i=0){
        // Base case 
        if (i === this.inputWord.length){
                
            this.textX = this.levelObjects.letters.at(-1).getTopLeft().x;
            this.addSlidingWindow();
            this.finishedAddingWord = true;
            return;
        }

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.inputWord[i], { fontSize: '50px', color: '#ffffff' }))
        this.drawLetters(i+1);
    }

    /** Adds tweens to move the bars */
    moveBars(){
        
        const moveLeft = () => {
            
            const moveRight = () => {
                const rightLetter = leftLetter + randomNumber(1, 4);
                if (rightLetter >= this.levelObjects.letters.length){
                    rightLetter = this.levelObjects.letters.length - 1;
                }
                
                const xPosRight = this.levelObjects.letters[rightLetter].getTopRight().x;
                
                this.tweens.add({
                    targets: this.levelObjects.rightBar,
                    x: xPosRight,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => {this.chosenLoops = true}
                });
            }

            const leftLetter = randomNumber(0, this.word.length-2);
            const xPos = this.levelObjects.letters[leftLetter].getTopLeft().x - 20
            
            this.tweens.add({
                targets: this.levelObjects.leftBar,
                x: xPos,
                duration: 2000,
                ease: 'Power2',
                onComplete: moveRight
            });
        }
        
        this.time.delayedCall(250, moveLeft, [], this)
    }
}