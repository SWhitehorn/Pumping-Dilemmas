import LoopLevel from "./baseLoopScene.js";
import { randomNumber } from "/src/utils/utils.js"
import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import CYK from "/src/utils/CYK.js"
import popUp from "/src/objects/components/popUp.js"
import textBox from "/src/objects/components/textBox.js";
import { calculateStartingX, changeBackground, resetBackground } from "/src/utils/utils.js"
import nonRegSplitsUI from "/src/objects/components/nonRegSplitsUI.js";

export default class Non_RegularSelectRepeats extends LoopLevel {

    constructor(){
        super("Non_RegularSelectRepeats");
    }

    create({language, word, grammar, tutorial, numStates, posKey}){  
        
        this.word = word;
        this.CYK = new CYK(grammar);
        this.numStates = numStates;
        this.posKey = posKey;

        this.called = 0;

        //Flags 
        this.chosenLoops = false;

        super.create({automata:null, word, language});
        this.createUI();
        

        // Remove ability to drag bars
        this.input.setDraggable(this.levelObjects.leftBar, false);
        this.input.setDraggable(this.levelObjects.rightBar, false);

        //Add option to rechoose word
        const rechoose = this.add.text(400, this.textY+70, "Rechoose word", {fontSize: '20px', color: colours.TEXTBLACK, fontFamily: 'Quantico'})
            .setOrigin(0.5).setInteractive().on('pointerup', () => {
            this.scene.stop("Non_RegularSelectRepeats");
            this.scene.start("Non_RegularLevel", {language, word, grammar, numStates, posKey})
        });
        rechoose.on('pointerover', () => {
            rechoose.setColor(colours.TEXTRED);
        });
        rechoose.on('pointerout', () => {
            rechoose.setColor(colours.TEXTBLACK);
        });

        if (tutorial){
            const message = [
                "The computer will select the part of the word that it claims can be repeated.",
                "Prove that the automaton does not exist by repeating the section to find a word outside the language."
            ]
            textBox(this, message, 120);
        } else {
            // Animate bars moving
            this.moveBars();
        }
    }

    /**
     * Overrides loopLevel drawLetters to remove delay in adding letters
     */
    drawLetters(i=0){
        // Base case 
        if (i === this.inputWord.length){
                
            this.textX = this.levelObjects.letters.at(this.numStates-1).getTopRight().x;
            this.add.image(this.textX, this.textY+22, 'dashedLine').setScale(0.75);
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
        const moveLeft = () => {
            
            const moveRight = () => {
                
                const xPosRight = this.levelObjects.letters[rightLetter].getTopRight().x;
                this.levelObjects.rightBar.setFillStyle(colours.RED);

                this.tweens.add({
                    targets: this.levelObjects.rightBar,
                    x: xPosRight,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => {
                        
                        // Change colours
                        this.levelObjects.rightBar.setFillStyle(colours.DARKBLUE);
                        resetBackground(this); 
                        this.add.image(600, 445, 'computerIcon').setAlpha(0.3).setScale(0.85);

                        // Set UI elements to visible
                        this.enableControlButtons();
                        this.UIElements.increaseText.visible = true;
                        this.UIElements.decreaseText.visible = true;
                        this.UIElements.repeats.visible = true;
                        this.UIElements.play.visible = true;
                        
                        // Disable highlighting on left and right bar
                        this.levelObjects.leftBar.on('pointerover', () => {
                            this.levelObjects.rightBar.setFillStyle(colours.DARKBLUE)
                        });
                        this.levelObjects.rightBar.on('pointerover', () => {
                            this.levelObjects.rightBar.setFillStyle(colours.DARKBLUE)
                        });

                        this.chosenLoops = true;


                    }
                });
            }

            
            const xPos = this.levelObjects.letters[leftLetter].getTopLeft().x - 20;
            this.levelObjects.leftBar.setFillStyle(colours.RED);
            
            this.tweens.add({
                targets: this.levelObjects.leftBar,
                x: xPos,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => {
                    this.levelObjects.leftBar.setFillStyle(colours.DARKBLUE);
                    moveRight();
                }
            });
        }
        
        const {leftLetter, rightLetter} = this.getLoopPlaces();

        this.time.delayedCall(250, moveLeft, [], this)
    }

    testWord(){
        
        const result = this.CYK.testMembership(this.selectedWord);
        if (result) {
            popUp(["That word is still in the language!"], this);
        } else {
            popUp(["Success! That word is not in the language", `You have proved that there cannot be an automaton with ${this.numStates} states for this language`], this);
            this.time.delayedCall(4000, this.ending, [], this)
        }
    }

    ending(){
        this.scene.stop();
        this.scene.start("LevelSelect", {passed:true})
    }

    createUI(){
        // Add box for selected word
        const UI = nonRegSplitsUI(this).layout();
        const buttons = {
            increase: UI.getElement('bottom').getElement('left').getElement('label').getElement('text'),
            decrease: UI.getElement('bottom').getElement('right').getElement('label').getElement('text')
        }
    
        buttons.increase.on('pointerover', () => {
            buttons.increase.setColor(colours.TEXTRED)
        });
        buttons.increase.on('pointerout', () => {
            buttons.increase.setColor(colours.TEXTWHITE)
        });
        buttons.increase.setVisible(false);
        
        
        buttons.decrease.on('pointerover', () => {
            buttons.decrease.setColor(colours.TEXTRED)
        });
        buttons.decrease.on('pointerout', () => {
            buttons.decrease.setColor(colours.TEXTWHITE)
        });
        buttons.decrease.setVisible(false);

        this.UIElements.repeats.visible = false;
        this.UIElements.play.visible = false;

        this.UIElements.increaseText = buttons.increase;
        this.UIElements.decreaseText = buttons.decrease;

    }

    /**
     * Selects where to place loop. Optionally predefine place, otherwise choose randomly
     * @returns {Number[]} - Array with two elements, corresponding to left and right
     */
    getLoopPlaces(){
        
        // posKey is an optional string flagging where to locate the loop
        if (this.posKey){
            // Locate loop in middle
            if (this.posKey === 'middle2' | this.posKey === "middle1"){
                
                const middle = Math.floor(this.word.length / 2);

                if (this.posKey === 'middle2'){
                    if (middle < this.numStates){
                        return {leftLetter: middle-1, rightLetter: middle};
                    } else {
                        return {leftLetter: this.numStates-2, rightLetter: this.numStates-1}
                    }
                } else {
                    if (middle < this.numStates){
                        return {leftLetter: middle, rightLetter: middle};
                    } else {
                        return {leftLetter: this.numStates-1, rightLetter: this.numStates-1}
                    }
                }
                
            } else if (this.posKey == "afterC"){
                let index = this.word.search(/c/);
                if (index < this.numStates-1){
                    return {leftLetter: index+1, rightLetter: index+1}
                } else {
                    let rightLetter = (index <= this.numStates ? index-1 : this.numStates-1);
                    let leftLetter = rightLetter -1
                    return {leftLetter, rightLetter }
                }
                    
            // posKey is a regEx
            } else {
                let regEx = RegExp(this.posKey, "d")
                let result = regEx.exec(this.word)
                let left = result.index
                if (left < this.numStates-1 && left !== -1){
                        return {leftLetter: left, rightLetter: left+(result[0].length-1)}
                    } 
            }
        }

        // Choose randomly if conditions fail
        let leftLetter = randomNumber(0, this.numStates);
        const max = Math.floor(this.word.length / 2);
        const num = randomNumber(0, max);
        let rightLetter = leftLetter + num;
        if (rightLetter >= this.numStates){
            rightLetter = this.numStates-1;
        }
        return {leftLetter, rightLetter}
    }

    textBoxCallback(){
        this.moveBars();
    }

    pressPlay(){
        
        if (this.finishedAddingWord && this.decomposeWord()[1] !== ""){
            this.testWord();
        }
    }

    
}