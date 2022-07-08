import Level from "./levelTemplate.js";
import Colours from "./colours.js";
import { getNextLetter } from "./utils.js";
import "./typedefs/typedefs.js";


/**
 * @typedef {Object} Input
 * @property {Automata} automata - Input automata
 * @property {string} word - Input word
 * @property {string[]} language - Array of characters allowed in language
 */

/**
 * Level creator for draggable automata
 * @class
 * @extends Level
 */
export default class Level2 extends Level {

    inputAutomata = {}

    constructor(){
        super('Level2');
    }

    /**
     * 
     * @param {Input}
     * @extends Level.create 
     */
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
            this.input.setDraggable(state.graphic);
            
            state.graphic.on('pointerdown', (pointer) => {

                if (!pointer.rightButtonDown()){
                    for (let key in state.keys){
                        
                    }
                }
            })

            // Allow player to draw transitions to connect states
            state.graphic.on('pointerup', (pointer) => {
                if (pointer.rightButtonReleased()){
                    this.connectStates(state, s);
                
                } else{
                    
                }
            })
        }
        
        this.setDrag();
        
        this.input.on('pointermove', (pointer) => {
            this.graphics.clear();
            
            // Draw line between state and pointer
            if (this.draw) {
                const line = new Phaser.Geom.Line (this.firstState.state.graphic.x, this.firstState.state.graphic.y, pointer.x, pointer.y);
                this.graphics.strokeLineShape(line);
            }
        }); 
    }

    /**
     * Called to update game objects once per frame
     */
    update(){
        if (!this.draw){
            this.graphics.clear();
        }
        this.transitions.drawTransitions(); 
    }
    
    /**
     * Enables objects to be dragged
     */
    setDrag(){
        this.input.dragDistanceThreshold = 10;

        this.input.on('drag', (pointer, object, dragX, dragY) => {
            
            object.x = pointer.x;
            object.y = pointer.y;
            
            if (object.inner){
                object.inner.x = pointer.x;
                object.inner.y = pointer.y;
            }

            // Object is transitionPoint
            if (object.isTransitionPoint){
                object.parent.setPosition(pointer.x, pointer.y);
            
            // Object is state
            } else {
            }
        });

        this.input.on('dragstart', (pointer, object, dragX, dragY) => {
            
            if (object.isTransitionPoint){
                object.parent.dragging = true;
            } else {
                const state = object.parent;
                for (let key of state.keys){

                    if (this.transitions.transitionPoints[key].hasOwnProperty('letterArray')){
                        this.transitions.transitionPoints[key].letterArray.forEach((letter) => {letter.destroy()});;
                        delete this.transitions.transitionPoints[key].letterArray;
                    }
                    
                    // Flag that position needs to be updated
                    this.transitions.transitionPoints[key].update = true;
                }
            }
        });

        this.input.on('dragend', (pointer, object, dragX, dragY) => {
            
            if (object.isTransitionPoint){
                object.parent.dragging = false;
            
            // Object is a state
            } else{ 
                for (let key of object.parent.keys){                
                    this.transitions.transitionPoints[key].update = false;
                }
            }
        });
    }
    
    /**
     * 
     * @param {State} state - State object clicked on
     * @param {string} stateName - name of state clicked on 
     */
    connectStates(state, currStateName){      
        
        // Start drawing transition
        if (!this.draw){
            this.draw = true;
            this.firstState = {state, 'stateName':currStateName};
        
        // Drawing finished, connect states
        } else { 
            
            // Get first available letter
            let input = this.language[0];
            while (this.firstState.state.transitions.hasOwnProperty(input)){
                input = getNextLetter(input, this.language);
                // Check for language wrapping around
                if (input === this.language[0]){
                    break;
                }
            }
            
            this.draw = false;
            
            // Add input
            if (this.firstState.state.transitions.hasOwnProperty(input)){
                this.firstState.state.transitions[input].push(currStateName)
            } else {
                this.firstState.state.transitions[input] = [currStateName];
            }   

            const key = this.firstState.stateName + currStateName;
            if (this.transitions.transitionPoints.hasOwnProperty(key)){
                this.transitions.transitionPoints[key].addInput(input);
            }

            
        }
    }
}