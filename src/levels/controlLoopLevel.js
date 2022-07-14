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

        // Increase button
        this.textObjects.increase = this.add.text(650, 400, "Increase", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        this.textObjects.increase.on('pointerup', () => {
            // Cap at 4
            if (this.levelObjects.repeats.num < 4) {this.levelObjects.repeats.num += 1};
        });
        
        // Decrease button
        this.textObjects.decrease = this.add.text(650, 450, "Decrease", {fontSize: '30px', color: '#ffffff'}).setInteractive();
        this.textObjects.decrease.on('pointerup', () => {
            console.log('click')
            if (this.levelObjects.repeats.num > 0){ this.levelObjects.repeats.num -= 1; }
        });  
    }
 }