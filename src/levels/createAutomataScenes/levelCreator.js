import Level from "../levelTemplate.js";
import "../../typedefs/typedefs.js";
import CreateLevel from "./createLevel.js";
import { splitKey } from "../../utils.js";


/**
 * @typedef {Object} Input
 * @property {Automata} automata - Input automata
 * @property {string} word - Input word
 * @property {string[]} alphabet - Array of characters allowed in alphabet
 * @property {string} language - String defining the language for the level
 */

/**
 * Create automata
 * @class
 * @extends CreateLevel
 */
export default class LevelCreator extends CreateLevel {

    constructor(){
        super('LevelCreator');
    }

    create(data){
        super.create(data);

        const save = this.add.text(10, 10, "Save", { fontSize: '30px', color: '#ffffff' }).setInteractive();
        save.on('pointerup', () => {
            let data = {};
            for (let s in this.automata.states){
                data[s] = this.copyData(s);
            }
            console.log(data);
        })
    }

    /**
     * 
     * @param {string} s - name of state 
     * @returns {Object} Object containing data
     */
    copyData(s){
        let state = this.automata.states[s];
        let object = {};
        object.x = state.graphic.x;
        object.y = state.graphic.y;
        object.accepting = state.accepting;
        object.transitions = state.transitions;
        object.controlPoints = {}
        
        for (let key of state.keys){
            let [s1, s2] = splitKey(key);
            let point = this.transitions.transitionObjects[key].point.getPosition();
            
            if (s === s1){
                object.controlPoints[s2] = point
            }
        }
        
        return object;
    }

}
