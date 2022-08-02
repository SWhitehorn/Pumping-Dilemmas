import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"

import LevelNode from "/src/objects/components/levelNode.js"
import menuData from "/assets/data/menuData.js"

/**
 * @typedef {Object} Input
 * @property {boolean} passed - Indicates whether player passed previous level
 */

export default class LevelSelect extends Phaser.Scene {

    count = []
    nodes = {}
    UI = {}
    created = false
    prevNode = null;

    constructor(){
        super('LevelSelect');
    }

    preload(){
        this.load.image('backArrow', '../assets/backArrow.png');
    }

    /**
     * @param {Input} 
     */
    create({passed}){
        
        // Prevent objects being recreated
        if (!this.created){
            this.graphics = this.add.graphics({ lineStyle: { width: 3, color: colours.BLACK } })
            const [width, height] = [800, 600];
            this.cameras.main.setBounds(0, 0, width*2, height*2);
            
            this.addUI();
            
            for (let key in menuData){
                const data = menuData[key];
                this.nodes[data.name] = new LevelNode(this, data);
            }
            
            const start = this.nodes['node0'];
            start.enable(); 
            start.enableNextNodes(); 
            this.nodes['node2'].enable().enableNextNodes();
            
            // Add start arrow
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(start.x-30, start.y, 16);
            Phaser.Geom.Triangle.RotateAroundXY(tri, start.x-30, start.y, 1.571);
            this.graphics.fillStyle(colours.BLACK);
            this.graphics.fillTriangleShape(tri);
            this.graphics.strokeTriangleShape(tri);
            
            this.created = true;  
        }

        if (passed){
            this.prevNode.enableNextNodes()
        }

    }

    update(){

    }

    /**
     * Adds non-node objects to screen
     */
    addUI(){
        this.UI.back = this.add.image(750, 30, 'backArrow').setInteractive().setScrollFactor(0);
        this.UI.back.visible = false;
        this.UI.back.on('pointerup', () => {
                this.cameras.main.pan(400, 250, 500);
                this.prevNode = null;
                this.UI.back.visible = false;
            });    

        this.UI.start = this.add.text(20, 200, "Start", { fontSize: '50px', color: colours.TEXTWHITE }).setInteractive();
        this.UI.start.on('pointerup', () => {
            this.nodes['node0'].selectNode();
        });

        this.UI.debug = this.add.text(20, 275, "Debug", { fontSize: '30px', color: '#ffffff' }).setInteractive();
        this.UI.debug.on('pointerup', () => {
            this.scene.start('IntroScene');
        });
    }    

}