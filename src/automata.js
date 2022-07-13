import "./typedefs/typedefs.js";
import Colours from "./colours.js";
import { createKey } from "./utils.js";

/**
 * Class for the automata
 * @class
 */

export default class Automata {

    // Constants
    THICKNESS = 3;
    SIZE = 30;


    /**
     * Construct new automata based on data
     * @param {Automata} data - Data used to create automata 
     * @param {Object} scene - Phaser scene object containing automata
     */
    constructor(data, scene){
        this.states = data.states;
        this.start = data.start;
        this.scene = scene;
        this.controlPoints = {};

    }

    /**
     * Returns state with given name, or null is non-existent.
     * @param {string} name - Name of automata 
     */
    getState(name){
        if (this.states.hasOwnProperty(name)){
            return this.states[name];
        } else {
            return null;
        }
    }

    getStart(){
        return this.states[this.start];
    }

    /**
     * Adds the key to the state data
     * @param {string} key - key for transition
     */
    addKey(key){
        const stateNames = key.split(",");
        
        if (this.states[stateNames[0]].keys.indexOf(key) === -1){
            this.states[stateNames[0]].keys.push(key);
        }

        if (this.states[stateNames[1]].keys.indexOf(key) === -1){
            this.states[stateNames[1]].keys.push(key);
        }
    }

    /**
     * Removes key from automata
     * @param {string} key - Key of transition to remove 
     */
    removeKey(key){
        
        const stateNames = key.split(",");
        const start = this.states[stateNames[0]];
        const end = this.states[stateNames[1]];

        if (start.keys.indexOf(key) !== -1){
            start.keys.splice(start.keys.indexOf(key), 1);
        } 
        if (end.keys.indexOf(key) !== -1){
            end.keys.splice(end.keys.indexOf(key), 1);
        } 

    }

    /**
     * Defines a transition between given states over input
     * @param {string} firstStateName - Name of first state
     * @param {string} secondStateName - Name of second state
     * @param {string} input - Symbol to define over
     */
    addTransition(firstStateName, secondStateName, input){
        
        // Add input to transitions of first state
        const startState = this.states[firstStateName];
        if (startState.transitions.hasOwnProperty(input)){
            startState.transitions[input].push(secondStateName)
        } else {
            startState.transitions[input] = [secondStateName];
        }  

        // Add key
        const key = createKey(firstStateName, secondStateName);
        this.addKey(key);
    }

    /**
     * Create state graphic
     * @param {string} s - Name of state to draw
     */
    addStateGraphic(s){   
        
        const state = this.states[s];

        state.graphic = this.scene.add.circle(state.x, state.y, this.SIZE, Colours.WHITE)
        state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1).setInteractive();
        state.graphic.parent = state;

        if (state.accepting){
            state.graphic.inner = this.scene.add.circle(state.x, state.y, this.SIZE/1.3, Colours.WHITE);
            state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        }

        // Record of where state is connected to
        state.keys = [];
    }

    /** Peform a single step of computation */
    computation(){        
    
        // Set previous state to black
        const prevState = this.states[this.currState];
        prevState.graphic.setFillStyle(Colours.WHITE, 1);
        if (prevState.accepting){ 
            prevState.graphic.inner.setFillStyle(Colours.WHITE, 1);
        }
        
        // Check if word is empty. If so, end computation
        if (!this.scene.word){
            this.endComputation();
            return;
        } 
        
        // If word is not empty, get first symbol
        let symbol = this.scene.word[0];
        this.scene.word = this.scene.word.slice(1);
        
        // Exit if transition over symbol is not defined
        if (!(symbol in this.getState(this.currState).transitions)){

            // Colour state red
            prevState.graphic.setFillStyle(Colours.RED, 1);
            if (prevState.accepting){
                prevState.graphic.inner.setFillStyle(Colours.RED, 1);
            }
            this.endComputation();
            return;
        }

        // Index transitions of state based on symbol
        this.currState = this.getState(this.currState).transitions[symbol][0];
        let state = this.getState(this.currState);
        

        // Colour state green or red is word is empty, having taken tranition
        if (!this.scene.word){
            
            // Change to green if accepting, red if not
            if (state.accepting){
                state.graphic.setFillStyle(Colours.GREEN, 1);
                state.graphic.inner.setFillStyle(Colours.GREEN, 1);
                this.endComputation(true);
            }
            else{
                state.graphic.setFillStyle(Colours.RED, 1); 
                this.endComputation();
            }
        }
        
        // Continue computation
        else{
            // Highlight current state in yellow;
            state.graphic.setFillStyle(Colours.YELLOW, 1);
            if (state.accepting){ // Check if state has inner ring
                state.graphic.inner.setFillStyle(this.THICKNESS, Colours.YELLOW, 1);
            }
        }

        // Draw computed word for level one
        if (this.scene.scene.key === "Level1"){
            console.log('drawing');            
            this.scene.drawComputedWord();
        }
    }
    
    /** Reset all states to standard colours */
    clearStates(){
        for (let s in this.states){            
            
            let state = this.states[s];
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
            state.graphic.setFillStyle(Colours.WHITE, 1);
            if (state.accepting){
                state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
                state.graphic.inner.setFillStyle(Colours.WHITE, 1);
            }
        }
    }

    /** 
     * Alias for levelTemplate endComputation 
     * @param {boolean} [accepted] - Indicates that computation ended in accepting state
    */
    endComputation(accepted=false){
        this.scene.endComputation(accepted);
    }

    /** Alias for levelTemplate startComputation */
    startComputation(){
        this.scene.startComputation();
    }

    /** Saves the current automata so it can loaded into other levels */
    bakeAutomata(){
        Object.values(this.states).forEach( (state) => { 
            
            state.x = state.graphic.x;
            state.y = state.graphic.y;

            state.keys.forEach((key) => {
                if (!key in this.controlPoints){
                    this.controlPoints[key] = this.scene.transitions.transitionObjects[key].point.getPosition
                }
                
            });
            
        })
    }
}