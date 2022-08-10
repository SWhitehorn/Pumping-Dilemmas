import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"
import { createKey, sameState, splitKey } from "/src/utils/utils.js"

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

    getAllStates(){
        return this.states;
    }

    /**
     * Get the starting state of the automata. 
     * @param {Boolean} name - Flags whether to just return the string name. If null, returns the state itself
     * @returns {String | State} The starting state of the automata, or its name if param is true.
     */
    getStart(name=false){
        
        if (name){
            return this.start.name;
        } else {
            return this.states[this.start.name]
        } 
    }

    /**
     * Returns the side of the state to put the start arrow on
     * @returns {String} Direction - up/down/left/right
     */
    getStartArrowDirection(){
        if (this.start.hasOwnProperty('direction')){
            return this.start.direction
        } else {
            return 'left'
        }
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
        
        console.log('removing ', key);
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
     * @returns {Boolean} True if input was successfully added, false if already present 
     */
    addTransition(firstStateName, secondStateName, input){
        
        // Add input to transitions of first state
        const startState = this.states[firstStateName];
        if (startState.transitions.hasOwnProperty(input)){
            
            if (startState.transitions[input].indexOf(secondStateName) === -1){
                startState.transitions[input].push(secondStateName);
            } else {
                return false;
            }

        } else {
            startState.transitions[input] = [secondStateName];
        }  

        // Add key
        const key = createKey(firstStateName, secondStateName);
        this.addKey(key);
        return true;
    }

    /**
     * Create state graphic
     * @param {string} s - Name of state to draw
     */
    addStateGraphic(s){   
        
        const state = this.states[s];

        state.shadow = this.scene.add.circle(state.x+5, state.y+10, this.SIZE, colours.BLACK).setAlpha(0.3);
        state.graphic = this.scene.add.circle(state.x, state.y, this.SIZE, colours.WHITE);
        state.graphic.setStrokeStyle(this.THICKNESS, colours.BLACK, 1).setInteractive();
        state.graphic.parent = state;
        

        if (state.accepting){
            state.graphic.inner = this.scene.add.circle(state.x, state.y, this.SIZE/1.3, colours.WHITE);
            state.graphic.inner.setStrokeStyle(this.THICKNESS, colours.BLACK, 1);
        }

        // Record of where state is connected to
        state.keys = [];
    }

    /** 
     * First half of computation, resets previous state and checks for empty word 
     * @param {string} currState - name of current state 
     * @param {String} word - Current word for computation
     * @param {String} key - Key for previous transition
    */
    resetPreviousState(currState, word, key){
        
        // Set previous state to black
        const prevState = this.states[currState];
        prevState.graphic.setStrokeStyle(3, colours.BLACK, 1);
        prevState.graphic.setFillStyle(colours.WHITE, 1);

        if (prevState.accepting){ 
            prevState.graphic.inner.setFillStyle(colours.WHITE, 1);
            prevState.graphic.inner.setStrokeStyle(3, colours.BLACK, 1);
        }

        // Set previous label to black
        if (key){
            this.scene.transitions.transitionObjects[key].label.setColor(colours.TEXTWHITE);
        }
        
        // Check if word is empty. If so, end computation
        if (!word){
            this.terminatePath()
            
        } else {
            this.scene.time.delayedCall(60, this.computation, [currState, word], this);
        }
    }

    /** 
     * Peform a single step of computation 
     * @param {String} prevState - Name of the previous state of the computation 
     * @param {String} word - Current word for computation
     * */
    computation(prevStateName, word){        
        
        if (this.foundAccepting){
            return;
        }

        console.log(prevStateName);
        // Get first symbol of word
        let symbol = word[0];
        word = word.slice(1);
        let prevState = this.getState(prevStateName);
        
        // Exit if transition over symbol is not defined
        if (!(symbol in prevState.transitions) && !("ε" in prevState.transitions)){

            // Colour state red
            prevState.graphic.setFillStyle(colours.RED, 1);
            if (prevState.accepting){
                prevState.graphic.inner.setFillStyle(colours.RED, 1);
            }
            this.terminatePath()
            
            return;
        }
        
        if (symbol in prevState.transitions){
            // Index transitions of state based on symbol
            let states = prevState.transitions[symbol]; 
            
            // Increment current paths by branching of node - if only one path, do not increment
            this.currentPaths += (states.length-1)

            for (let currState of states){ 
                this.takeComputationPath(currState, prevStateName, word)
            }
        }

        if ("ε" in prevState.transitions){
            word = symbol + word;
            for (let currState of prevState.transitions['ε']){
                this.takeComputationPath(currState, prevStateName, word)
            }
        }

        // Draw computed word for level one
        if (this.scene.scene.key === "Level1"){
            this.scene.drawComputedWord();
        }
    
    }

    /**
     * 
     * @param {String} currState - State name after reading transition
     * @param {String} prevStateName - State name before reading transition
     * @param {String} word - Current word
     */
    takeComputationPath(currState, prevStateName, word){

            let state = this.getState(currState);
            
            // Highlight transition
            const key = createKey(prevStateName, currState);
            const label = this.scene.transitions.transitionObjects[key].label;
            // Ensure that label is not a dropDownMenu object
            if (label.type === "Text"){
                label.setColor(colours.TEXTRED);
            }

            // Colour state green or red is word is empty, having taken tranition
            if (!word){
                
                // Change to green if accepting, red if not
                if (state.accepting){
                    state.graphic.setFillStyle(colours.GREEN, 1);
                    state.graphic.inner.setFillStyle(colours.GREEN, 1);
                    this.foundAccepting = true;
                    this.endComputation(true);
                    return;
                }
                else{
                    state.graphic.setFillStyle(colours.RED, 1); 
                    this.terminatePath();
                    
                }
            }
            
            // Continue computation
            else{
                // Highlight current state in yellow;
                state.graphic.setFillStyle(colours.YELLOW, 1);
                if (state.accepting){ // Check if state has inner ring
                    state.graphic.inner.setFillStyle(colours.YELLOW, 1);
                }
                // Delay next step of compuation to allow for visual display
                this.scene.time.delayedCall(500, this.resetPreviousState, [currState, word, key], this);
            }
    }
    
    /** Reset all states and transitions to standard colours */
    clearStates(){
        
        for (let s in this.states){            
            
            let state = this.states[s];
            state.graphic.setStrokeStyle(this.THICKNESS, colours.BLACK, 1);
            state.graphic.setFillStyle(colours.WHITE, 1);
            if (state.accepting){
                state.graphic.inner.setStrokeStyle(this.THICKNESS, colours.BLACK, 1);
                state.graphic.inner.setFillStyle(colours.WHITE, 1);
            }
        }

        for (let key in this.scene.transitions.transitionObjects){
            this.scene.transitions.transitionObjects[key].label.setColor(colours.TEXTWHITE);
        }

        this.scene.computing = false;
    }

    stopComputation(){
        this.clearStates();
        this.scene.time.removeAllEvents();
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
            state.controlPoints = {}
            state.keys.forEach((key) => {
                let [s1, s2] = splitKey(key);
                if (s1 === state.name && !sameState(key)){
                    state.controlPoints[s2] = this.scene.transitions.transitionObjects[key].point.getPosition();
                }
            });
            
        });
    }

    /** 
     * Check whether all states have been used  
     * @returns {boolean} True if all states have a transition coming to/from them, false if not.
    */
    allStatesUsed(){
        for (let s in this.states){
            let state = this.states[s];
            if (state.keys.length === 0) { return false }
        }
        return true;
    }

    /**
     * Checks whether automaton is deterministic. Conditions are:
     * 1: every symbol in the alphabet has a defined transition for each state, 
     * 2: there are no ε-transitions defined,
     * 3: each symbol has only one transition for each state.
     * @returns {boolean} True if transition for state is deterministic
    */
    checkDeterministic(){
        
        const deterministicTransition = (state) => {
            
            return (
                Object.keys(state.transitions)
                .every( letter => { return this.scene.alphabet.includes(letter) }, this)

                &&
                this.scene.alphabet
                .every( letter => { return Object.keys(state.transitions).includes(letter) })

                &&
                Object.values(state.transitions)
                .every( transitionList => { return transitionList.length === 1 })
            );
        }
        
        return Object.values(this.states).every(deterministicTransition, this);

    }

    resetState(state){
        state.graphic.x = state.x;
        state.graphic.y = state.y;
        state.shadow.x = state.x + 5;
        state.shadow.y = state.shadow+10;

        if (state.accepting){
            state.graphic.inner.x = state.x;
            state.graphic.inner.y = state.y;
        }


        const keyCopy = [...state.keys];
        
        for (let key of keyCopy){
            this.scene.transitions.removeTransitions(key);
        };

        state.keys = [];
        state.transitions = {};
        
    }

    terminatePath(){
        console.log(this.currentPaths);
        if (this.currentPaths === 1){
            this.endComputation();
        } else {
            this.currentPaths--;
        }
    }

}