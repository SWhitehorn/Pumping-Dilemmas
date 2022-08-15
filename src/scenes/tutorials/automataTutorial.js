import CreateLevel from "../createAutomataScene.js";
import textBox from "/src/objects/components/textBox.js";
import colours from "/src/utils/colours.js"
import popUp from "/src/objects/components/popUp.js";

export default class CreateTutorial extends CreateLevel {

    message = [
        "Drag and drop the states at the bottom to create a finite automaton for the given language.",
        "Connect the states by clicking on the start state, then clicking on the target state.",
        "Change the label for the transition by clicking on the drop down menu, or adjust the line by dragging the menu.",
        "Press the play button to test your automaton!"
    ]

    constructor(){
        super('CreateTutorial');
    }
        
    create(data){
        
        super.create(data);

        textBox(this, this.message, 110);

        this.help = this.add.text(25, 25, "?", {color: colours.TEXTWHITE, fontSize: '30px', fontFamily: 'Quantico'})
        .setOrigin(0.5).setVisible(false).setInteractive().on('pointerup', () => {
            this.help.setVisible(false);
            textBox(this, this.message, 100);
        });
    }
    
    textBoxCallback(){
        this.help.setVisible(true);
        this.time.delayedCall(200, popUp, [["Create a deterministic automata for " + this.language], this, true], this)
    }

    moveToTests(){
        if (this.validFA()) {
            
            const lines = ["Tests are displayed at the bottom. A green icon means the word should be accepted; a red icon means it should be rejected."]
            
            this.automata.bakeAutomata();
            this.scene.start('TestCreateLevel', {
                automata:this.automata, 
                words:this.words, alphabet:this.alphabet, 
                language:this.language, 
                inputAutomata:this.inputAutomata,
                message: lines
            }); 
        } else {
            popUp(["Not a valid automata!", "Have you got a transition for each letter on every state?"], this)
        }
    }
}