import colours from "../colours.js";
import "../typedefs/typedefs.js"
import { sameState } from "../utils.js";

export default (scene, point, input, transitionPoint) => {

    const COLOR_PRIMARY = 0x4e342e;
    const COLOR_LIGHT = 0x7b5e57;
    const COLOR_DARK = 0x260e04;

    let options = scene.alphabet;
    const createTextObject = function (scene, text) {
        return scene.add.text(0, 0, text, { fontSize: 20 })
    }

    let menu = scene.rexUI.add.dropDownList({
        
        x: point.x, y: point.y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 5, COLOR_PRIMARY),
        icon: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_LIGHT),
        text: createTextObject(scene, input),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
        },
              
        options: options,

        list: {
            
            createBackgroundCallback: function (scene) {
                return scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY);
            },
            
            createButtonCallback: function (scene, option, index, options) {
                let text = option;
                
                let background = scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0);
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
                scene.transitions.removeTransitions(point.startState, point.endName, point.key);
            }
        }
    });
    
    return menu;
}
