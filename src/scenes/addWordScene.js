import Level from "./levelTemplate.js";
import colours from "/src/utils/colours.js"
import addWordUI from "/src/objects/components/addWordUI.js";
import CYK from "/src/utils/CYK.js"
import popUp from "/src/objects/components/popUp.js";
import textBox from "/src/objects/components/textBox.js";

export default class AddWordLevel extends Level {

    constructor(key){
        if (key){
            super(key);
        } else {
            super('AddWordLevel')
        }
    }

    create({automata, language, grammar, message}){

        super.create(automata, language);
        
        // Initialise empty word
        this.word = ""
        
        // Create membership tester
        this.CYK = new CYK(grammar);

        const UI = addWordUI(this).layout();

        if (message){
            textBox(this, message);
            this.help = this.add.text(25, 25, "?", {color: colours.TEXTWHITE, fontSize: '30px', fontFamily: 'Quantico'})
            .setOrigin(0.5).setVisible(false).setInteractive().on('pointerup', () => {
                textBox(this, message, 100);
            });
        } else {
            this.time.delayedCall(200, popUp, [["Enter a word to show that this automaton does not accurately capture " + language], this, true], this)
        }
    }

    update(){
        this.textEntry.text = this.word;
    }

    /**
     * Extends level template method to save current word
     */
    startComputation(){
        this.currWord = this.word;
        super.startComputation();
    }

    /**
     * Extends level template method
     * @param {Boolean} accepted - Whether computation ended in accepting state
     */
    endComputation(accepted){
        
        const returnToMenu = () => {
            this.scene.start('LevelSelect', {passed: true});
        }


        super.endComputation();

        const inLang = this.CYK.testMembership(this.currWord)

        if (accepted && inLang || !accepted && !inLang){
            const messages = ["The automata works for " + '"' + this.currWord + '"', "Try a different word!"]
            this.time.delayedCall(500, popUp, [messages, this], this)
        } else if (accepted && !inLang) {
            const messages = [
                '"' + this.currWord + '"' + " was accepted, but does not belong to the language!",
                "You have proved they are not the same" 
            ]
            this.time.delayedCall(500, popUp, [messages, this], this)
            this.time.delayedCall(4000, returnToMenu, [], this)
        } else if (!accepted && inLang){
            const messages = [
                '"' + this.currWord + '"' + " was rejected, but belongs to the language!",
                "You have proved they are not the same" 
            ]
            this.time.delayedCall(500, popUp, [messages, this], this)
            this.time.delayedCall(4000, returnToMenu, [], this)
        }

    }

    textBoxCallback(){
        this.help.visible = true;
        this.time.delayedCall(200, popUp, [["Enter a word to show that this automaton does not accurately capture " + this.language], this, true], this);
        this.hiddenInputText.open();
    }

}