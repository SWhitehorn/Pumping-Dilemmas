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

            this.addLabel(s, {x:startState.graphic.x, y:labelY}, input, key);
        
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

            const mid = Phaser.Geom.Line.GetMidPoint(line);
            this.addLabel(s, mid, input, key);
            
            // Add direction arrow 
            const intersectPoint = line.getPoint(1 - (this.SIZE / Phaser.Geom.Line.Length(line))); // x,y object of where line crossed edge of state circle
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(intersectPoint.x, intersectPoint.y, tri_size); 
            let angle = Phaser.Geom.Line.Angle(line); // Rotate triangle to match angle of line
            angle += 1.571; // Rotate 3/4 of circle
            Phaser.Geom.Triangle.RotateAroundXY(tri, intersectPoint.x, intersectPoint.y, angle);
            this.drawTriangle(tri);

            if (this.interactive){
                this.setLineInteractivity(line, startState, endState, key, input, s);
            }
        }
    }

    drawTriangle(tri){
        this.graphics.fillStyle(Colours.BLACK);
        this.graphics.fillTriangleShape(tri);
        this.graphics.strokeTriangleShape(tri);
    }

    addLabel(endName, point, input, key){
        
        // Add letter menu
        if (this.interactive && this.transitions.hasOwnProperty(key) && this.transitions[key].hitArea.selected){

            this.addLetterMenu(this.transitions[key].hitArea, endName, point, key)
        
        } else { 
            // Add fresh label
            console.log('adding key');
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
        this.transitions[key] = {'hitArea':line, hitGraphics};

        // User clicks on transition. Delete transition from automata, remove hit area. 
        hitGraphics.on('pointerup', (pointer) => {
            
            if (pointer.rightButtonReleased()){
                hitGraphics.destroy();
                delete this.transitions[key];
                delete line.startState.transitions[line.input];
            }
            
        })
    }

    setLineInteractivity(line, startState, endState, key, input, endName){
        
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
            
            hitArea.startState = startState;
            hitArea.input = input;

            // Create graphics object to listen for click.
            let hitGraphics = this.scene.add.graphics();
            hitGraphics.setInteractive(hitArea, Phaser.Geom.Polygon.Contains);
            
            // Store hit area and graphics object in object
            this.transitions[key] = {hitArea, hitGraphics};
            
            // User clicks on transition
            hitGraphics.on('pointerup', (pointer) => {
                // Delete transition if right button is clicked
                if (pointer.rightButtonReleased()){
                    if (!this.scene.draw){
                        hitGraphics.destroy();
                        delete this.transitions[key];
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
            this.transitions[key].hitArea.setTo(points);
            
            if (this.transitions[key].hitArea.selected){
                this.addLetterMenu(this.transitions[key].hitArea, endName, Phaser.Geom.Line.GetMidPoint(line));
            }
        }
    }

    setInteractive(){
        this.interactive = true;
    }

    // Remove all transitions from first state to second state
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
                    delete startState.transitions[letter]
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
                    
                    hitArea.letterArray.push(this.scene.add.text(mid.x + i*30, mid.y, this.scene.language[i], { fontSize: '30px', color: '#4bb31e' }));
                } else{
                    hitArea.letterArray.push(this.scene.add.text(mid.x + i*30, mid.y, this.scene.language[i], { fontSize: '30px', color: '#d40000' }));
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
                            const index = transitions[letter].indexOf(endName);
                            transitions[letter].splice(index, 1);

                        // Add state
                        } else {
                            transitions[letter].splice(0,0,endName);
                        }
                    
                    } else {
                    // Transition over input is not defined, create new transition
                        transitions[letter] = [endName];
                    }

                    // Remove letterArray property from hitArea
                    hitArea.letterArray.forEach((letter) => {letter.destroy()});
                    delete hitArea.letterArray;
                });
            }
        }
        
    }
}