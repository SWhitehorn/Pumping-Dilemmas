import Level from "./levelTemplate.js";
import Colours from "./colours.js"

export default class AddWordLevel extends Level {

    constructor(){
        super('AddWordLevel');
    }

    create({automata}){
        super.create(automata);
        
        // Initialise empty word
        this.word = ""

        this.textEntry = this.add.text(300, 400, this.word, { font: '32px Courier', fill: '#ffffff' });
        const textBox = this.add.rectangle(300, 400, 155, 30, Colours.WHITE).setOrigin(0).setAlpha(.3);
        
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