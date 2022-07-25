import Level from "../levelTemplate.js";
import { getNextLetter, createKey } from "../../utils.js";
import "../../typedefs/typedefs.js";


/**
 * @typedef {Object} Input
 * @property {Automata} automata - Input automata
 * @property {string} word - Input word
 * @property {string[]} alphabet - Array of characters allowed in alphabet
 * @property {string} language - String defining the language for the level
 */

/**
 * Level creator for draggable automata
 * @class
 * @extends Level
 */
export default class CreateLevel extends Level {

    inputAutomata = {}

    constructor(key){
        if (key){
            super(key);
        } else {
            super('CreateLevel');
        }
    }

    /**
     * 
     * @param {Input}
     * @extends Level.create 
     */
    create({automata, words, alphabet, language}){
        
        // Store original word and automata to allow for reseting
        this.words = words;
        this.inputAutomata = structuredClone(automata);
        
        this.alphabet = alphabet;

        // Flags
        this.draw = false; // Flag for whether the player is currently drawing transition
        this.interactive = true; // Flag for whether player can interact with automata
        
        
        super.create(this.inputAutomata, language);
        this.transitions.setInteractive();
        
        this.input.mouse.disableContextMenu(); // Allow for right clicking
        
        this.next = this.add.text(700, 100, "", { fontSize: '30px', color: '#ffffff' }).setInteractive();
        
        this.next.on('pointerup', () => {
            if (!this.computing) {
                this.automata.bakeAutomata();
                this.scene.start('TestCreateLevel', {automata:this.automata, words:this.words, language}); 

            };
          });


        // Iterate through states
        for (let stateName in this.automata.states){
            let state = this.automata.states[stateName];
            this.input.setDraggable(state.graphic);
            
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
                    
                }
            });
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

        if (this.automata.allStatesUsed()){
            this.next.text = "next";
        } else {
            this.next.text = "";
        }
    }
    
    /**
     * Enables states and transition points to be dragged
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

            // Object is menu
            if (object.isMenu){
                object.parentPoint.setPosition(pointer.x, pointer.y);
            } else {
                object.parent.shadow.x = pointer.x+5;
                object.parent.shadow.y = pointer.y+10;
            }
        });

        this.input.on('dragstart', (pointer, object, dragX, dragY) => {
            
            if (object.isMenu){
                let TP = object.parentPoint;
                
                TP.dragging = true;
                TP.active = true;
                object.disableClick();
            
            // Object is a state 
            } else {
                
                // Sets transitions going to state to update
                const state = object.parent;
                for (let key of state.keys){
                    const transitionObjects = this.transitions.getAllObjects();
                    // Remove letter menu if present 
                    if (transitionObjects[key].point.hasOwnProperty('letterArray')){
                        transitionObjects[key].point.removeLetters();
                    }
                    
                    this.transitions.transitionObjects[key].point.active = false;
                    // Flag that position needs to be updated
                    this.transitions.setToUpdate(key);
                }
            }
        });

        this.input.on('dragend', (pointer, object, dragX, dragY) => {
            
            if (object.isMenu){
                // Delay reseting dragging flag to allow for pointerup without registering as clicking
                this.time.delayedCall(50, () => {object.parentPoint.dragging = false; object.enableClick();}, [], this);
            
            // Object is a state
            } else{ 
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
        let input = this.alphabet[0];
        while (this.firstState.state.transitions.hasOwnProperty(input)){
            input = getNextLetter(input, this.alphabet);
            // Check for alphabet wrapping around
            if (input === this.alphabet[0]){
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