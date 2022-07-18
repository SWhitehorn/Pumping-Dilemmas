import Colours from "../colours.js";
import Transitions from "../transitions.js";
import Automata from "../automata.js";
import "../typedefs/typedefs.js"

export default class Level extends Phaser.Scene {

    // Flags
    computing = false;
    repeat = false;
    interactive = false;

    constructor (key) {
        super(key);
    }
      
    // Called with automata for level in object literal format
    create (automata, language) {
        
        this.graphics = this.add.graphics({ lineStyle: { width: 3, color: Colours.BLACK } });
        
        this.textObjects = {};
        this.textObjects.language = this.add.text(400, 30, language, { fontSize: '30px', color: '#ffffff' }).setOrigin(0.5);

        // Render automata to screen
        if (automata){
            // Create automata
            this.automata = new Automata(automata, this);
        
            // Render each state on canvas, set interactivity
            for (let s in this.automata.states){
                this.automata.addStateGraphic(s);
            }

            this.transitions = new Transitions(this.graphics, this.automata, this);
            
            // Add pause button
            this.textObjects.pause = this.add.text(700, 20, 'Pause', { fontSize: '30px', color: '#ffffff' }).setInteractive();
            this.textObjects.pause.on('pointerup', () => {
                if (this.computeLoop){
                    this.computeLoop.paused = !this.computeLoop.paused;
                }
            })
        }
        
        this.textObjects.back = this.add.text(700, 60, 'Back', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        this.textObjects.back.on('pointerup', () => {
            this.scene.stop('Level1');
            this.scene.stop('Level2');
            this.scene.start('IntroScene');
        })    
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
        
        console.log("level", accepted);

        this.automata.currState = this.automata.start;

        // Reset word
        this.word = Boolean(this.inputWord) ? this.inputWord : ""
                
        this.time.delayedCall(500, this.automata.clearStates, [], this.automata)
        
        if (this.repeat && !accepted){ 
            this.time.delayedCall(1000, this.startComputation, [], this); 
        }
    }

    
}

