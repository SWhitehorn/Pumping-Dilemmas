import lowerUIBox from "./lowerUIBox.js";
import colours from "../../utils/colours.js";
import popUp from "./popUp.js";

/**
 * Adds UI for adding word
 * @param {Scene} scene - Phaser scene to add UI to
 */
export default (scene) => {
    
    const extraWidth = scene.scene.key==="Non_RegularLevel" ? 100 : 0;

    // Section containing word
    const createMiddle = (sizer) => {
        const scene = sizer.scene;
        return scene.rexUI.add.sizer(
            {
                orientation: 'x',
                width: 350 + extraWidth
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tl:30}, 0xDCF0FD).setStrokeStyle(3, 0x010A12))
    }

    // Section containing play button
    const createRight = (sizer) => {
        
        const scene = sizer.scene;
        
        return scene.rexUI.add.sizer(
            {
                orientation: 0,
                x: 0,
                y: 0,
                width: 50,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12))
            .add(scene.rexUI.add.label(
                {
                    background: scene.rexUI.add.roundRectangle(0, 0, 1, 1, 5),
                    icon: scene.add.triangle(0, 0, 0, -5, 20, 10, 0, 25, colours.WHITE)
                        .setStrokeStyle(3, 0x010A12).setInteractive().on('pointerup', () => {
                            
                            if (scene.scene.key === "Non_RegularLevel"){
                                if (scene.CYK.testMembership(scene.word)){
                                    
                                    // Word must be longer than pumping length
                                    if (scene.word.length > scene.numStates){

                                        // Advance to second stage
                                        scene.scene.stop();
                                        scene.scene.start('Non_RegularSelectRepeats', {
                                            word: scene.word,
                                            grammar: scene.grammar,
                                            language: scene.language,
                                            tutorial: scene.tutorial,
                                            numStates: scene.numStates,
                                            posKey: scene.posKey
                                        });
                                    } else {
                                        popUp(["The word needs to be longer than " + scene.numStates + " letters long"], scene)
                                    }  
                                    
                                } else {
                                    popUp(["That word isn't in the language!"], scene);
                                }
                            } else if (scene.scene.key === "AddWordLevel"){
                                scene.startComputation();
                            }
                        })
                    
                }), {proportion: 0, expand: false, padding: {left: 20}, key: 'label'})
    }

    let sizer = lowerUIBox(scene);
    
    sizer.add(createMiddle(sizer), {expand: true, key: 'middle'})
    .add(createRight(sizer), {expand:true, key: 'right'});  

    // Set play button to red when pointer is over
    const play = sizer.getElement('right').getElement('label').getElement('icon');
    play.on('pointerover', () => {
        play.setFillStyle(colours.RED, 1)
    });
    play.on('pointerout', () => {
        play.setFillStyle(colours.WHITE, 1)
    });
    
    
    const textBox = scene.add.rectangle(380, 460, (230+(extraWidth*1.2)), 50, colours.WHITE).setStrokeStyle(3, colours.BLACK);
    scene.textEntry = scene.add.text(380, 460, scene.word, { fontSize: '40px', color: colours.TEXTBLACK, fontFamily: 'Quantico'}).setOrigin(0.5);
    
    const maxLetters = scene.scene.key === "Non_RegularLevel" ? 12 : 8

    // Text entry
        // scene.input.keyboard.on('keydown', (event) => {
        //     if (scene.scene.key === 'OpeningScene' || (!scene.computing)){ // Disable text entry when computation is happening
        //         // Backspace: Remove final character
        //         if (event.keyCode === 8 && scene.word.length > 0) { 
        //             scene.word = scene.word.substr(0, scene.word.length - 1);
                
        //         // Add key to text
        //         } else if ((event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) 
        //             && scene.word.length < maxLetters) {
        //             scene.word = (scene.word + event.key).toLowerCase();                
        //         }
        //     }
        // });

        scene.hiddenInputText = scene.plugins.get('rexhiddeninputtextplugin').add(scene.textEntry, {
            type: 'text',
            enterClose: false,
            cursor: "I",

            onUpdate: ((text, textObject, hiddenInputText) => {
                
                text = text.toLowerCase();
                scene.word = text;
                return text;
            })
        });
        
        scene. hiddenInputText.setMaxLength(maxLetters);
        scene.hiddenInputText.open();
    return sizer;
}