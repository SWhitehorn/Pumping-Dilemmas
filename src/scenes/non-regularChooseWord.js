import Level from "./levelTemplate.js";
import colours from "/src/utils/colours.js";
import { randomNumber } from "/src/utils/utils.js";
import CYK from "/src/utils/CYK.js";
import addWordUI from "/src/objects/components/addWordUI.js"

export default class Non_RegularLevel extends Level {

    textSettings = {fontSize: '30px', color: colours.TEXTWHITE, fontFamily: 'Quantico', align: 'center'}

    constructor(){
        super("Non_RegularLevel");
    }

    create({language, grammar}){
        
        this.grammar = grammar;
        this.language = language;

        // Create level without automata
        super.create(null, language);

        

        let numStates = randomNumber(3, 5);
        this.numStates = numStates;
        const text = `I have created an automaton with ${numStates} states \nfor the language:`
        this.add.text(400, 200, text, this.textSettings).setOrigin(0.5);

        this.add.text(400, 280, language, {fontSize: '35px', color: colours.TEXTRED, fontFamily: 'Quantico', align: 'center'}).setOrigin(0.5);

        this.add.text(400, 350, "Enter a word in the language: ", this.textSettings).setOrigin(0.5);

        this.word = "";
        this.CYK = new CYK(grammar);
        this.addTextBox();
    }

    addTextBox(){
        
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

}