import Level from "./levelTemplate.js";
import colours from "/src/utils/colours.js"
import addWordUI from "/src/objects/components/addWordUI.js";
import { calculateStartingX } from "/src/utils/utils.js";

export default class AddWordLevel extends Level {

    constructor(){
        super('AddWordLevel');
    }

    create({automata, language, grammar}){
        super.create(automata, language);
        
        // Initialise empty word
        this.word = ""

        const UI = addWordUI(this);


        const textBox = this.add.rectangle(290, 435, 230, 50, colours.WHITE).setOrigin(0);
        this.textEntry = this.add.text(290, 435, this.word, { fontSize: '50px', color: colours.TEXTBLACK, fontFamily: 'Quantico'});
        
        


        // Text entry
        this.input.keyboard.on('keydown', (event) => {
            
            if (!this.computing){ // Disable text entry when computation is happening
                
                // Backspace: Remove final character
                if (event.keyCode === 8 && this.word.length > 0) { 
                    this.word = this.word.substr(0, this.word.length - 1);
                
                // Add key to text
                } else if ((event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) 
                    && this.word.length < 8) {
                    this.word = this.word + event.key;                
                }
            }
        });
    }

    update(){
        this.textEntry.text = this.word;
    }
}