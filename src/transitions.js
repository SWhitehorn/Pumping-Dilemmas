import Colours from "./colours.js";
import { getNextLetter } from "./utils.js";

/* Handles drawing and interactivity of transitions */

export default class Transitions{    
    
    SIZE = 30;

    constructor(graphics, automata, scene){
        
        this.graphics = graphics;
        this.automata = automata;
        
        // Required for access to scene methods e.g. adding shapes
        this.scene = scene;
        
        // Object storing data about the transitions between states, indexed by startState + endState
        this.transitionPoints = {};
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
            if (this.labels[key]){
                this.labels[key].destroy();
            }
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
                    
                        // Check for null before adding text
                        if (this.labels[key]){
                            this.labels[key].text = this.labels[key].text.concat(",").concat(input)
                        }
                    
                    } else {
                        
                        //Create new transition
                        this.labels[key] = null;
                        this.drawSingleTransition(state, this.automata.states[endState], tri_size, input, key, endState);
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

    drawSingleTransition(startState, endState, tri_size, input, key, s){

        // Transitions is from state to itself
        if (startState === endState){
            
            // Add line by adding second circle and stroking outline
            var line = new Phaser.Geom.Circle(startState.graphic.x, startState.graphic.y-this.SIZE, this.SIZE);
            
            this.graphics.strokeCircleShape(line);
            
            const labelY = startState.graphic.y - (this.SIZE*3);

            this.addLabel(s, {x:startState.graphic.x, y:labelY}, input, key, line);
        
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
            //var line = new Phaser.Geom.Line (startState.graphic.x, startState.graphic.y, endState.graphic.x, endState.graphic.y);
            
            // Get Control points for line
            const startPoint = new Phaser.Math.Vector2(startState.graphic.x, startState.graphic.y);
            
            const endPoint = new Phaser.Math.Vector2(endState.graphic.x, endState.graphic.y);
            const mid = this.getControlPoint(null, key, startPoint, endPoint)

            var line = new Phaser.Curves.QuadraticBezier(startPoint, mid, endPoint);

            //this.graphics.strokeLineShape(line);
            line.draw(this.graphics)

            
            this.addLabel(s, mid, input, key, line);
            
            // Add direction arrow 
            const percent = this.SIZE / line.getLength();
            const intersectPoint = line.getPointAt(1 - percent); // x,y object of where line crossed edge of state circle
            
            
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(intersectPoint.x, intersectPoint.y, tri_size); 
            
            const angleLine = new Phaser.Geom.Line(intersectPoint.x, intersectPoint.y, endState.graphic.x, endState.graphic.y, );
            let angle = Phaser.Geom.Line.Angle(angleLine); // Rotate triangle to match angle of line
            angle += 1.571; // Rotate 3/4 of circle
            Phaser.Geom.Triangle.RotateAroundXY(tri, intersectPoint.x, intersectPoint.y, angle);
            this.drawTriangle(tri);

            if (this.interactive){
                this.setLineInteractivity(line, startState, endState, key, input, s, mid);
            }
        }
    }

    drawTriangle(tri){
        this.graphics.fillStyle(Colours.BLACK);
        this.graphics.fillTriangleShape(tri);
        this.graphics.strokeTriangleShape(tri);
    }

    addLabel(endName, point, input, key, line){
        
        // Add letter menu
        if (this.interactive && this.transitionPoints.hasOwnProperty(key) && this.transitionPoints[key].selected){
            
            this.addLetterMenu(this.transitionPoints[key], endName, point, key)
        
        } else { 
            // Add fresh label
            
            this.labels[key] = this.scene.add.text(point.x, point.y, input, { fontSize: '30px', color: '#ffffff' })    
        }
    }

    setCircleInteractivity(line, startState, input, key){
        
        line.startState = startState;
        line.input = input;

        // Create graphics object to listen for click.
        let hitGraphics = this.scene.add.graphics();
        hitGraphics.setInteractive(line, Phaser.Geom.Circle.Contains);
        
        // Store hit area and graphics object in object
        this.transitionPoints[key] = {'hitArea':line, hitGraphics};

        // User clicks on transition. Delete transition from automata, remove hit area. 
        hitGraphics.on('pointerup', (pointer) => {
            
            if (pointer.rightButtonReleased()){
                hitGraphics.destroy();
                delete this.transitionPoints[key];
                delete line.startState.transitions[line.input];
            }
            
        })
    }

    setLineInteractivity(line, startState, endState, key, input, endName){
        
        // Create new hit area
        if (!this.transitionPoints.hasOwnProperty(key)){

            const mid = this.getControlPoint(line, key);

            const hitArea = this.scene.add.circle(mid.x, mid.y, 5, Colours.BLACK).setInteractive();
            hitArea.startState = startState;

            // Store hit area and graphics object in object
            this.transitionPoints[key] = hitArea
            this.scene.input.setDraggable(hitArea);
            
            // Add key to state, avoiding duplicates
            if (startState.keys.indexOf(key) === -1){
                startState.keys.push(key);
            }
            if (endState.keys.indexOf(key) === -1){
                endState.keys.push(key);
            }
            
            

            // User clicks on transition
            hitArea.on('pointerup', (pointer) => {
                
                console.log('clicked');
                
                // Delete transition if right button is clicked
                if (pointer.rightButtonReleased()){
                    if (!this.scene.draw){
                        hitArea.destroy();
                        delete this.transitionPoints[key];
                        this.removeTransitions(hitArea.startState, endName);
                    }
                
                // Left mouse: enable user to change the letters on the transition
                } else if (!hitArea.selected){
                    
                    // Flag that the user has selected the transition
                    hitArea.selected = true;
                    
                }
            });
        
        // Update existing hit area
        } else {
            //this.transitionPoints[key].setPosition(mid.x, mid.y);
            
            if (this.transitionPoints[key].selected){
                this.addLetterMenu(this.transitionPoints[key], endName, this.getControlPoint(line, key));
            }
        }
    }

    setInteractive(){
        this.interactive = true;
    }

    // Remove all transitionPoints from first state to second state
    removeTransitions(startState, endStateName){
        console.log(startState);
        const transitions = Object.entries(startState.transitions);
        
        // Iterate through [letter, states], check for endState in states
        transitions.forEach((t) => {
            let [letter, states] = t;
            let index = states.indexOf(endStateName);
            if (index !== -1) {
                // Remove element of array pointing to second state
                startState.transitions[letter].splice(index, 1);
                
                // Delete if empty array after deleting state pointer
                if (!startState.transitions[letter].length){
                    
                    delete startState.transitions[letter];
                    
                }
            }
        });
    }

    addLetterMenu(hitArea, endName, mid, key){
        

        // Update existing letters to new position
        if (hitArea.hasOwnProperty("letterArray")){
            for (let i = 0; i < this.scene.language.length; i++){
                hitArea.letterArray[i].setPosition(mid.x + i*30, mid.y);
            }
        } else{ // Create new letters
            hitArea.letterArray = [];
        
            for (let i = 0; i < this.scene.language.length; i++){
                
                // Render letter in green if part of transition, red if not
                if (hitArea.startState.transitions.hasOwnProperty(this.scene.language[i])
                && hitArea.startState.transitions[this.scene.language[i]].includes(endName)){
                    
                    hitArea.letterArray.push(this.scene.add.text(mid.x + i*30, mid.y, this.scene.language[i], { fontSize: '30px', color: Colours.TEXTGREEN }));
                } else{
                    hitArea.letterArray.push(this.scene.add.text(mid.x + i*30, mid.y, this.scene.language[i], { fontSize: '30px', color: Colours.TEXTYELLOW }));
                }
                
                hitArea.letterArray[i].setInteractive();
                
                // 
                hitArea.letterArray[i].on('pointerup', () => {

                    hitArea.selected = false;
                    const transitions = hitArea.startState.transitions;
                    let letter = hitArea.letterArray[i].text

                    // Transition over input is already defined
                    if (transitions.hasOwnProperty(letter)){
                        
                        // Remove state if present
                        if (transitions[letter].includes(endName)){
                            console.log('splicing');
                            const index = transitions[letter].indexOf(endName);
                            transitions[letter].splice(index, 1);
                            
                            // Delete data if array is empty
                            if (transitions[letter].length === 0){
                                delete transitions[letter];
                                hitArea.destroy();
                                delete this.transitionPoints[key];
                            }

                        } else {
                            transitions[letter].splice(0,0,endName);
                        }
                    
                    // Transition over input is not defined, create new transition
                    } else {
                        transitions[letter] = [endName];
                    }

                    // Remove letterArray property from hitArea
                    hitArea.letterArray.forEach((letter) => {letter.destroy()});
                    delete hitArea.letterArray;
                });
            }
        }
        
    }

    // startPoint and endPoint are optional, only used if method is called without a curve
    getControlPoint(curve, key, startPoint, endPoint){
        if (this.transitionPoints[key]){
            return new Phaser.Math.Vector2(this.transitionPoints[key].x, this.transitionPoints[key].y);
        } else if (curve){
            return new Phaser.Math.Vector2(curve.getPointAt(0.5));
        } else {
            return Phaser.Geom.Point.Interpolate(startPoint, endPoint)
        }
    }
}