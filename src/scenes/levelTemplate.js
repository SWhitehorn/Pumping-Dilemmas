import colours from "/src/utils/colours.js";
import Transitions from "/src/objects/transitions.js";
import Automata from "/src/objects/automata.js";
import "/src/typedefs/typedefs.js"
import topUIBox from "/src/objects/components/topUIBox.js";

/**
 * Template for levels, handles common features. Extended by others to provide specific functionality.
 * @Class
 */
export default class Level extends Phaser.Scene {

    // Flags common to all scenes
    computing = false;
    repeat = false;
    interactive = false;

    constructor (key) {
        
        const sceneConfig = {
            key: key,
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
        this.load.image('computerIcon', '/assets/computer-80.png')

        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.plugin('rexroundrectangleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexroundrectangleplugin.min.js', true);
        


        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        let config = {
            google: {
                families: ['Quantico']
            }
        };
        this.load.rexWebFont(config);
    }


    /**
     * Creates objects present in all levels
     * @param {Automata} automata 
     * @param {String} language - String describing languaged 
     */
    create (automata, language) {
        
        this.graphics = this.add.graphics({ lineStyle: { width: 3, color: colours.BLACK } });
        this.cameras.main.setRoundPixels(true);
        this.textObjects = {};

        this.addLanguage(language);
        
        // Render automata to screen
        if (automata){
            // Create automata
            this.automata = new Automata(automata, this);
        
            // Render each state on canvas, set interactivity
            for (let s in this.automata.states){
                this.automata.addStateGraphic(s);
            }

            this.transitions = new Transitions(this.graphics, this.automata, this);
            
        }
        
        
    }

    setHighlights(state){
        state.graphic.on('pointerover', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, colours.RED, 1);
        })
        
        state.graphic.on('pointerout', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, colours.BLACK, 1);
        })
    }

    /** Called to start the computation process */
    startComputation(){
        
        this.automata.getStart().graphic.setStrokeStyle(3, colours.YELLOW, 1);
        if (this.automata.getStart().accepting){
            this.automata.getStart().graphic.inner.setStrokeStyle(3, colours.YELLOW, 1);
        }

        // Check for empty word
        if (this.word){
            this.computing = true;
            const startName = this.automata.getStart(true)
            this.time.delayedCall(500, this.automata.resetPreviousState, [startName, this.word], this.automata);
        }
        
        // Handle empty word
        else{
            
            this.time.delayedCall(500, () => {
                if (this.automata.getStart().accepting){
                    this.automata.getStart().graphic.setFillStyle(colours.GREEN, 1);
                    this.automata.getStart().graphic.inner.setFillStyle(colours.GREEN, 1);
                } else{
                    this.automata.getStart().graphic.setFillStyle(colours.RED, 1);
                }
                this.endComputation();
            }, [], this)
            
            
        }
    }

    /** 
     * Called to end the computation process 
     * @param {boolean} accepted - Indicates whether computation ended in an accepting state. Null if not.
    */
    endComputation(accepted){

        // Reset word
        this.word = Boolean(this.inputWord) ? this.inputWord : this.word
                
        this.time.delayedCall(500, this.automata.clearStates, [], this.automata)
        
        if (this.repeat && !this.testsStarted){ 
            this.time.delayedCall(1000, this.startComputation, [], this); 
        }
    }

    /**
     * Adds text describing language to scene.
     * @param {String} language - String describing language
     */
    addLanguage(language){
        topUIBox(this, language).layout();    
    }

    
}

