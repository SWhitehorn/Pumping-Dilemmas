import colours from "../colours.js";
import LevelNode from "./levelNode.js";
import menuData from "./menuData.js";

/**
 * @typedef {Object} Input
 * @property {boolean} passed - Indicates whether player passed previous level
 */

export default class LevelSelect extends Phaser.Scene {

    count = []
    nodes = {}
    created = false
    prevNode = null;

    constructor(){
        super('LevelSelect');
    }

    preload(){
        this.load.plugin('rexdropshadowpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdropshadowpipelineplugin.min.js', true);
    }

    /**
     * 
     * @param {} accepted 
     */
    create({passed}){
        
        console.log(passed);

        // Prevent objects being recreated
        if (!this.created){
            this.graphics = this.add.graphics({ lineStyle: { width: 3, color: colours.BLACK } })
            const [width, height] = [800, 600];
            this.cameras.main.setBounds(0, 0, width*2, height*2);
            //this.cameras.main.centerOn(600, 300)

            
            for (let key in menuData){
                const data = menuData[key];
                console.log(data);
                this.nodes[data.name] = new LevelNode(this, data);
            }
            
            const start = this.nodes['node0'];
            start.enable();  
            
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

    
    

}