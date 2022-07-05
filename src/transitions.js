import Colours from "./colours.js";

/* Handles drawing and interactivity of transitions */

export default class Transitions{    
    
    SIZE = 30;

    constructor(graphics, automata, scene){
        
        this.graphics = graphics;
        this.automata = automata;
        
        // Required for access to scene methods e.g. adding shapes
        this.scene = scene;
        
        this.transitions = {};
        this.labels = {};

        this.interactive = false;
        
        this.drawTransitions();
    }

    drawTransitions(){
        
        // Error handling in case of no automata
        if (!this.automata){
            return;
        }
        
        // Remove all previous labels
        for (let key in this.labels){
            this.labels[key].destroy();
        }
        this.labels = {};

        const tri_size = this.SIZE/2;  // Scale arrowhead based on size of states
        
        
        // Iterate through states of automata 
        for (let s in this.automata.states){            
            
            let state = this.automata.states[s];
            
            // Iterate through transitions of state
            for (let input in state.transitions){
                
                let endStates = state.transitions[input]; // array of reachable states
                
                endStates.forEach((endState) => { 
                    
                    // Key for transition is start state concatenated with end state
                    const key = s.concat(endState);
                
                    // Transition already exists, just add new input to label
                    if (this.labels.hasOwnProperty(key)){
    
                        this.labels[key].text = this.labels[key].text.concat(",").concat(input)
                    } else {
                        
                        //Create new transition
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
            
            // Add line by adding second circle and stroking outline
            var line = new Phaser.Geom.Circle(startState.graphic.x, startState.graphic.y-this.SIZE, this.SIZE);
            this.graphics.strokeCircleShape(line);

            const labelY = startState.graphic.y - (this.SIZE*3);
            this.labels[key] = this.scene.add.text(startState.graphic.x, labelY, input, { fontSize: '30px', color: '#ffffff' });

            // Add direction arrow
            const x = startState.graphic.x + this.SIZE * Math.cos(Phaser.Math.DegToRad(30)); // Parametric equations for point on circle
            const y = startState.graphic.y - this.SIZE * Math.sin(Phaser.Math.DegToRad(30)); // Can hardcode if size is settled for speed
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(x, y, tri_size);
            Phaser.Geom.Triangle.RotateAroundXY(tri, x, y, Phaser.Math.DegToRad(200));
            this.drawTriangle(tri);

            // Allow players to remove the transition
            if (this.interactive){    
                this.setCircleInteractivity(line, startState, input, key);
            }
        }
        // Transition between states
        else{
            
            // Add line between centre of two states
            var line = new Phaser.Geom.Line (startState.graphic.x, startState.graphic.y, endState.graphic.x, endState.graphic.y);
            this.graphics.strokeLineShape(line);

            // Add label
            const mid = Phaser.Geom.Line.GetMidPoint(line);
            this.labels[key] = this.scene.add.text(mid.x, mid.y, input, { fontSize: '30px', color: '#ffffff' })

            // Add direction arrow 
            const intersectPoint = line.getPoint(1 - (this.SIZE / Phaser.Geom.Line.Length(line))); // x,y object of where line crossed edge of state circle
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(intersectPoint.x, intersectPoint.y, tri_size); 
            let angle = Phaser.Geom.Line.Angle(line); // Rotate triangle to match angle of line
            angle += 1.571; // Rotate 3/4 of circle
            Phaser.Geom.Triangle.RotateAroundXY(tri, intersectPoint.x, intersectPoint.y, angle);
            this.drawTriangle(tri);

            if (this.interactive){
                this.setLineInteractivity(line, startState, endState, key, input);
            }
        }
    }

    drawTriangle(tri){
        this.graphics.fillStyle(Colours.BLACK);
        this.graphics.fillTriangleShape(tri);
        this.graphics.strokeTriangleShape(tri);
    }

    setCircleInteractivity(line, startState, input, key){
        
        line.startState = startState;
        line.input = input;

        // Create graphics object to listen for click.
        let hitGraphics = this.add.graphics();
        hitGraphics.setInteractive(line, Phaser.Geom.Circle.Contains);
        
        // Store hit area and graphics object in object
        this.transitions[key] = {'hitArea':line, hitGraphics};

        // User clicks on transition. Delete transition from automata, remove hit area. 
        hitGraphics.on('pointerup', () => {
            console.log('clicked');
            hitGraphics.destroy();
            delete this.transitions[key];
            delete line.startState.transitions[line.input];
        })
    }

    setLineInteractivity(line, startState, endState, key, input){
        // Get slope of line perpendicular to transition line
        const perpSlope = Phaser.Geom.Line.NormalAngle(line);
        let points = []
        
        // Add points of polygon by creating lines based on normal angle
        points.push( Phaser.Geom.Line.SetToAngle(new Phaser.Geom.Line(), startState.graphic.x, startState.graphic.y, perpSlope, 20).getPointB());
        points.push( Phaser.Geom.Line.SetToAngle(new Phaser.Geom.Line(), startState.graphic.x, startState.graphic.y, perpSlope, -20).getPointB());
        points.push( Phaser.Geom.Line.SetToAngle(new Phaser.Geom.Line(), endState.graphic.x, endState.graphic.y, perpSlope, -20).getPointB());
        points.push( Phaser.Geom.Line.SetToAngle(new Phaser.Geom.Line(), endState.graphic.x, endState.graphic.y, perpSlope, 20).getPointB());

        // Create new hit area
        if (!this.transitions.hasOwnProperty(key)){

            // Rectangle surrounding transition 
            const hitArea = new Phaser.Geom.Polygon(points);
            
            // Connect hit area to transition
            hitArea.startState = startState;
            hitArea.input = input;

            // Create graphics object to listen for click.
            let hitGraphics = this.add.graphics();
            hitGraphics.setInteractive(hitArea, Phaser.Geom.Polygon.Contains);
            
            // Store hit area and graphics object in object
            this.transitions[key] = {hitArea, hitGraphics};
            
            console.log(hitGraphics.z);

            // User clicks on transition. Delete transition from automata, remove hit area. 
            hitGraphics.on('pointerup', () => {
                hitGraphics.destroy();
                delete this.transitions[key];
                delete hitArea.startState.transitions[hitArea.input];
            })
        }
        
        // Hit area has already been created, update to new co-ords. 
        else{
            this.transitions[key].hitArea.setTo(points)
        }
    }

    setInteractive(){
        this.interactive = true;
    }
}