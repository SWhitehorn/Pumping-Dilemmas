import Level from "./levelTemplate.js";
import colours from "/src/utils/colours.js"
import addWordUI from "/src/objects/components/addWordUI.js";
import CYK from "/src/utils/CYK.js"
import popUp from "/src/objects/components/popUp.js";

export default class AddWordLevel extends Level {

    constructor(){
        super('AddWordLevel');
        
    }

    create({automata, language, grammar}){
        super.create(automata, language);
        
        // Initialise empty word
        this.word = ""
        
        // Create membership tester
        this.CYK = new CYK(grammar);

        const UI = addWordUI(this).layout();

        const textBox = this.add.rectangle(380, 460, 230, 50, colours.WHITE).setStrokeStyle(3, colours.BLACK);
        this.textEntry = this.add.text(380, 460, this.word, { fontSize: '50px', color: colours.TEXTBLACK, fontFamily: 'Quantico'}).setOrigin(0.5);
        // Text entry
        this.input.keyboard.on('keydown', (event) => {
            
            if (!this.computing){ // Disable text entry when computation is happening
                
                // Backspace: Remove final character
                if (event.keyCode === 8 && this.word.length > 0) { 
                    this.word = this.word.substr(0, this.word.length - 1);
                
                // Add key to text
                } else if ((event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) 
                    && this.word.length < 8) {
                    this.word = (this.word + event.key).toLowerCase();                
                }
            }
        });
    }

    update(){
        this.textEntry.text = this.word;
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

        if (accepted){
            const messages = ["The automata works for " + '"' + this.word + '"', "Try a different word!"]
            this.time.delayedCall(500, popUp, [messages, this], this)
        } else {
            
            const messages = [
                '"' + this.word + '"' + " was rejected, but belongs to the language!",
                "You have proved they are not the same" 
            ]
            this.time.delayedCall(500, popUp, [messages, this], this)
            this.time.delayedCall(4000, returnToMenu, [], this)
        }

    }
}