import colours from "../colours.js";
import "../typedefs/typedefs.js";
import { drawTriangle } from "../utils.js";

export default class LevelNode {
    

    SIZE = 30
    TRISIZE = 15

    /**
     * Creates new level node instance
     * @param {Scene} scene - Phaser scene
     * @param {Object} data - Object containing data for node
     */
    constructor(scene, data){
        this.x = data.x;
        this.y = data.y;
        this.scene = scene;
        this.name = data.name;
        this.children = data.children;
        this.type = data.type;
        this.data = data.data;
        this.controlPoints = data.controlPoints;
        
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
                    this.scene.scene.run('LoopLevel', {automata:this.data.automata, word:this.data.word[0], language:this.data.language, repeats:this.data.repeats});
                } else {
                    scene.prevNode = this;
                }
            }
            
            scene.cameras.main.pan(this.x, this.y, 500);
            scene.prevNode = this;

        });
    }

    /** Enables the node */
    enable(){
        this.graphic.setFillStyle(colours.WHITE);
        this.active = true;
    }
    /** Enables the child nodes of current node */
    enableNextNodes(){
        
        const startPoint = this.getPosition();
        for (let node of this.children){
            let child = this.scene.nodes[node]
            child.enable();

            let endPoint = child.getPosition();
            let midPoint = this.getControlPoint(child);

            const line = new Phaser.Curves.QuadraticBezier(startPoint, midPoint, endPoint);
            line.draw(this.scene.graphics);
            
            // Add arrow head
            this.addDirectionArrow(line, child);
        }
    }

    /**
     * Returns position of node
     * @returns {Point} Object with position of node
     */
    getPosition(){
        return {x: this.x, y: this.y};
    }

    /**
     * Gets point to draw transition through
     * @param {LevelNode} targetNode - end node of transition
     * @returns {Point} Point to draw line through 
     */
    getControlPoint(targetNode){
        console.log(targetNode);
        console.log(this.controlPoints['node1']);
        if (this.controlPoints[targetNode.name]){
            return this.controlPoints[targetNode.name];
        } else {
            return Phaser.Geom.Point.Interpolate(this.getPosition(), targetNode.getPosition(), 0.5);
        }
    }

    /**
     * Adds a direction arrow to line
     * @param {Quadratic Bezier} line - line to draw arrow on
     * @param {LevelNode} node - node to point to 
     */
    addDirectionArrow(line, node){
    
        // Calculate distance along line
        const percent = this.SIZE / line.getLength();
    
        const intersectPoint = line.getPointAt(1 - percent);
    
        const tri = new Phaser.Geom.Triangle.BuildEquilateral(intersectPoint.x, intersectPoint.y, this.TRISIZE); 

        // Rotate triangle to match gradient of line
        const angleLine = new Phaser.Geom.Line(intersectPoint.x, intersectPoint.y, node.x, node.y);
        let angle = Phaser.Geom.Line.Angle(angleLine); // Rotate triangle to match angle of line
        angle += 1.571; // Rotate 3/4 of circle
        Phaser.Geom.Triangle.RotateAroundXY(tri, intersectPoint.x, intersectPoint.y, angle);
        drawTriangle(this.scene, tri);
    }
}