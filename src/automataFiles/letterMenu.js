import colours from "../colours.js";
import TransitionPoint from "./transitionPoint.js";
import "../typedefs/typedefs.js"
import { sameState } from "../utils.js";

/**
 * Creates a drop down menu for selecting letters.
 * @param {Scene} scene - Phaser Scene object
 * @param {Point} point - Initial x,y position of menu
 * @param {string} input - Starting input for transition
 * @param {TransitionPoint} transitionPoint - Object with data about transition
 * 
 */
export default (scene, point, input, transitionPoint) => {

    const COLOR_PRIMARY = colours.BLACK;
    const COLOR_LIGHT = colours.WHITE;
    const COLOR_DARK = colours.DARKBLUE;

    // Option for each of the letters in the alphabet
    let options = scene.alphabet;
    const width = options.length * 20;
    
    // Returns text object
    const createTextObject = function (scene, text) {
        return scene.add.text(0, 0, text, { fontSize: 20 })
    }

    let menu = scene.rexUI.add.dropDownList({
        
        x: point.x, y: point.y,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 5, COLOR_PRIMARY),
        //icon: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_LIGHT),
        text: createTextObject(scene, input).setFixedSize(width, 0),
        align: 'center',
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            text: 10
        },
              
        options: options,
        
        // Details for drop down
        list: {
            
            createBackgroundCallback: function (scene) {
                return scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY);
            },
            
            createButtonCallback: function (scene, option, index, options) {
                let text = option;
                
                let background = scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0);
                
                // Outline in white if option is included
                if (this.text.includes(option)){
                    background.setStrokeStyle(1, colours.WHITE);
                }

                let button = scene.rexUI.add.label({
                    background: background,

                    text: createTextObject(scene, text),

                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                        icon: 10
                    }
                });
                
                return button;
            },

            // scope: dropDownList
            onButtonClick: function (button, index, pointer, event) {
                this.parentPoint.changeInput(button.text);
                console.log(this.parentPoint.inputs);
                
                console.log(this.width);
            },

        },

    });

    menu.setPosition = (point) => {
        menu.x = point.x;
        menu.y = point.y;
    }

    menu.setText = (text) => {
        menu.text = text
    }
    
    menu.parentPoint = transitionPoint;
    
    if (!sameState(menu.parentPoint.key)){
        menu.setDraggable();
    }   

    // 
    
    menu.isMenu = true; 
    menu.dragging = false,

    // Enable player to right click to remove menu
    menu.on('pointerup', (pointer) => {
        
        if (pointer.rightButtonReleased()){
            if (!menu.scene.draw){
                point = menu.parentPoint;
                point.destroy(); // Will also destroy menu
                scene.transitions.removeTransitions(point.key);
            }
        } 
    });
    
    return menu;
}
