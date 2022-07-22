import Colours from "../colours.js";
import Transitions from "../automataFiles/transitions.js";
import Automata from "../automataFiles/automata.js";
import "../typedefs/typedefs.js"

/**
 * Template for levels, handles common features. Extended by others to provide specific functionality.
 * @Class
 */
export default class Level extends Phaser.Scene {

    // Flags
    computing = false;
    repeat = false;
    interactive = false;

    constructor (key) {
        super(key);
    }
    
    preload(){
        this.load.image('backArrow', '../assets/backArrow.png');
    }

    /**
     * Creates objects present in all levels
     * @param {Automata} automata 
     * @param {String} language - String describing languaged 
     */
    create (automata, language) {
        
        this.graphics = this.add.graphics({ lineStyle: { width: 3, color: Colours.BLACK } });
        
        this.textObjects = {};
        this.addLanguage(language)

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
        
        const back = this.add.image(750, 30, 'backArrow').setInteractive();
        back.on('pointerup', () => {
            this.scene.start('LevelSelect');
        });    
    }

    setHighlights(state){
        state.graphic.on('pointerover', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
        })
        
        state.graphic.on('pointerout', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        })
    }

    /** Called to start the computation process */
    startComputation(){
        
        // Check for empty word
        if (this.word){
            
            this.automata.getStart().graphic.setFillStyle(Colours.YELLOW, 1);
            this.computing = true;
            this.automata.currState = this.automata.start;
            this.time.delayedCall(500, this.automata.resetPreviousState, [], this.automata);
        }
        
        // Handle empty word
        else{
            if (this.automata.getStart().accepting){
                this.automata.getStart().graphic.setFillStyle(Colours.GREEN, 1);
                this.automata.getStart().graphic.inner.setFillStyle(Colours.GREEN, 1);
            } else{
                this.automata.getStart().graphic.setFillStyle(Colours.RED, 1);
            }
            this.endComputation();
        }
    }

    /** 
     * Called to end the computation process 
     * @param {boolean} accepted - Indicates whether computation ended in an accepting state. Null if not.
    */
    endComputation(accepted){
        
        this.automata.currState = this.automata.start;

        // Reset word
        this.word = Boolean(this.inputWord) ? this.inputWord : ""
                
        this.time.delayedCall(500, this.automata.clearStates, [], this.automata)
        
        if (this.repeat && !accepted){ 
            this.time.delayedCall(1000, this.startComputation, [], this); 
        }
    }

    /**
     * Adds text describing language to scene. Scales text depending on size
     * @param {String} language - String describing language
     */
    addLanguage(language){
        if (language.length < 30){
            const text = this.add.text(400, 20, language, { fontSize: '30px', color: '#ffffff' }).setOrigin(0.5);
        } else {
            const text = this.add.text(400, 30, language, { fontSize: '25px', color: '#ffffff', align: 'center'}).setOrigin(0.5);
            text.setWordWrapWidth(400, true);
        }
        
    }

    
}

