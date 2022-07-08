import Colours from "./colours.js";
import { getNextLetter } from "./utils.js";
import TransitionPoint from "./transitionPoint.js";
import "./typedefs/typedefs.js"

/**
 * Handles drawing and updating of transitions
 * @class
 *  */ 
export default class Transitions{    
    
    SIZE = 30;

    /**
     * 
     * @param {Object} graphics - Phaser graphics object 
     * @param {Automata} automata - Input automata
     * @param {Object} scene - Game scene that transitions is attached to
     */
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
    
    /**
     * Draws all transitions
     */
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
        for (let startName in this.automata.states){            
            
            let state = this.automata.states[startName];
            
            // Iterate through transitions of state
            for (let input in state.transitions){
                
                // Array of reachable states
                let endStates = state.transitions[input]; 
                
                endStates.forEach((endName) => { 
                    
                    // Key for transition is start state concatenated with end state
                    const key = startName.concat(endName);
                    
                    // Transition already exists, just add new input to label
                    if (this.labels.hasOwnProperty(key)){
                    
                        // Check for null before adding text
                        if (this.labels[key]){
                            this.labels[key].text = this.labels[key].text.concat(",").concat(input)
                        }
                        if (this.interactive && this.transitionPoints[key].inputs.indexOf(input) === -1){
                            this.transitionPoints[key].inputs.push()
                        }
                    
                    } else {
                        
                        //Create new transition
                        this.labels[key] = null;
                        this.drawSingleTransition(state, this.automata.states[endName], tri_size, input, key, endName);
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

    /**
     * Draws a transition from state state to end state, according to conditions of scene
     * @param {State} startState - Object defining initial state of transition
     * @param {State} endState - Object defining end state
     * @param {number} tri_size - Size of the transition arrow heads 
     * @param {string} input - Single char input that transition is defined over
     * @param {string} key - String containing name of start and end states
     * @param {string} endName - Name of end state
     */
    drawSingleTransition(startState, endState, tri_size, input, key, endName){

        // Transitions is from state to itself
        if (startState === endState){
            
            // Add line by adding second circle and stroking outline
            var line = new Phaser.Geom.Circle(startState.graphic.x, startState.graphic.y-this.SIZE, this.SIZE);
            
            this.graphics.strokeCircleShape(line);
            
            const labelY = startState.graphic.y - (this.SIZE*3);

            this.addLabel(endName, {x:startState.graphic.x, y:labelY}, input, key, line);
        
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
            
            // Get Control points for line
            const startPoint = new Phaser.Math.Vector2(startState.graphic.x, startState.graphic.y);
            const endPoint = new Phaser.Math.Vector2(endState.graphic.x, endState.graphic.y);
            const mid = this.getControlPoint(null, key, startPoint, endPoint);

            var line = new Phaser.Curves.QuadraticBezier(startPoint, mid, endPoint);

            line.draw(this.graphics)

            
            this.addLabel(endName, mid, input, key, line);
            
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
                this.setLineInteractivity(line, startState, endState, key, input, endName);
            }
        }
    }
    /**
     * Draws the given triangle
     * @param {Triangle} tri - Phaser Geom Triangle 
     */
    drawTriangle(tri){
        this.graphics.fillStyle(Colours.BLACK);
        this.graphics.fillTriangleShape(tri);
        this.graphics.strokeTriangleShape(tri);
    }

    /**
     * Adds a label to the given transition
     * @param {string} endName - String containing target state name
     * @param {Object} point - Object with x and y properties 
     * @param {string} input - Single char string 
     * @param {string} key - String with name of start and end state
     * @param {QuadtraticBezier} line - Phaser Curve QuadtraticBezier object
     */
    addLabel(endName, point, input, key, line){
        
        // Add letter menu
        if (this.interactive && this.transitionPoints.hasOwnProperty(key) && this.transitionPoints[key].selected){
            
            this.addLetterMenu(this.transitionPoints[key], endName, point, key)
        
        } else { 
            // Add fresh label
            this.labels[key] = this.scene.add.text(point.x, point.y, input, { fontSize: '30px', color: '#ffffff' })    
        }
    }

    /**
     * Adds interactive component to transition from state to itself
     * @param {Arc} line 
     * @param {State} startState 
     * @param {string} input 
     * @param {string} key 
     */
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
            else{
                if (this.transitionPoints[key].selected){
                    this.addLetterMenu(this.transitionPoints[key], endName, this.getControlPoint(line, key));
                }
            }
            
        })
    }

    /**
     *  Adds interactive component to transition from state to different state
     * @param {QuadtraticBezier} line - Phaser object for line 
     * @param {State} startState - State state of transition
     * @param {State} endState - Ending state of transition
     * @param {string} key - String with key for transition
     * @param {string} input - Input for transition
     * @param {string} endName - String with name of target state
     */
    setLineInteractivity(line, startState, endState, key, input, endName){
    
        const mid = this.getControlPoint(line, key);

        // Create new hit area
        if (!this.transitionPoints.hasOwnProperty(key)){

            const hitArea = new TransitionPoint(mid.x, mid.y, this.scene, key);
            hitArea.setStart(startState).setEnd(endState, endName).addInput(input);

            // Store hit area and graphics object in object
            this.transitionPoints[key] = hitArea;
            hitArea.setDraggable();
            
            // Add key to state, avoiding duplicates
            if (startState.keys.indexOf(key) === -1){
                startState.keys.push(key);
            }
            if (endState.keys.indexOf(key) === -1){
                endState.keys.push(key);
            }
        
        // Update existing hit area
        } else {
            
            this.transitionPoints[key].setPosition(mid.x, mid.y);
            
            if (this.transitionPoints[key].selected){
                this.addLetterMenu(this.transitionPoints[key], endName, this.getControlPoint(line, key));
            }
        }
    }

    /** Enable player to interact with transitions */
    setInteractive(){
        this.interactive = true;
    }

    /**
     * Removes all transitions from first state to second
     * @param {State} startState 
     * @param {string} endStateName 
     */
    removeTransitions(startState, endStateName){
        
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

    /**
     * Adds menu of letters to click at given point
     * @param {TransitionPoint} hitArea 
     * @param {string} endName 
     * @param {Point} mid - object with x and y properties 
     * @param {string} key 
     */
    addLetterMenu(hitArea, endName, mid, key){

        // Update existing letters to new position
        if (hitArea.hasOwnProperty("letterArray")){
            for (let i = 0; i < this.scene.language.length; i++){
                hitArea.letterArray[i].setPosition(mid.x + i*30, mid.y);
            }
        // Create new letters
        } else{ 
            hitArea.createLetters(mid);
        }
    }

    /**
     * Returns point for the line to be drawn through
     * @param {QuadraticBezier|Null} curve - curve to get mid point of, may be null.
     * @param {string} key 
     * @param {Vector2} [startPoint] - must be included if curve is null
     * @param {Vector2} [endPoint] - must be included if curve is null
     * @returns {Vector2} - object with x and y properties 
     */
    getControlPoint(curve, key, startPoint, endPoint){
        
        // Already a point defined, return the position
        if (this.transitionPoints[key] && !this.transitionPoints[key].update){
            return new Phaser.Math.Vector2(this.transitionPoints[key].getPosition());
            
        // Curve is defined, return halfway point
        } else if (curve){
            return new Phaser.Math.Vector2(curve.getPointAt(0.5));
        
        // No transition point and curve is null 
        } else {
            if (!startPoint || !endPoint){
                console.error('No optional parameters')
            } else {
                return Phaser.Geom.Point.Interpolate(startPoint, endPoint, 0.5);
            }
       }
    }
}