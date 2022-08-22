import colours from "/src/utils/colours.js"
import "/src/typedefs/typedefs.js"
import { drawTriangle } from "/src/utils/utils.js"

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
        
        this.data = data;
        this.scene = scene;
        
        this.name = data.name;
        this.children = data.children;
        this.type = data.type;
        this.data = data.data;
        this.controlPoints = data.controlPoints;
        
        this.levelDict = this.createLookUpDict();
        
        this.active = false;
        this.passed = false;
        
        let shadow = this.scene.add.circle(this.x+5, this.y+10, 31, colours.BLACK).setAlpha(0.3);
        this.graphic = this.scene.add.circle(this.x, this.y, 30, colours.BLACK).setInteractive();
        
        if (data.tutorial){
            this.text = scene.add.text(this.x, this.y, "?", { fontFamily: 'Quantico', fontSize: '50px', color: colours.TEXTBLACK}).setOrigin(0.5);
        }   

        this.graphic.setStrokeStyle(3, colours.BLACK, 1);
        
        // Interactivity
        this.graphic.on('pointerup', () => {
            this.selectNode();
        });
    }

    /** Enables the node */
    enable(){
        this.graphic.setFillStyle(colours.WHITE);
        this.active = true;
        return this;
    }
    /** Enables the child nodes of current node */
    enableNextNodes(){
        
        if (this.passed){
            this.graphic.setFillStyle(0x80ff77);
        }
        
        const startPoint = this.getPosition();
        for (let node of this.children){
            let child = this.scene.nodes[node];
            child.enable();

            let endPoint = child.getPosition();
            let midPoint = this.getControlPoint(child);

            const line = new Phaser.Curves.QuadraticBezier(startPoint, midPoint, endPoint);
            line.draw(this.scene.graphics);
            
            // Add arrow head
            this.addDirectionArrow(line, child);
        }

        return this;
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
        
        if (this.controlPoints && this.controlPoints[targetNode.name]){
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

    /** Handles interaction when player clicks on a node */
    selectNode(){
        
        // Start level if node is already selected
        if (this.scene.prevNode){
            if (this.scene.prevNode === this && this.active){
                this.scene.scene.sleep('LevelSelect');
                
                const levelData = this.levelDict[this.type];
                this.scene.scene.run(levelData.scene, levelData.data)

            } else {
                if (this.scene.prevNode.active){
                    
                    let colour = this.scene.prevNode.passed ? 0x80ff77 : colours.WHITE
                    
                    this.scene.prevNode.graphic.setFillStyle(colour, 1);
                }
                this.scene.prevNode = this;
            }
        }
        
        if (this.active){
            this.graphic.setFillStyle(colours.YELLOW, 1)
        }

        this.scene.cameras.main.pan(this.x, this.y, 500);        
        this.scene.prevNode = this;
        this.scene.UI.back.visible = true;
    }

    /**
     * Returns a dictionary with the name and data for each level type
     * @returns {Object} Object with scene and data properties for each type
     */
    createLookUpDict(){
        return {
            loop: {
                scene: "ComputerLoopLevel", 
                data: {automata:this.data.automata, word:this.data.word, language:this.data.language, repeats: this.data.repeats, lines:this.data.lines}
            },
            create: {
                scene: 'CreateLevel', 
                data: {inputAutomata:this.data.automata, words:this.data.words, alphabet: this.data.alphabet, language:this.data.language, deterministic:this.data.deterministic, loop:this.data.loop}
            },
            writeWord: {
                scene: "AddWordLevel",
                data: {automata:this.data.automata, language:this.data.language, grammar: this.data.grammar, message: this.data.message}
            },
            nonRegular: {
                scene: 'Non_RegularLevel', 
                data: {language:this.data.language, grammar: this.data.grammar, tutorial: this.data.tutorial, numStates: this.data.numStates, posKey:this.data.posKey}
            },
            opening: {
                scene: "OpeningScene", 
                data: {automata:this.data.automata, word: this.data.word, language: this.data.language, lines: this.data.lines }
            },
            loopTutorial: {
                scene: "LoopTutorial",
                data: {automata:this.data.automata, word:this.data.word, language:this.data.language, repeats: this.data.repeats}
            },
            createTutorial: {
                scene: 'CreateTutorial',
                data: {automata:this.data.automata, words:this.data.words, alphabet: this.data.alphabet, language:this.data.language, message: this.data.message}
            }

        }
    }
}