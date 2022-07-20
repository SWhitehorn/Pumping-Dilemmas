import colours from "../colours.js";

export default class LevelNode {
    
    /**
     * Creates new level node instance
     * @param {Scene} scene - Phaser scene
     * @param {Object} data - Object containing data for level
     */
    constructor(scene, data){
        this.x = data.x;
        this.y = data.y;
        this.scene = scene;
        this.children = data.children;
        this.type = data.type;
        this.data = data.data;
        
        this.active = false;
        
        let shadow = this.scene.add.circle(this.x+5, this.y+10, 31, colours.BLACK).setAlpha(0.3);
        this.graphic = this.scene.add.circle(this.x, this.y, 30, colours.BLACK).setInteractive();
        

        this.graphic.setStrokeStyle(3, colours.BLACK, 1);
        
        

        // Interactivity
        this.graphic.on('pointerup', () => {
            
            // Start level if node is already selected
            if (scene.prevNode){
                if (scene.prevNode === this && this.active){
                    this.scene.scene.sleep('LevelSelect');
                    this.scene.scene.run('ControlLoopLevel', {automata:this.data.automata, word:this.data.word[0], language:this.data.language});
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
        
        for (let node of this.children){
            console.log(node);
            let child = this.scene.nodes[node]
            console.log(child);
            child.enable();
            const line = new Phaser.Geom.Line(this.x, this.y, child.x, child.y);
            this.scene.graphics.strokeLineShape(line);
            
            // Add arrow head
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(child.x-29, child.y, 15); 
            Phaser.Geom.Triangle.RotateAroundXY(tri, child.x-29, child.y, Phaser.Math.DegToRad(90));
            this.scene.graphics.fillStyle(colours.BLACK);
            this.scene.graphics.fillTriangleShape(tri);
            this.scene.graphics.strokeTriangleShape(tri);
        }
    }
}