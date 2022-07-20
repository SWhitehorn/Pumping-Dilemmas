import colours from "../colours.js";
import LevelNode from "./levelNode.js";
import data from "../data.js";

export default class LevelSelect extends Phaser.Scene {

    constructor(){
        super('LevelSelect');
    }

    create(){
        
        this.graphics = this.add.graphics({ lineStyle: { width: 4, color: colours.BLACK } })

        const [width, height] = [800, 600];
        this.cameras.main.setBounds(0, 0, width*2, height*2);
        //this.cameras.main.centerOn(600, 300)

        let prevCircle;

        let circle2 = new LevelNode(400+500, 100+200, this, [])
        let circle1 = new LevelNode(100+500, 100+200, this, [circle2], data[0], 'loop')
        

        circle1.enable();        
    }

    update(){

    }

}