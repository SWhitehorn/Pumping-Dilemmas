import Colours from "./colours.js";

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
            this.labels = {} // Ensures that labels are refreshed each time scene is created
        
            // Used for animating computation
            this.currState = this.automata.start;

            // Render each state on canvas, set interactivity
            for (let s in this.automata.states){
                let state = this.automata.states[s]
                this.addStateGraphic(state);
            }

            this.drawTransitions();
        }
        
        
        
        
        // Add compute button
        const compute = this.add.text(20, 20, 'Compute', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        
        compute.on('pointerup', () => {
            if (!this.computing) {this.startComputation()};
          });
        
        // Add pause button
        const pause = this.add.text(700, 20, 'Pause', { fontSize: '30px', color: '#ffffff' }).setInteractive();
        pause.on('pointerup', () => {
            if (this.com){
                this.com.paused = !this.com.paused;
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

        if (state.accepting){
            state.graphic.inner = this.add.circle(state.x, state.y, this.SIZE/1.3, Colours.WHITE);
            state.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        }
    }

    setHighlights(state){
        state.graphic.on('pointerover', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
        })
        
        state.graphic.on('pointerout', () => {
            state.graphic.setStrokeStyle(this.THICKNESS, Colours.BLACK, 1);
        })
    }

    drawTransitions(){
        
        // Error handling in case of no automata
        if (!this.automata){
            //console.error("automata is undefined");
            return;
        }

        const tri_size = this.SIZE/2;  // Scale arrowhead based on size of states
        
        // Iterate through states of automata and then the transitions of each state, adding each to canvas in turn.
        for (let s in this.automata.states){            
            let state = this.automata.states[s];
            for (let input in state.transitions){
                let endStates = state.transitions[input]; // array of reachable states
                
                endStates.forEach((endState) => { 
                    // Key for transition is start state concatenated with end state
                    const key = s.concat(endState);
                
                    // Transition already exists, just add new input to label
                    if (this.labels.hasOwnProperty(key)){
                        this.labels[key].text = this.labels[key].text.concat(",").concat(input)
                    }
                    // Create new transition
                    else{
                        this.labels[key] = null;
                        this.drawSingleTransition(state, this.automata.states[endState], tri_size, input, key);
                    }
                })
                
            }  
        }

        // Add input arrow to starting state 
        const startState = this.automata.states[this.automata.start] 

        const tri = new Phaser.Geom.Triangle.BuildEquilateral(startState.graphic.x-this.SIZE, startState.graphic.y, tri_size);
        Phaser.Geom.Triangle.RotateAroundXY(tri, startState.graphic.x-this.SIZE, startState.graphic.y, 1.571);
        this.drawTriangle(tri); 

    }

    drawSingleTransition(startState, endState, tri_size, input, key){

        // Transitions is from state to itself
        if (startState === endState){
            
            // Add line by adding second circle
            var line = new Phaser.Geom.Circle(startState.graphic.x, startState.graphic.y-this.SIZE, this.SIZE);
            this.graphics.strokeCircleShape(line);

            const labelY = startState.graphic.y - (this.SIZE*3);
            this.labels[key] = this.add.text(startState.graphic.x, labelY, input, { fontSize: '30px', color: '#ffffff' });

            // Add direction arrow
            const x = startState.graphic.x + this.SIZE * Math.cos(Phaser.Math.DegToRad(30)); // Parametric equations for point on circle
            const y = startState.graphic.y - this.SIZE * Math.sin(Phaser.Math.DegToRad(30)); // Can hardcode if size is settled for speed
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(x, y, tri_size);
            Phaser.Geom.Triangle.RotateAroundXY(tri, x, y, Phaser.Math.DegToRad(200));
            this.drawTriangle(tri);
        }
        // Transition between states
        else{
            // Add line between centre of two states
            var line = new Phaser.Geom.Line (startState.graphic.x, startState.graphic.y, endState.graphic.x, endState.graphic.y);
            this.graphics.strokeLineShape(line);


            // Add label
            const mid = Phaser.Geom.Line.GetMidPoint(line);
            this.labels[key] = this.add.text(mid.x, mid.y, input, { fontSize: '30px', color: '#ffffff' })

            // Add direction arrow 
            const intersectPoint = line.getPoint(1 - (this.SIZE / Phaser.Geom.Line.Length(line))); // x,y object of where line crossed edge of state circle

            const tri = new Phaser.Geom.Triangle.BuildEquilateral(intersectPoint.x, intersectPoint.y, tri_size); 
            let angle = Phaser.Geom.Line.Angle(line); // Rotate triangle to match angle of line
            angle += 1.571; // Rotate 3/4 of circle
            Phaser.Geom.Triangle.RotateAroundXY(tri, intersectPoint.x, intersectPoint.y, angle);
            
            this.drawTriangle(tri);
        }

        if (this.interactive){
            
            this.interactiveGraphics = this.add.graphics({ lineStyle: { width: this.THICKNESS, color: Colours.BLACK } })
            const rect = new Phaser.Geom.Rectangle.FromXY(line.x1, line.y1, line.x2, line.y2);
            
            this.interactiveGraphics.fillRectShape(rect);

            this.interactiveGraphics.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
            

            this.interactiveGraphics.on('pointerup', () => {
                this.interactiveGraphics.clear();
            })
        }
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
        
        // Index transitions of state based on symbol
        this.currState = this.automata.states[this.currState].transitions[symbol][0];
        
        // No transition: computation ends, return.
        if (!this.currState){
            console.log('failed computation');
            prevState.graphic.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
            if (prevState.accepting){
                prevState.graphic.inner.setStrokeStyle(this.THICKNESS, Colours.RED, 1);
            }
            this.endComputation();
            return;
        }
        
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
        this.com = this.time.addEvent({delay: 500, callback: this.computation, callbackScope: this, loop: true})
    }

    endComputation(){
        this.currState = this.automata.start;
        this.computing = false;
        this.word = this.inputWord;
        this.time.removeEvent(this.com);
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

    drawTriangle(tri){
        this.graphics.fillStyle(Colours.BLACK);
        this.graphics.fillTriangleShape(tri);
        this.graphics.strokeTriangleShape(tri);
    }
}

