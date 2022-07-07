import Colours from "./colours.js";
import { isEmpty } from "./utils.js";
import "./typedefs/typedefs.js"

/**
 * Class defining interactive points on transition
 * @class
 */
export default class TransitionPoint {

    /**
     * @property {boolean} selected - Indicates whether user has clicked on transition point
     * @property {boolean} dragging - Indicates whether user is dragging the point 
     * @property {number} SIZE - Pixel radius of point
     */
    selected = false;
    dragging = false;
    SIZE = 8;
    
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

        this.graphic.on('pointerup', (pointer) => {
                
           // Delete transition if right button is clicked
            if (pointer.rightButtonReleased()){
                if (!this.scene.draw){
                    this.graphic.destroy();
                    delete this.scene.transitions.transitionPoints[this.key];
                    this.scene.transitions.removeTransitions(this.startState, this.endName);
                }
            
            console.log(this.dragging);
            // Left mouse: enable user to change the letters on the transition
            } else if (!this.dragging){
                
                if (this.selected){
                    this.removeLetters();
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
        this.x = x;
        this.y = y;
        return this;
    }


    /**
     * Enables drag for transition point
     */
    setDraggable(){
        this.scene.input.setDraggable(this.graphic);
    }

    /**
     * Destroys point
     */
    destroy(){
        this.graphic.destroy();
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
        
        for (let i = 0; i < this.scene.language.length; i++){
        
            this.renderLetter(this.scene.language[i], i);
            
            this.letterArray[i].setInteractive().on('pointerup', () => {

                this.selected = false;
                const transitions = this.startState.transitions;
                let letter = this.letterArray[i].text

                if (transitions.hasOwnProperty(letter)){
                    
                    const index = transitions[letter].indexOf(this.endName);

                    if (index != -1){
                        transitions[letter].splice(index, 1);
                        
                        // Delete data if array is empty
                        if (transitions[letter].length === 0){
                            delete transitions[letter];
                            
                            // Delete transition if empty
                            if (isEmpty(transitions)){
                                this.destroy();
                                
                                delete this.scene.transitions.transitionPoints[this.key];
                            }
                        }

                    } else {
                        transitions[letter].splice(0, 0, this.endName);
                    }
                
                // Transition over input is not defined, create new transition
                } else {
                    transitions[letter] = [this.endName];
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
        
        // Check for transition over letter
        if (this.startState.transitions.hasOwnProperty(letter) && this.startState.transitions[letter].includes(this.endName)){
            
            this.letterArray.push(this.scene.add.text(this.x + i*30, this.y, letter, { fontSize: '30px', color: Colours.TEXTGREEN }));
        
        } else{
            this.letterArray.push(this.scene.add.text(this.x + i*30, this.y, letter, { fontSize: '30px', color: Colours.TEXTYELLOW }));
        }
    }

    /**
     * Remove letter menu
     */
    removeLetters(){
        this.letterArray.forEach((letter) => {letter.destroy()});
        delete this.letterArray;
    }
}