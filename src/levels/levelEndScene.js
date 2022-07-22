import colours from "../colours.js";
import "../typedefs/typedefs.js"

export default class LevelEnd extends Phaser.Scene {

    constructor(){
        super('LevelEnd');
    }
    
    create({prevScene}){
        
        this.add.text(400, 250, "Level cleared!", { fontSize: '50px', color: colours.TEXTWHITE }).setOrigin(0.5);
        
        this.input.on('pointerup', () => {
            this.scene.stop(prevScene);
            this.scene.start('LevelSelect', {passed: true})
        })
    }
}