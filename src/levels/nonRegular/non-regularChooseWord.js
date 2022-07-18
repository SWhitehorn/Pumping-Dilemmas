import Level from "../levelTemplate.js";
import colours from "../../colours.js";
import { randomNumber } from "../../utils.js";

export default class Non_RegularLevel extends Level {

    textSettings = {fontSize: '30px', color: colours.TEXTWHITE}

    constructor(){
        super("Non_RegularLevel");
    }

    create({language}){
        
        // Create level without automata
        super.create(null, language);

        let numStates = randomNumber(3, 5);
        const text = `The other player claims they have an \nautomaton with ${numStates} states accepting L.`
        this.add.text(50, 100, text, this.textSettings);

        this.add.text(50, 225, "Enter a word in the language: ", this.textSettings);

        this.word = "";
        this.addTextBox();

        const done = this.add.text(350, 400, "Done", this.textSettings).setOrigin(0).setInteractive();

        done.on('pointerover', () => {
            if (this.word.length > numStates){
                done.setColor(colours.TEXTRED);
            }
            
        })
        
        done.on('pointerout', () => {
            done.setColor(colours.TEXTWHITE);
        })

        done.on('pointerup', () => {
            const word = this.word;
            if (word.length > numStates){
                this.scene.stop(this.sceneName);
                this.scene.start('Non_RegularSelectRepeats', {language, word});
            }
            
        })
    }

    addTextBox(){
        
        this.textEntry = this.add.text(300, 300, this.word, this.textSettings);
        const textBox = this.add.rectangle(300, 300, 155, 30, colours.WHITE).setOrigin(0).setAlpha(.3);

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