import Colours from "./colours.js";
import { isEmpty } from "./utils.js";
import "./typedefs/typedefs.js"
import { sameState } from "./utils.js";

/**
 * Class defining interactive points on transition
 * @class
 */
export default class TransitionPoint {

    selected = false;
    dragging = false;
    SIZE = 8;
    inputs = [];
    
    /**
     * Creates new point
     * @param {number} x - x position of point 
     * @param {number} y - y position of points
     * @param {Object} scene - Phaser scene that point belongs to
     * @param {string} key - Key for transition 
     * @returns {TransitionPoint} This
     */
    constructor(x, y, scene, key){
        
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.key = key;

        this.graphic = this.scene.add.circle(x, y, this.SIZE, Colours.BLACK).setInteractive();
        this.graphic.parent = this;
        this.graphic.isTransitionPoint = true;
        this.update = false;

        this.graphic.on('pointerup', (pointer) => {
                
           // Delete transition if right button is clicked
            if (pointer.rightButtonReleased()){
                
                console.log('rightbutton');
                if (!this.scene.draw){
                    this.destroy();

                    this.scene.transitions.removeTransitions(this.startState, this.endName, this.key);
                }
            
            
            // Left mouse: enable user to change the letters on the transition
            } else if (!this.dragging){
                
                console.log('clicked');

                if (this.selected){
                    this.removeLetters();
                    
                    // Delete transition if empty
                    if (this.isEmptyTransition(this.startState.transitions)){
                        this.destroy();
                    }
                }
                
                this.selected = !this.selected;
            }
        });

        return this;
    }

    /** 
     * Returns co-ordinates of point 
     * @returns {Point} Point containing x and y properties of transitionPoint
    */
    getPosition(){
        return {x:this.x, y:this.y};
    }

    /**
     * Set position of transition point
     * @param {number} x - x position to set to 
     * @param {number} y - y position to set to
     * @returns {TransitionPoint} This
     */
    setPosition(x, y){

        // Allow for method to be called with object with x and y properties
        if (!y && typeof x === 'object' && x.hasOwnProperty('y')){
            y = x.y;
            x = x.x;
        }

        this.x = x;
        this.y = y;

        this.graphic.x = x;
        this.graphic.y = y;

        return this;
    }

    /**
     * Enables drag for transition point
     */
    setDraggable(){
        this.scene.input.setDraggable(this.graphic);
        return this;
    }

    /**
     * Destroys point
     */
    destroy(){
        this.removeLetters();
        this.scene.automata.removeKey(this.key);
        this.graphic.destroy();
        this.scene.transitions.transitionObjects[this.key].label.destroy();
        delete this.scene.transitions.transitionObjects[this.key];
    }

    /**
     * Adds given input symbol to transitionPoint array
     * @param {string} input - symbol to add to transition 
     */
    addInput(input){
        this.inputs.push(input);
        return this;
    }

    /**
     * Set start state of transition
     * @param {State} startState - Starting state of transition
     * @returns {transitionPoint} This
     */ 
    setStart(startState){
        this.startState = startState;
        return this;
    }

    /**
     * Set end state of transition
     * @param {State} end - End state of transition 
     * @param {string} endName - String with code of end state
     * @returns {TransitionPoint} - This
     */
    setEnd(end, endName){
        this.endState = end;
        this.endName = endName;
        return this;
    }

    /**
     * Create menu of clickable letters
     */
    createLetters(){
        
        this.letterArray = [];
        
        for (let i = 0; i < this.scene.alphabet.length; i++){
        
            this.renderLetter(this.scene.alphabet[i], i);
            
            this.letterArray[i].setInteractive().on('pointerup', () => {

                const transitions = this.startState.transitions;
                let letter = this.letterArray[i].text

                if (transitions.hasOwnProperty(letter)){
                    
                    const index = transitions[letter].indexOf(this.endName);

                    // Transition between states over letter is defined, remove it
                    if (index != -1){
                        
                        transitions[letter].splice(index, 1);
                        this.inputs.splice(this.inputs.indexOf(letter), 1);
                        
                        // Delete data if array is empty
                        if (transitions[letter].length === 0){
                            delete transitions[letter];

                        }
                    
                    // Transition over input is defined, but not to end state
                    } else {
                        transitions[letter].splice(0, 0, this.endName);
                        this.inputs.push(letter);
                    }
                
                // Transition over input is not defined, create new transition
                } else {
                    transitions[letter] = [this.endName];
                    this.inputs.push(letter);
                }

                // Remove letterArray property
                this.removeLetters();
            });
        }
    } 


    /**
     * Render letter in green if part of transition, red if not
     * @param {string} letter - single letter
     * @param {number} i - position of letter
     */
    renderLetter(letter, i){
        
        const y = sameState(this.key) ? this.y-30 : this.y;
        
        // Render letter in green if included in transition
        if (this.startState.transitions.hasOwnProperty(letter) && this.startState.transitions[letter].includes(this.endName)){
            this.letterArray.push(this.scene.add.text(this.x+10 + i*30, y, letter, { fontSize: '30px', color: Colours.TEXTWHITE }));
        
        // Render letter in yellow if not
        } else{
            this.letterArray.push(this.scene.add.text(this.x+10 + i*30, y, letter, { fontSize: '30px', color: "#000000" }));
        }
    }

    /**
     * Remove letter menu if present
     */
    removeLetters(){
        
        if (this.letterArray){
            this.letterArray.forEach((letter) => {letter.destroy()});
            delete this.letterArray;
        }

        // Set normal label to render again
        if (this.scene.transitions.transitionObjects[this.key]){
            this.scene.transitions.transitionObjects[this.key].label.visible = true;
        }
    }

    /**
     * Test whether array of inputs is empty
     * @returns {boolean} Returns true no inputs are present in array
     */
    isEmptyTransition(){
        return (this.inputs.length === 0);
    }

    /**
     * Tests whether given input is defined for point
     * @param {string} input - Single character representing input
     * @returns {boolean} True if input present
     */
    definedOver(input){
        return (this.inputs.indexOf(input) !== -1);
    }
}