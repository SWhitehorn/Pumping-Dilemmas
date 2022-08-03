import LoopLevel from "./baseLoopScene.js";
import { randomNumber } from "/src/utils/utils.js"
import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import CYK from "/src/utils/CYK.js"
import popUp from "/src/objects/components/popUp.js"
import { calculateStartingX, changeBackground, resetBackground } from "/src/utils/utils.js"
import nonRegSplitsUI from "/src/objects/components/nonRegSplitsUI.js";

export default class Non_RegularSelectRepeats extends LoopLevel {

    constructor(){
        super("Non_RegularSelectRepeats");
    }

    create({language, word, grammar}){  
        
        this.word = word;
        this.CYK = new CYK(grammar);

        //Flags 
        this.chosenLoops = false;

        super.create({automata:null, word, language});

        // Add box for selected word
        nonRegSplitsUI(this).layout();
        
        // Remove ability to drag bars
        this.input.setDraggable(this.levelObjects.leftBar, false);
        this.input.setDraggable(this.levelObjects.rightBar, false);

        // Add increase and decrease buttons, set elements to invisible until loop has been chosen
        this.addControlButtons();
        this.textObjects.increase.visible = false;
        this.textObjects.decrease.visible = false;
        this.UIElements.repeats.visible = false;
        this.UIElements.play.visible = false;
        
        //Add option to rechoose word
        const rechoose = this.add.text(400, this.textY+70, "Rechoose word", {fontSize: '20px', color: colours.TEXTBLACK, fontFamily: 'Quantico'})
            .setOrigin(0.5).setInteractive().on('pointerup', () => {
            this.scene.stop("Non_RegularSelectRepeats");
            this.scene.start("Non_RegularLevel", {language, grammar})
        })

        // Animate bars moving
        this.moveBars();
        
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

        this.levelObjects.letters.push(this.add.text(this.startingX+(i*35), this.textY, this.inputWord[i], { fontSize: '50px', color: colours.TEXTBLACK, fontFamily: 'Quantico' }))
        this.drawLetters(i+1);
    }

    /** Overrides loopLevel drawLetters to change positioning */
    drawSelectedWord(){
    
        // Remove current letters
        this.levelObjects.computedLetters.forEach((letter) => {
            letter.destroy();
        });
        
        this.levelObjects.computedLetters = [];

        for (let i = 0; i < this.selectedWord.length; i++){
            
            this.levelObjects.computedLetters.push(
                this.add.text(calculateStartingX(this.selectedWord) + i*35, 200, this.selectedWord[i], { fontSize: '50px', color: colours.TEXTBLACK, fontFamily: 'Quantico' })
            );
        }
    }

    /** Adds tweens to move the bars */
    moveBars(){
        changeBackground();
        const moveLeft = () => {
            
            const moveRight = () => {
                const num = randomNumber(1, 4);
                console.log(num);
                let rightLetter = leftLetter + num;
                if (rightLetter >= this.levelObjects.letters.length){
                    rightLetter = this.levelObjects.letters.length - 1;
                }
                
                const xPosRight = this.levelObjects.letters[rightLetter].getTopRight().x;
                
                this.tweens.add({
                    targets: this.levelObjects.rightBar,
                    x: xPosRight,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => {
                        resetBackground(); 
                        this.chosenLoops = true;
                        this.textObjects.increase.visible = true;
                        this.textObjects.decrease.visible = true;
                        this.UIElements.repeats.visible = true;
                        this.UIElements.play.visible = true;
                    }
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

    testWord(){
        
        const result = this.CYK.testMembership(this.selectedWord);
        console.log(result, this.selectedWord);
        if (result) {
            popUp(["Still in the language!"], this);
        } else {
            popUp(["Success! That word is not in the language", "You have proved the automaton does not capture L"], this);
            this.time.delayedCall(4000, this.nextLevel, [], this)
        }
    }

    nextLevel(){
        this.scene.stop("Non_RegularSelectRepeats");
        this.scene.start("LevelSelect", {passed:true})
    }
}