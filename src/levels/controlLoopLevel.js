import Level from "./levelTemplate.js";
import colours from "../colours.js";
import "../typedefs/typedefs.js";
import LoopLevel from "./loopLevel.js";

/** 
 * Level where player can choose the number of loops
 * @class
 */
 export default class ControlLoopLevel extends LoopLevel{
    
    constructor(){
        super('ControlLoopLevel')
    }

    /** Adds buttons for the player to increase or decrease number of loops */
    create({automata, word, language}){
        super.create({automata, word, language});
        
        this.textObjects.compute.on('pointerup', () => {
            if (!this.computing) {this.startComputation()};
        });

        this.addControlButtons();
    }
 }