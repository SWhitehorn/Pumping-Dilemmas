import colours from "../colours.js";

export default class LevelNode {
    
    /**
     * Creates new level node instance
     * @param {number} x - x position to render node at
     * @param {number} y - y position to render node at
     * @param {Scene} scene - Phaser scene
     * @param {LevelNode[]} children - Array of nodes that this node points to
     * @param {Object} data - Data to load the level with
     * @param {String} type - type of level to load
     */
    constructor(x, y, scene, children, data, type){
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.children = children;
        
        this.active = false;

        this.shadow = this.scene.add.circle(x+10, y+10, 31, colours.BLACK).setAlpha(0.2);
        this.graphic = this.scene.add.circle(x, y, 30, colours.BLACK).setInteractive();
        this.graphic.setStrokeStyle(3, colours.BLACK, 1);
        

        // Interactivity
        this.graphic.on('pointerup', () => {
            
            // Start level if node is already selected
            if (scene.prevNode){
                if (scene.prevNode === this && this.active){
                    this.scene.scene.sleep('LevelSelect');
                    this.scene.scene.run('ControlLoopLevel', {automata:data.automata, word:data.word[0], language:data.language});
                } else {
                    scene.prevNode = this;
                }
            }
            
            scene.cameras.main.pan(this.x, this.y, 500);
            scene.prevNode = this;

        });
    }

    enable(){
        this.graphic.setFillStyle(colours.WHITE);
        this.active = true;
    }

    enableNextStates(){
        
        for (let child of this.children){
            child.enable();
            const line = new Phaser.Geom.Line(this.x, this.y, child.x, child.y);
            this.scene.graphics.strokeLineShape(line);
            
            // Add arrow head
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(child.x-29, child.y, 15); 
            Phaser.Geom.Triangle.RotateAroundXY(tri, child.x-29, child.y, Phaser.Math.DegToRad(90));
            this.scene.graphics.fillStyle(colours.BLACK);
            this.scene.graphics.fillTriangleShape(tri);
        }
    }
}