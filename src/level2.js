import Level from "./levelTemplate.js";
import Colours from "./colours.js";
import { getNextLetter, createKey } from "./utils.js";
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
        for (let stateName in this.automata.states){
            let state = this.automata.states[stateName];
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
                    
                    if (!this.draw){
                        this.draw = true;
                        this.firstState = {state, stateName};
                    } else {
                        this.draw = false;
                        this.connectStates(stateName)
                    }
                    
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
        this.transitions.updateTransitions(); 
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
            }
        });

        this.input.on('dragstart', (pointer, object, dragX, dragY) => {
            
            if (object.isTransitionPoint){
                object.parent.dragging = true;
            
            // Object is a state 
            } else {
                
                // Update transitions going to state
                const state = object.parent;
                for (let key of state.keys){
                    console.log(key);
                    const transitionObjects = this.transitions.getAllObjects();

                    // Remove letters
                    if (transitionObjects[key].point.hasOwnProperty('letterArray')){
                        transitionObjects[key].point.removeLetters();
                    }
                    
                    // Flag that position needs to be updated
                    this.transitions.setToUpdate(key);
                }
            }
        });

        this.input.on('dragend', (pointer, object, dragX, dragY) => {
            
            if (object.isTransitionPoint){
                object.parent.dragging = false;
            
            // Object is a state
            } else{ 
                const transitionObjects = this.transitions.getAllObjects();
                for (let key of object.parent.keys){                
                    this.transitions.removeFromUpdate(key);
                }
            }
        });
    }
    
    /**
     * Adds connection to state given
     * @param {string} targetStateName - name of state clicked on 
     */
    connectStates(targetStateName){      
        
        // Get first available letter
        let input = this.language[0];
        while (this.firstState.state.transitions.hasOwnProperty(input)){
            input = getNextLetter(input, this.language);
            // Check for language wrapping around
            if (input === this.language[0]){
                break;
            }
        }

        this.automata.addTransition(this.firstState.stateName, targetStateName, input);
        
        const key = createKey(this.firstState.stateName, targetStateName);
        const transitionData = this.transitions.getObject(key);
        
        if (transitionData){
            transitionData.point.addInput(input);
        } else {
            this.transitions.newTransition(key, input);
        }
    }
}