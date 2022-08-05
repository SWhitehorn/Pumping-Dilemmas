import textBox from "/src/objects/components/textBox.js";
import Level from "/src/scenes/levelTemplate.js";
import addWordUI from "/src/objects/components/addWordUI.js";

export default class OpeningScene extends Level {

    repeat = true;

    constructor(){
        super('OpeningScene');
    }

    preload(){
        super.preload();
        this.load.image('nextPage', '../assets/arrow-down-left.png');
    }

    create({automata, word, language}){
        
        this.word = word;
        
        super.create(automata, language);

        const lines = [
            "Welcome to Pumping Dilemmas!",
            "Above is an example of a finite automaton. A finite automaton consists of states (circles) and transitions (arrows).",
            "The automaton takes a word as input, and moves between states based on the letters of the word.",
            "Click again to see the automaton reading the word " + '"' + this.word + '".',
            "Once all letters have been read, the word is accepted if the current state is accepting, denoted by having an inner circle. The set of words accepted by an automaton is its language.",
            "Click to try inputting some other words. Type, then click the play button to watch the automata go. Click the back arrow when ready to move on."
        ]

        textBox(this, lines);
        
    }

    update(){
        if (this.UIAdded){
            this.textEntry.text = this.word;
        }
    }

    textBoxCallback(){
        this.UI = addWordUI(this).layout();
        this.repeat = false;
        const play = this.UI.getElement('right').getElement('label').getElement('icon');
        
        play.on('pointerup', () => {
            this.automata.stopComputation();
            this.automata.startComputation();
        })

        this.UIAdded = true;
    }
}