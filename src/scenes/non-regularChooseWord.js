import Level from "./levelTemplate.js";
import colours from "/src/utils/colours.js";
import { randomNumber } from "/src/utils/utils.js";
import CYK from "/src/utils/CYK.js";
import addWordUI from "/src/objects/components/addWordUI.js"
import textBox from "/src/objects/components/textBox.js";

export default class Non_RegularLevel extends Level {

    textSettings = {fontSize: '30px', color: colours.TEXTBLACK, fontFamily: 'Quantico', align: 'center'}

    constructor(){
        super("Non_RegularLevel");
    }

    create({language, grammar, tutorial}){
        
        this.grammar = grammar;
        this.language = language;
        this.tutorial = tutorial;

        // Create level without automata
        super.create(null, language);

        let numStates =  randomNumber(3, 5);
        this.numStates = numStates;
        this.word = "";
        this.CYK = new CYK(grammar);
        
        if (tutorial){
            const message = [
                `The computer claims it has improved its automaton for ${language}, but it won't let you see it.`,
                "To prove it is bluffing, enter a word that is in the language and therefore should be accepted",
                "On the next screen, the computer will select the loop in the word."
            ]

            textBox(this, message, 120);
        } else {
            this.addDialogue();
        }
        const UI = addWordUI(this).layout();
    }

    update(){
        this.textEntry.text = this.word;
    }

    textBoxCallback(){
        this.addDialogue();
    }

    addDialogue(){
        
        const background = this.add.rexRoundRectangle(400, 260, 620, 250, 20, colours.WHITE).setStrokeStyle(5, colours.BLACK)

        const text = `I have created an automaton with ${this.numStates} states \nfor the language:`
        this.add.text(400, 200, text, this.textSettings).setOrigin(0.5);

        this.add.text(400, 280, this.language, {fontSize: '35px', color: colours.TEXTRED, fontFamily: 'Quantico', align: 'center'}).setOrigin(0.5);

        this.add.text(400, 350, "Enter a word in the language: ", this.textSettings).setOrigin(0.5);
    }

}