import textBox from "/src/objects/components/textBox.js";
import Level from "/src/scenes/levelTemplate.js";
import loopSelectBox from "/src/objects/components/loopSelectBox.js";

export default class LoopTutorial extends Level {

    repeat = true;

    constructor(){
        super('LoopTutorial');
    }

    preload(){
        super.preload();
        this.load.image('nextPage', '../assets/arrow-down-left.png');
    }

    create({automata, word, language, repeats}){
        
        this.automata = automata;
        this.word = word;
        this.language = language;
        this.repeats = repeats;


        this.word = word;
        
        super.create(automata, language);

        this.lines = [
            "If a word has more letters than the automaton has states, then the path through the automaton must visit the same state more than once.",
            "This means there must be a part of the word that starts and ends in the same state when read.",
            "The length of this loop plus the section before it must be less than the number of states in the automaton.",
            "This part of the word can be repeated or removed, and the resulting word will still be in the language.",
            "Click to try this out. Adjust the repeated portion of the word by dragging the sliders and use the arrows to add or remove repeats."
        ]

        textBox(this, this.lines);
        
    }

    textBoxCallback(){
        
        const lines = this.lines
        const message = [
            "Drag the bars to select a portion of the word that can be repeated",
            "Click play to test your selection!"
        ]
        
        this.scene.start('ComputerLoopLevel', {
            automata: this.automata, 
            word: this.word, 
            language: this.language, 
            repeats: this.repeats,
            message: {message, lines}
        });

    }
}