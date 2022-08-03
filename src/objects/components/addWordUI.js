import lowerUIBox from "./lowerUIBox.js";
import colours from "/src/utils/colours.js";
import popUp from "./popUp.js";

export default (scene) => {
    
    // Section containing word
    const createMiddle = (sizer) => {
        const scene = sizer.scene;
        return scene.rexUI.add.sizer(
            {
                orientation: 'x',
                width: 350
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
                            
                            
                            
                            if (scene.CYK.testMembership(scene.word)){
                                
                                // Check key to modify effect
                                if (scene.scene.key === "AddWordLevel"){
                                    scene.startComputation();
                                } else if (scene.scene.key === "Non_RegularLevel"){
                                    
                                    if (scene.word.length > scene.numStates){
                                        
                                        const word = scene.word;
                                        const grammar = scene.grammar;
                                        const language = scene.language;
                                        
                                        scene.scene.stop();
                                        scene.scene.start('Non_RegularSelectRepeats', {language, word, grammar});
                                    } else {
                                        popUp(["The word needs to be longer than " + scene.numStates + " letters long"], scene)
                                    }  
                                }
                                
                                
                            } else {
                                popUp(["That word isn't in the language!"], scene);
                            }
                            
                    })
                }
                ), {proportion: 0, expand: false, padding: {left: 20}, key: 'label'})
    }

    let sizer = lowerUIBox(scene);
    
    sizer.add(createMiddle(sizer), {expand: true, key: 'middle'})
    .add(createRight(sizer), {expand:true, key: 'right'});    
    return sizer;
}