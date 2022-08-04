import Level from "./levelTemplate.js";
import colours from "/src/utils/colours.js"
import addWordUI from "/src/objects/components/addWordUI.js";
import CYK from "/src/utils/CYK.js"
import popUp from "/src/objects/components/popUp.js";

export default class AddWordLevel extends Level {

    constructor(key){
        if (key){
            super(key);
        } else {
            super('AddWordLevel')
        }
    }

    create({automata, language, grammar}){

        super.create(automata, language);
        
        // Initialise empty word
        this.word = ""
        
        // Create membership tester
        this.CYK = new CYK(grammar);

        const UI = addWordUI(this).layout();
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