import Colours from "./colours.js";
import Transitions from "./transitions.js";

export default class Level extends Phaser.Scene {

    // Constants
    THICKNESS = 3;
    SIZE = 30;
    
    // Level data
    timer = 0;

    // Flags
    computing = false;
    repeat = false;
    interactive = false;

    constructor (key) {
        super(key);
    }
      
    // Called with automata for level in json(-ish) format
    create (automata) {
        
        this.graphics = this.add.graphics({ lineStyle: { width: this.THICKNESS, color: Colours.BLACK } });

        if (automata){
            // Automata for level is defined in seperate file
            this.automata = automata
            
        
            // Used for animating computation
            this.currState = this.automata.start;

            // Render each state on canvas, set interactivity
            for (let s in this.automata.states){
                let state = this.automata.states[s]
                this.addStateGraphic(state);
            }

            this.transitions = new Transitions(this.graphics, this.automata, this);
        }
        
        // Add compute button
        const compute = this.add.text(20, 20, 'Compute', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        
        compute.on('pointerup', () => {
            if (!this.computing) {this.startComputation()};
          });
        
        // Add pause button
        const pause = this.add.text(700, 20, 'Pause', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        pause.on('pointerup', () => {
            if (this.computeLoop){
                this.computeLoop.paused = !this.computeLoop.paused;
            }
        })
        const back = this.add.text(700, 60, 'Back', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        back.on('pointerup', () => {
            console.log('back it up');
            this.scene.stop('Level1');
            this.scene.stop('Level2');
            this.scene.start('IntroScene');
        })
    }

    addStateGraphic(state){   
        state.graphic = this.add.circle(state.x, state.y, this.SIZE, Colours.WHITE)
        state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1).setInteractive();
        state.graphic.parent = state;

        if (state.accepting){
            state.graphic.inner = this.add.circle(state.x, state.y, this.SIZE/1.3, Colours.WHITE);
            state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        }

        // Record of where state is connected to
        state.keys = [];
    }

    setHighlights(state){
        state.graphic.on('pointerover', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
        })
        
        state.graphic.on('pointerout', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        })
    }

    computation(){        
        
        // Set previous state to black
        const prevState = this.automata.states[this.currState];
        console.log('word: ', this.word);
        console.log(prevState.accepting);
        prevState.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        
        if (prevState.accepting){ // Check if state has inner ring
            prevState.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
            prevState.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        }
        
        // Check if word is empty. If so, end and return.
        if (!this.word){
            // End computation, reseting states
            prevState.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
            this.endComputation();
            return;
        } 
        
        // If word is not empty, get first symbol
        let symbol = this.word[0];
        this.word = this.word.slice(1);
        
        // Check whether transition for symbol is defined, exit if not.
        if (!(symbol in this.automata.states[this.currState].transitions)){

            // Colour state red
            prevState.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
            if (prevState.accepting){
                prevState.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
            }
            this.endComputation();
            return;
        }

        // Index transitions of state based on symbol
        this.currState = this.automata.states[this.currState].transitions[symbol][0];
        let state = this.automata.states[this.currState];
        
        // If word is now empty, having read symbol, end computation
        if (!this.word){
            // Change to green if accepting, red if not
            if (state.accepting){
                state.graphic.setStrokeStyle(this.THICKNESS, Colours.GREEN, 1);
                state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.GREEN, 1);
                this.endComputation();
            }
            else{
                state.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1); 
                this.endComputation;
            }
        }
        else{
            // Highlight current state in yellow;
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.YELLOW, 1);
            if (state.accepting){ // Check if state has inner ring
                state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.YELLOW, 1);
            }
        }
    }

    startComputation(){
        console.log('clicked');
        this.automata.states[this.automata.start].graphic.setStrokeStyle(this.THICKNESS, Colours.YELLOW, 1);
        this.computing = true; 
        this.computeLoop = this.time.addEvent({delay: 500, callback: this.computation, callbackScope: this, loop: true})
    }

    endComputation(){
        this.currState = this.automata.start;
        this.computing = false;
        if (this.inputWord){
            this.word = this.inputWord;
        } else{
            this.word = ""
        }
        this.time.removeEvent(this.computeLoop);
        this.time.addEvent({delay: 500, callback: this.clearStates, callbackScope: this, loop: false})
    }

    clearStates(){
        for (let s in this.automata.states){            
            let state = this.automata.states[s];
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
            if (state.accepting){
                state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
            }
        }
        if (this.repeat){this.startComputation()};
    }
}

