import "/src/typedefs/typedefs.js"
import colours from "/src/utils/colours.js"

import LevelNode from "/src/objects/components/levelNode.js"
import menuData from "/assets/data/menuData.js"
import { resetBackground } from "/src/utils/utils.js"

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
        
        const sceneConfig = {
            key: 'LevelSelect',
            pack: {
                files: [{
                    type: 'plugin',
                    key: 'rexwebfontloaderplugin',
                    url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
                    start: true
                }]
            }
        };
        
        super(sceneConfig);
    }

    preload(){
        this.load.image('backArrow', '../assets/backArrow.png');
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);

        this.plugins.get('rexwebfontloaderplugin').addToScene(this);


        let config = {
            google: {
                families: ['Quantico']
            }
        };
        this.load.rexWebFont({google: {families: ['Quantico']}});
    }

    /**
     * @param {Input} 
     */
    create({passed}){
        
        resetBackground(this);

        

        // Prevent objects being recreated
        if (!this.created){
            this.graphics = this.add.graphics({ lineStyle: { width: 3, color: colours.BLACK } })
            const [width, height] = [800, 600];
            this.cameras.main.setBounds(0, 0, width*10, height*3);
            this.cameras.main.centerOn(200, 800)
            
            this.addUI();
            
            for (let key in menuData){
                const data = menuData[key];
                this.nodes[data.name] = new LevelNode(this, data);
            }
            
            
            const start = this.nodes['createTutorial'];
            start.enable();
            
            Object.values(this.nodes).forEach((node) => {
                node.connectNextNodes();
            });

            this.nodes['createNode62'].enable();
            
            // Add start arrow
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(start.x-30, start.y, 16);
            Phaser.Geom.Triangle.RotateAroundXY(tri, start.x-30, start.y, 1.571);
            this.graphics.fillStyle(colours.BLACK);
            this.graphics.fillTriangleShape(tri);
            this.graphics.strokeTriangleShape(tri);
            
            this.created = true;  
        }

        if (passed){
            this.prevNode.passed = true;
            this.prevNode.enableNextNodes()
        }
    }

    update(){

    }

    /**
     * Adds non-node objects to screen
     */
    addUI(){
        this.UI.back = this.add.image(774, 24, 'backArrow').setInteractive().setScrollFactor(0);
        this.UI.back.visible = false;
        this.UI.back.on('pointerup', () => {
                this.cameras.main.pan(400, 800, 750);
                this.prevNode.graphic.setFillStyle(colours.WHITE, 1);
                this.prevNode = null;
                this.UI.back.visible = false;
                this.UI.title.visible = true;
            });    

        this.UI.title = this.add.text(400, 700, "Pumping Dilemmas", { fontFamily: 'Quantico', fontSize: '80px', color: colours.TEXTWHITE }).setOrigin(0.5)
        this.add.rexRoundRectangle(400, 850, 225, 75, 25, colours.DARKBLUE, 1).setStrokeStyle(3, colours.WHITE);
        this.UI.start = this.add.text(400, 850, "Start", { fontFamily: 'Quantico', fontSize: '70px', color: colours.TEXTWHITE }).setOrigin(0.5).setInteractive();
        this.UI.start.on('pointerup', () => {
            this.nodes['createTutorial'].selectNode();
            this.UI.title.visible = false;
        });

        // this.UI.extras = this.add.text(80, 875, "Extras", { fontFamily: 'Quantico', fontSize: '30px', color: '#ffffff' }).setOrigin(0.5).setInteractive();
        // this.UI.extras.on('pointerup', () => {
        //     this.scene.start('IntroScene');
        // });

        this.UI.start.on('pointerover', () => {
            this.UI.start.setColor(colours.TEXTRED);

        });
        this.UI.start.on('pointerout', () => {
            this.UI.start.setColor(colours.TEXTWHITE)
        });

        // this.UI.extras.on('pointerover', () => {
        //     this.UI.extras.setColor(colours.TEXTRED)
        // });
        // this.UI.extras.on('pointerout', () => {
        //     this.UI.extras.setColor(colours.TEXTWHITE)
        // });
    }    

}