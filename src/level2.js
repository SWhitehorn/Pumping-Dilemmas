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
        
        // Store original word and automata to allow for reseting
        this.inputWord = this.word = word;
        this.inputAutomata = structuredClone(automata);
        
        this.language = language;

        // Flags
        this.draw = false; // Flag for whether the player is currently drawing transition
        this.interactive = true; // Flag for whether player can interact with automata
        
        
        super.create(this.inputAutomata);
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
                } else{
                    for (let key of state.keys){

                        if (this.transitions.transitionPoints[key].hasOwnProperty('letterArray')){
                            this.transitions.transitionPoints[key].letterArray.forEach((letter) => {letter.destroy()});;
                            delete this.transitions.transitionPoints[key].letterArray;
                        }
                        
                        this.transitions.transitionPoints[key].destroy();
                        delete this.transitions.transitionPoints[key];
                    }
                    state.keys = [];
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
        
        this.input.dragDistanceThreshold = 5;
        
        this.input.on('drag', (pointer, object, dragX, dragY) => {
            
            object.x = dragX;
            object.y = dragY;
            
            if (object.inner){
                object.inner.x = dragX;
                object.inner.y = dragY;
            }

            if (object.isTransitionPoint){
                object.parent.setPosition(dragX, dragY);
            }
        });

        this.input.on('dragstart', (pointer, object, dragX, dragY) => {
            if (object.isTransitionPoint){
                object.parent.dragging = true;
            }
        });

        this.input.on('dragend', (pointer, object, dragX, dragY) => {
            if (object.isTransitionPoint){
                object.parent.dragging = false;
            }
        });

    }

    connectStates(state, s){      
        
        // Start drawing transition
        if (!this.draw){
            this.draw = true;
            this.selectedState = state;
        
        // Drawing finished, connect states
        } else { 
            
            // Get first available letter
            let input = this.language[0];
            while (this.selectedState.transitions.hasOwnProperty(input)){
                input = getNextLetter(input, this.language);
                // Check for language wrapping around
                if (input === this.language[0]){
                    break;
                }
            }
            
            this.draw = false;
            
            // Add input
            if (this.selectedState.transitions.hasOwnProperty(input)){
                this.selectedState.transitions[input].push(s)
            
            } else {
                this.selectedState.transitions[input] = [s];
            }   
        }
    }
}