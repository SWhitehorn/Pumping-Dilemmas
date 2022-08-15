import colours from "/src/utils/colours.js"
import TransitionPoint from "../transitionPoint.js";
import "/src/typedefs/typedefs.js"
import { sameState } from "/src/utils/utils.js"

/**
 * Creates a drop down menu for selecting letters.
 * @param {Scene} scene - Phaser Scene object
 * @param {Point} point - Initial x,y position of menu
 * @param {string} input - Starting input for transition
 * @param {TransitionPoint} transitionPoint - Object with data about transition
 * 
 */
export default (scene, point, input, transitionPoint) => {

    const COLOR_PRIMARY = colours.LIGHTBLUE;
    const COLOR_LIGHT = colours.WHITE;
    const COLOR_DARK = colours.DARKBLUE;

    // Option for each of the letters in the alphabet
    let options = scene.deterministic ? [...scene.alphabet, 'Remove'] : [...scene.alphabet, 'ε', 'Remove']
    const width = (options.length-1) * 15;
    
    // Returns text object
    const createTextObject = function (scene, text) {
        return scene.add.text(0, 0, text, { fontSize: 20, color: colours.TEXTBLACK, fontFamily: 'Quantico'});
    }

    let menu = scene.rexUI.add.dropDownList({
        
        x: point.x, y: point.y,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 5, COLOR_PRIMARY).setStrokeStyle(2, 0x010A12),
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
                
                // Outline if option is included
                if (this.text.includes(option)){
                    background.setStrokeStyle(2, colours.BLACK);
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
                if (button.text === "Remove"){
                    //this.parentPoint.destroy(); // Will also destroy menu
                    scene.transitions.removeTransitions(this.parentPoint.key);
                } else {
                    this.parentPoint.changeInput(button.text);
                }
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
            }
        } 
    });
    
    return menu;
}
