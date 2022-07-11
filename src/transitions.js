import Colours from "./colours.js";
import TransitionPoint from "./transitionPoint.js";
import Automata from "./automata.js";
import "./typedefs/typedefs.js"

/**
 * Handles drawing and updating of transitions
 * @class
 *  */ 
export default class Transitions{    
    
    SIZE = 30;
    triSize = 15;

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
        this.transitionObjects = {};

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
        
        // Iterate through transitions of each state 
        for (let startName in this.automata.states){            
            let state = this.automata.states[startName];
            for (let input in state.transitions){
                state.transitions[input].forEach((endName) => { 
                    
                    // Key for transition is start state concatenated with end state
                    const key = startName + "," + endName
                    
                    // Transition already exists, add new input to label
                    if (this.transitionObjects.hasOwnProperty(key)){
                        
                        let transitionData = this.transitionObjects[key]

                        // Check for null before adding text
                        if (transitionData.label){
                            transitionData.label.text = transitionData.label.text.concat(",").concat(input)
                        }
                        
                        // Prevent duplicates from being added to array
                        if (this.interactive && !transitionData.point.definedOver(input)){
                            this.transitionObjects[key].point.addInput(input);
                        }
                    
                    // Create new transition
                    } else {
                        
                        // Add data to transitionObjects
                        this.newTransition(key);
                        this.automata.addKey(key);
                        this.drawSingleTransition(state, this.automata.states[endName], input, key, endName);
                    }
                })
            }  
        }

        this.addStartArrow();
    }

    /**
     * Update location of all transitions
     */
    updateTransitions(){
        
        for (let key in this.transitionObjects){
            const transitionData = this.transitionObjects[key];
            const stateNames = key.split(",");
            const startState = this.automata.getState(stateNames[0]);
            const endState = this.automata.getState(stateNames[1]);

            // Line has not been created
            if (!transitionData.line){
                
                this.drawSingleTransition(startState, endState, transitionData.label, key, stateNames[1]);
            
            // Line needs updating
            } else if (transitionData.update){

                // Transition from one state to other
                if (stateNames[0] !== stateNames[1]){
                    
                    const startPoint = new Phaser.Math.Vector2(startState.graphic.x, startState.graphic.y);
                    const endPoint = new Phaser.Math.Vector2(endState.graphic.x, endState.graphic.y);
                    const midPoint = this.getControlPoint(null, null, startPoint, endPoint);
                    
                    transitionData.line.p0 = startPoint;
                    transitionData.line.p1 = midPoint;
                    transitionData.line.p2 = endPoint;

                    transitionData.point.setPosition(midPoint);
                    
                    this.updateLabel(transitionData, stateNames[1], key, midPoint);
                    
                }
            
            // Draw transition based on position of transitionPoint
            } else {
                const controlPoint = this.getControlPoint(transitionData.line, key, null, null);
                transitionData.line.p1 = controlPoint;
                this.updateLabel(transitionData, stateNames[1], key, controlPoint);
            }

            this.addDirectionArrow(transitionData.line, endState);
            transitionData.line.draw(this.graphics);
        }

        this.addStartArrow();
    }

    /**
     * Draws a transition from state state to end state, according to conditions of scene
     * @param {State} startState - Object defining initial state of transition
     * @param {State} endState - Object defining end state
     * @param {string} input - Single char input that transition is defined over
     * @param {string} key - String containing name of start and end states
     * @param {string} endName - Name of end state
     */
    drawSingleTransition(startState, endState, input, key, endName){

        // Transitions is from state to itself
        if (startState === endState){
            
            // Add line by adding second circle and stroking outline
            var line = new Phaser.Geom.Circle(startState.graphic.x, startState.graphic.y-this.SIZE, this.SIZE);
            this.transitionObjects[key].line = line;

            this.graphics.strokeCircleShape(line);
            
            const labelY = startState.graphic.y - (this.SIZE*3);

            this.addLabel(endName, {x:startState.graphic.x, y:labelY}, input, key);
        
            // Add direction arrow
            const x = startState.graphic.x + this.SIZE * Math.cos(Phaser.Math.DegToRad(30)); // Parametric equations for point on circle
            const y = startState.graphic.y - this.SIZE * Math.sin(Phaser.Math.DegToRad(30)); // Can hardcode if size is settled for speed
            const tri = new Phaser.Geom.Triangle.BuildEquilateral(x, y, this.tri_size);
            Phaser.Geom.Triangle.RotateAroundXY(tri, x, y, Phaser.Math.DegToRad(200));
            this.drawTriangle(tri);

            // Allow players to remove the transition
            if (this.interactive){    
                this.setCircleInteractivity(line, startState, input, key);
            }
        }
        // Transition between states
        else{
            
            // Get Control points for line
            const startPoint = new Phaser.Math.Vector2(startState.graphic.x, startState.graphic.y);
            const endPoint = new Phaser.Math.Vector2(endState.graphic.x, endState.graphic.y);
            const mid = this.getControlPoint(null, key, startPoint, endPoint);

            // Add line to objects
            this.transitionObjects[key].line = new Phaser.Curves.QuadraticBezier(startPoint, mid, endPoint);
            line = this.transitionObjects[key].line;

            // Draw line
            line.draw(this.graphics);
            this.addLabel(endName, mid, input, key, line);
            this.addDirectionArrow(line, endState);

            // Add interactive component to line
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
     * Adds a direction arrow to the line
     * @param {QuadraticBezier} line - 
     * @param {State} endState - State to point at
     */
    addDirectionArrow(line, endState){
        
        // Calculate distance along line
        const percent = this.SIZE / line.getLength();
        const intersectPoint = line.getPointAt(1 - percent);
        
        const tri = new Phaser.Geom.Triangle.BuildEquilateral(intersectPoint.x, intersectPoint.y, this.triSize); 
    
        // Rotate triangle to match gradient of line
        const angleLine = new Phaser.Geom.Line(intersectPoint.x, intersectPoint.y, endState.graphic.x, endState.graphic.y, );
        let angle = Phaser.Geom.Line.Angle(angleLine); // Rotate triangle to match angle of line
        angle += 1.571; // Rotate 3/4 of circle
        Phaser.Geom.Triangle.RotateAroundXY(tri, intersectPoint.x, intersectPoint.y, angle);
        this.drawTriangle(tri);
    }

    /** Add label to start state */
    addStartArrow(){
        // Add input arrow to starting state 
        const startState = this.automata.states[this.automata.start] 
        const tri = new Phaser.Geom.Triangle.BuildEquilateral(startState.graphic.x-this.SIZE, startState.graphic.y, this.triSize);
        Phaser.Geom.Triangle.RotateAroundXY(tri, startState.graphic.x-this.SIZE, startState.graphic.y, 1.571);
        this.drawTriangle(tri);
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
        if (this.interactive
            && this.transitionObjects[key].point 
            && this.transitionObjects[key].point.selected){
            this.addLetterMenu(this.transitionObjects[key].point, endName, point, key)
        
        } else { 
            // Add fresh label
            this.transitionObjects[key].label = this.scene.add.text(point.x, point.y, input, { fontSize: '30px', color: '#ffffff' })    
        }
    }

    /**
     * Updates the position of labels
     * @param {Object} transitionData 
     * @param {string} name 
     * @param {string} key 
     * @param {Point} midPoint 
     */
    updateLabel(transitionData, name, key, midPoint){
        if (transitionData.point.selected){
            transitionData.label.visible = false;
            this.addLetterMenu(transitionData.point, name, this.getControlPoint(transitionData.line, key), key);
        } else {
            transitionData.label.setPosition(midPoint.x, midPoint.y);
            transitionData.label.text = transitionData.point.inputs.toString();
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
                delete this.transitionObjects[key];
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
        
        // Create transition point
        const point = new TransitionPoint(mid.x, mid.y, this.scene, key);
        point.setStart(startState).setEnd(endState, endName).addInput(input).setDraggable();

        // Add point to transitionObjects
        this.transitionObjects[key].point = point;
                
       }

    /** Enable player to interact with transitions */
    setInteractive(){
        this.interactive = true;
    }

    /**
     * Removes all transitions from first state to second
     * @param {State} startState 
     * @param {string} endStateName 
     * @param {string} key - key for transition
     */
    removeTransitions(startState, endStateName, key){
        
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

        delete this.transitionObjects[key];
    }

    /**
     * Adds menu of letters to click at given point
     * @param {TransitionPoint} hitArea 
     * @param {string} endName 
     * @param {Point} mid - object with x and y properties 
     * @param {string} key 
     */
    addLetterMenu(point, endName, mid, key){

        // Update existing letters to new position
        if (point.hasOwnProperty("letterArray")){
            for (let i = 0; i < this.scene.language.length; i++){
                point.letterArray[i].setPosition(mid.x + i*30, mid.y);
            }
        // Create new letters
        } else{ 
            point.createLetters(mid);
        }
    }

    /**
     * Returns point for the line to be drawn through
     * @param {QuadraticBezier|Null} curve - curve to get mid point of, or null
     * @param {string} key - key for transition, or null
     * @param {Vector2} [startPoint] - must be included if other params are null
     * @param {Vector2} [endPoint] - must be included if other params are null
     * @returns {Vector2} - object with x and y properties 
     */
    getControlPoint(curve, key, startPoint, endPoint){
        
        // Already a point defined, return the position
        if (key && this.transitionObjects[key].point && !this.transitionObjects[key].point.update){
            return new Phaser.Math.Vector2(this.transitionObjects[key].point.getPosition());
            
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

    /**
     * Allows access to data on specified transition
     * @param {string} key - String indexing transition
     * @returns {string} Object containing data of specified transition, or null if invalid key
     * @public
     */
    getObject(key){
        if (this.transitionObjects.hasOwnProperty(key)){
            return this.transitionObjects[key];
        } else {
            return null
        }
    }
    
    /**
     * Allows access to data on all transitions
     * @returns Object containing data on all transitions
     * @public
     */
    getAllObjects(){
        return this.transitionObjects;
    }

    /**
     * Removes letters from specified point
     * @param {string} key - String indexing transition 
     */
    removeLetterArray(key){
        this.transitionObjects[key].point.letterArray.forEach((letter) => {letter.destroy()});;
        delete this.transitionObjects[key].point.letterArray;
    }

    /** 
     * Adds new transition to transitionObjects
     * @param {string} key - Key to add
     * @param {string} input - Character to define transition over
     */
    newTransition(key, input){
        this.transitionObjects[key] = {'line': null, 'label': input, 'point': null, 'update': false};
        this.automata.addKey(key);
    }

    /**
     * Flag that a transition needs updating
     * @param {string} key - Key of transition to update 
     */
    setToUpdate(key){
        this.transitionObjects[key].update = true;
    }

    removeFromUpdate(key){
        this.transitionObjects[key].update = false;
    }

}