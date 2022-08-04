import textBox from "/src/objects/components/textBox.js";
import Level from "/src/scenes/levelTemplate.js";

export default class OpeningScene extends Level {

    constructor(){
        super('OpeningScene');
    }

    preload(){
        super.preload();
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    }

    create(){
        super.create();
        textBox(this);
        
    }
}