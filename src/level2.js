import Level from "./levelTemplate.js";
import Colours from "./colours.js";
import { getNextLetter } from "./utils.js";


// Draggable automaton
export default class Level2 extends Level {

    inputAutomata = {}

    constructor(){
        super('Level2');
    }

    create({automata, word, language}){
        
        this.inputWord = this.word = word;
        this.language = language;

        this.draw = false;
        this.interactive = true;
        
        
        super.create(automata);
        this.transitions.setInteractive();
        
        this.input.mouse.disableContextMenu(); // Allow for right clicking
        
        // Iterate through states
        for (let s in this.automata.states){
            let state = this.automata.states[s];
            this.setDrag(state);
            
            // Allow player to draw transitions to connect states
            state.graphic.on('pointerup', (pointer) => {
                if (pointer.rightButtonReleased()){
                    this.connectStates(state, s);
                }
            })
        }

        this.input.on('pointermove', (pointer) => {
            this.graphics.clear();
            
            // Draw line between state and pointer
            if (this.draw) {
                const line = new Phaser.Geom.Line (this.selectedState.graphic.x, this.selectedState.graphic.y, pointer.x, pointer.y);
                this.graphics.strokeLineShape(line);
            }
        }); 
    }

    update(){
        if (!this.draw){
            this.graphics.clear();
        }
        this.transitions.drawTransitions(); 
    }
    
    setDrag(state){
        this.input.setDraggable(state.graphic);
        this.input.on('drag', function (pointer, graphic, dragX, dragY) {
            graphic.x = dragX;
            graphic.y = dragY;
            if(graphic.inner){
                graphic.inner.x = dragX;
                graphic.inner.y = dragY;
            }
        })
    }

    connectStates(state, s){      
        
        // Start drawing transition
        if (!this.draw){
            this.draw = true;
            this.selectedState = state;
        
        } else { // Connect states
            
            // Get first available letter
            let input = 'a';
            while (this.selectedState.transitions.hasOwnProperty(input)){
                input = getNextLetter(input, this.language);
                
                // Check for null
                if (!input){
                    console.log('no more letters');
                    this.draw = false;
                    return;
                }
            }
            
            this.draw = false;
            this.selectedState.transitions[input] = [s];
        }
    }
}