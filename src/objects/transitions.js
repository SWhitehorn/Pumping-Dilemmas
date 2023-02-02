import "../typedefs/typedefs.js";
import colours from "../utils/colours.js";

import TransitionPoint from "./transitionPoint.js";
import Automata from "./automata.js";
import { sameState, splitKey } from "../utils/utils.js";
import createMenu from "./components/letterMenu.js";

/**
 * Handles drawing and updating of transitions
 * @class
 *  */
export default class Transitions {
  SIZE = 30;
  TRISIZE = 15;

  /**
   *
   * @param {Object} graphics - Phaser graphics object
   * @param {Automata} automata - Input automata
   * @param {Object} scene - Game scene that transitions is attached to
   */
  constructor(graphics, automata, scene) {
    this.graphics = graphics;
    this.automata = automata;

    // Required for access to scene methods e.g. adding shapes
    this.scene = scene;
    this.interactive = scene.interactive;

    // Object storing data about the transitions between states, indexed by startState + endState
    this.transitionObjects = {};
    this.drawTransitions();
  }

  /**
   * Draws all transitions
   */
  drawTransitions() {
    // Error handling in case of no automata
    if (!this.automata) {
      return;
    }

    // Iterate through transitions of each state
    for (let startName in this.automata.states) {
      let state = this.automata.states[startName];

      for (let input in state.transitions) {
        state.transitions[input].forEach((endName) => {
          // Key for transition is start state concatenated with end state
          const key = startName + "," + endName;

          // Transition already exists, add new input to label
          if (this.transitionObjects.hasOwnProperty(key)) {
            let transitionData = this.transitionObjects[key];

            // Check for null before adding text
            if (transitionData.label) {
              transitionData.label.text = transitionData.label.text
                .concat(",")
                .concat(input);
            }

            // Prevent duplicates from being added to array
            if (this.interactive && !transitionData.point.definedOver(input)) {
              this.transitionObjects[key].point.addInput(input);
            }

            // Create new transition
          } else {
            // Add data to transitionObjects
            this.newTransition(key);
            this.drawSingleTransition(
              state,
              this.automata.states[endName],
              input,
              key,
              endName
            );
          }
        });
      }
    }

    this.addStartArrow();
  }

  /**
   * Update location of all transitions
   */
  updateTransitions() {
    for (let key in this.transitionObjects) {
      const transitionData = this.transitionObjects[key];
      const stateNames = splitKey(key);
      const startState = this.automata.getState(stateNames[0]);
      const endState = this.automata.getState(stateNames[1]);

      // Line has not been created
      if (!transitionData.line) {
        this.drawSingleTransition(
          startState,
          endState,
          transitionData.label,
          key,
          stateNames[1]
        );

        // Line needs updating
      } else if (transitionData.update) {
        // Transition from one state to other
        if (stateNames[0] !== stateNames[1]) {
          // Get vector points
          const startPoint = new Phaser.Math.Vector2(
            startState.graphic.x,
            startState.graphic.y
          );
          const endPoint = new Phaser.Math.Vector2(
            endState.graphic.x,
            endState.graphic.y
          );

          const midPoint = this.getControlPoint(
            transitionData.line,
            key,
            startPoint,
            endPoint,
            startState,
            stateNames[1]
          );

          transitionData.line.points = [startPoint, midPoint, endPoint];

          // Update position of interactive point
          transitionData.point.setPosition(midPoint);

          this.updateLabel(transitionData, stateNames[1], key, midPoint);
          transitionData.line.draw(this.graphics);

          // Circle transition
        } else {
          // Set position of line and point
          transitionData.line.setPosition(
            startState.graphic.x,
            startState.graphic.y - this.SIZE
          );
          transitionData.point.setPosition(
            transitionData.line.x,
            transitionData.line.y - this.SIZE
          );

          this.updateLabel(
            transitionData,
            stateNames[1],
            key,
            transitionData.point.getPosition()
          );
          this.graphics.strokeCircleShape(transitionData.line);
        }

        // Draw transition based on position of transitionPoint
      } else {
        // Normal transition
        if (stateNames[0] !== stateNames[1]) {
          // Update control point of line
          const controlPoint = this.getControlPoint(
            transitionData.line,
            key,
            null,
            null
          );
          transitionData.line.points[1] = controlPoint;
          this.updateLabel(transitionData, stateNames[1], key, controlPoint);
          transitionData.line.draw(this.graphics);

          // Circle transition
        } else {
          this.updateLabel(
            transitionData,
            stateNames[1],
            key,
            transitionData.point.getPosition()
          );
          this.graphics.strokeCircleShape(transitionData.line);
        }
      }

      transitionData.line.needsUpdate = true;
      this.addDirectionArrow(transitionData.line, endState);
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
  drawSingleTransition(startState, endState, input, key, endName) {
    // Transitions is from state to itself
    if (sameState(key)) {
      // Add line by adding second circle and stroking outline
      const line = new Phaser.Geom.Circle(
        startState.graphic.x,
        startState.graphic.y - this.SIZE,
        this.SIZE
      );
      this.transitionObjects[key].line = line;

      this.graphics.strokeCircleShape(line);

      // Add direction arrow
      this.addDirectionArrow(line, endState);

      // Allow players to remove the transition
      if (this.interactive) {
        this.setCircleInteractivity(line, startState, input, key, endName);
      } else {
        const labelY = startState.graphic.y - this.SIZE * 3;
        this.addLabel(
          endName,
          { x: startState.graphic.x, y: labelY },
          input,
          key,
          line
        );
      }
    }
    // Transition between states
    else {
      // Get Control points for line
      const startPoint = new Phaser.Math.Vector2(
        startState.graphic.x,
        startState.graphic.y
      );
      const endPoint = new Phaser.Math.Vector2(
        endState.graphic.x,
        endState.graphic.y
      );
      const mid = this.getControlPoint(
        null,
        key,
        startPoint,
        endPoint,
        startState,
        endName
      );

      // Add line to objects
      this.transitionObjects[key].line = new Phaser.Curves.Spline([
        startPoint,
        mid,
        endPoint,
      ]);
      const line = this.transitionObjects[key].line;

      // Draw line
      line.draw(this.graphics);

      this.addDirectionArrow(line, endState);

      // Add interactive component to line
      if (this.interactive) {
        this.setLineInteractivity(
          line,
          startState,
          endState,
          key,
          input,
          endName
        );
      } else {
        this.addLabel(endName, mid, input, key, line);
      }
    }
  }
  /**
   * Draws the given triangle
   * @param {Triangle} tri - Phaser Geom Triangle
   */
  drawTriangle(tri) {
    this.graphics.fillStyle(colours.BLACK);
    this.graphics.fillTriangleShape(tri);
    this.graphics.strokeTriangleShape(tri);
  }

  /**
   * Adds a direction arrow to the line
   * @param {SplineCurve|Arc} line - Phaser object for visual transition
   * @param {State} endState - State to point at
   */
  addDirectionArrow(line, endState) {
    // Transition from one state to other
    if (line.type === "SplineCurve") {
      // Calculate distance along line
      const percent = this.SIZE / line.getLength();

      const intersectPoint = line.getPointAt(1 - percent);

      const tri = new Phaser.Geom.Triangle.BuildEquilateral(
        intersectPoint.x,
        intersectPoint.y,
        this.TRISIZE
      );

      // Rotate triangle to match gradient of line
      const angleLine = new Phaser.Geom.Line(
        intersectPoint.x,
        intersectPoint.y,
        endState.graphic.x,
        endState.graphic.y
      );
      let angle = Phaser.Geom.Line.Angle(angleLine); // Rotate triangle to match angle of line
      angle += 1.571; // Rotate 3/4 of circle
      Phaser.Geom.Triangle.RotateAroundXY(
        tri,
        intersectPoint.x,
        intersectPoint.y,
        angle
      );
      this.drawTriangle(tri);

      // Circular transition
    } else {
      // Parametric equations for point on circle
      const x =
        endState.graphic.x + this.SIZE * Math.cos(Phaser.Math.DegToRad(30));
      const y =
        endState.graphic.y - this.SIZE * Math.sin(Phaser.Math.DegToRad(30));
      const tri = new Phaser.Geom.Triangle.BuildEquilateral(x, y, this.TRISIZE);

      // Rotate triangle
      Phaser.Geom.Triangle.RotateAroundXY(tri, x, y, Phaser.Math.DegToRad(200));

      this.drawTriangle(tri);
    }
  }

  /** Add input arrow to start state */
  addStartArrow() {
    const startState = this.automata.getStart();
    const direction = this.automata.getStartArrowDirection();

    // Set default to lhs
    let x = startState.graphic.x - this.SIZE;
    let y = startState.graphic.y;
    let rotateBy = Phaser.Math.DegToRad(90);

    if (direction === "top") {
      x = startState.graphic.x;
      y = startState.graphic.y - this.SIZE;
      rotateBy = Phaser.Math.DegToRad(180);
    }
    const tri = new Phaser.Geom.Triangle.BuildEquilateral(x, y, this.TRISIZE);
    Phaser.Geom.Triangle.RotateAroundXY(tri, x, y, rotateBy);
    this.drawTriangle(tri);
  }

  /**
   * Adds a label to the given transition
   * @param {string} endName - String containing target state name
   * @param {Object} point - Object with x and y properties
   * @param {string} input - Single char string
   * @param {string} key - String with name of start and end state
   * @param {SplineCurve} line - Phaser Curve SplineCurve object
   */
  addLabel(endName, point, input, key, line) {
    // Add letter menu
    if (
      this.interactive &&
      this.transitionObjects[key].point &&
      this.transitionObjects[key].point.selected
    ) {
      this.addLetterMenu(
        this.transitionObjects[key].point,
        endName,
        point,
        key
      );
    } else {
      // Add fresh label
      if (!sameState(key)) {
        let state = this.scene.automata.getState(splitKey(key)[0]);
        point = new Phaser.Math.Vector2(
          this.getControlPoint(line, key, null, null, state, endName)
        );
      }

      if (!this.interactive) {
        this.transitionObjects[key].label = this.scene.add.text(
          point.x + 10,
          point.y,
          input,
          { fontSize: "30px", color: colours.TEXTWHITE, fontFamily: "Quantico" }
        );
      } else {
        this.transitionObjects[key].label = createMenu(
          this.scene,
          point,
          input,
          this.transitionObjects[key].point
        ).layout();
      }
    }
  }

  /**
   * Updates the position of labels
   * @param {Object} transitionData - Object containing data for transition
   * @param {string} name - Name of target state
   * @param {string} key - Key for transition
   * @param {Point} point - Object with x and y properties
   */
  updateLabel(transitionData, name, key, point) {
    if (transitionData.point.selected) {
      transitionData.label.visible = false;
      this.addLetterMenu(
        transitionData.point,
        name,
        this.getControlPoint(transitionData.line, key),
        key
      );
    } else {
      const y = sameState(key) ? point.y - this.SIZE : point.y;
      transitionData.label.setPosition(point);
      transitionData.label.setText(transitionData.point.inputs.toString());
    }
  }

  /**
   * Adds interactive component to transition from state to itself
   * @param {Arc} line - Phaser object for transition
   * @param {State} state - State containing transition
   * @param {string} input - Input for transition
   * @param {string} key - Key for transition
   * @param {string} name - Name of state
   */
  setCircleInteractivity(line, state, input, key, name) {
    const point = new TransitionPoint(
      line.x,
      line.y - this.SIZE,
      this.scene,
      key
    );
    point.setStart(state).setEnd(state, name).addInput(input);
    this.transitionObjects[key].point = point;
    const labelY = state.graphic.y - this.SIZE * 3;
    this.addLabel(name, { x: state.graphic.x, y: labelY }, input, key, line);
  }

  /**
   *  Adds interactive component to transition from state to different state
   * @param {SplineCurve} line - Phaser object for line
   * @param {State} startState - State state of transition
   * @param {State} endState - Ending state of transition
   * @param {string} key - String with key for transition
   * @param {string} input - Input for transition
   * @param {string} endName - String with name of target state
   */
  setLineInteractivity(line, startState, endState, key, input, endName) {
    const mid = this.getControlPoint(line, key);

    // Create transition point
    const point = new TransitionPoint(mid.x, mid.y, this.scene, key);
    point.setStart(startState).setEnd(endState, endName).addInput(input);

    // Add point to transitionObjects
    this.transitionObjects[key].point = point;
    this.addLabel(endName, mid, input, key, line);
  }

  /** Enable player to interact with transitions */
  setInteractive() {
    this.interactive = true;
  }

  /**
   * Removes all transitions from first state to second
   * @param {string} key - key for transition
   */
  removeTransitions(key) {
    console.log("key: ", key);

    const [startStateName, endStateName] = splitKey(key);
    const startState = this.scene.automata.getState(startStateName);
    const transitions = Object.entries(startState.transitions);
    console.log(startState.transitions);

    // Iterate through [letter, states], check for endState in states
    transitions.forEach((t) => {
      let [letter, states] = t;
      let index = states.indexOf(endStateName);
      if (index !== -1) {
        // Remove element of array pointing to second state
        startState.transitions[letter].splice(index, 1);

        // Delete if empty array after deleting state pointer
        if (!startState.transitions[letter].length) {
          delete startState.transitions[letter];
        }
      }
    });

    if (this.transitionObjects[key]) {
      this.transitionObjects[key].point.destroy();
    }
  }

  /**
   * Adds menu of letters to click at given point
   * @param {TransitionPoint} point
   * @param {string} endName
   * @param {Point} coord - object with x and y properties
   * @param {string} key
   */
  addLetterMenu(point, endName, coord, key) {
    const y = sameState(key) ? coord.y - this.SIZE : coord.y;

    // Update existing letters to new position
    if (point.hasOwnProperty("letterArray")) {
      for (let i = 0; i < this.scene.alphabet.length; i++) {
        point.letterArray[i].setPosition(coord.x + 10 + i * 30, y);
      }
      // Create new letters
    } else {
      point.createLetters(coord);
    }
  }

  /**
   * Returns point for the line to be drawn through
   * @param {SplineCurve|Null} curve - curve to get mid point of, or null
   * @param {string} key - key for transition, or null
   * @param {Vector2} [startPoint] - must be included if other params are null
   * @param {Vector2} [endPoint] - must be included if other params are null
   * @param {State} [state] - Starting state for line
   * @param {string} [endName] -
   * @returns {Vector2} - object with x and y properties
   */
  getControlPoint(curve, key, startPoint, endPoint, state, endName) {
    // Point is active, return the position
    if (
      key &&
      this.transitionObjects[key].point &&
      this.transitionObjects[key].point.active
    ) {
      return new Phaser.Math.Vector2(
        this.transitionObjects[key].point.getPosition()
      );

      // Transition is from self to self
    } else if (sameState(key)) {
      return new Phaser.Math.Vector2(
        this.transitionObjects[key].point.getPosition()
      );

      // Point is defined in automataData
    } else if (state && state.controlPoints && state.controlPoints[endName]) {
      return state.controlPoints[endName];

      // Curve is defined, return halfway point
    } else if (curve) {
      return new Phaser.Math.Vector2(curve.getPointAt(0.5));

      // // No transition point and curve is null
    } else {
      if (!startPoint || !endPoint) {
        console.error("No optional parameters");
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
  getObject(key) {
    if (this.transitionObjects.hasOwnProperty(key)) {
      return this.transitionObjects[key];
    } else {
      return null;
    }
  }

  /**
   * Allows access to data on all transitions
   * @returns Object containing data on all transitions
   * @public
   */
  getAllObjects() {
    return this.transitionObjects;
  }

  /**
   * Removes letters from specified point
   * @param {string} key - String indexing transition
   */
  removeLetterArray(key) {
    this.transitionObjects[key].point.letterArray.forEach((letter) => {
      letter.destroy();
    });
    delete this.transitionObjects[key].point.letterArray;
  }

  /**
   * Adds new transition to transitionObjects
   * @param {string} key - Key to add
   * @param {string} input - Character to define transition over
   */
  newTransition(key, input) {
    this.transitionObjects[key] = {
      line: null,
      label: input,
      point: null,
      update: false,
    };
    this.automata.addKey(key);
  }

  /**
   * Flag that a transition needs updating
   * @param {string} key - Key of transition to update
   */
  setToUpdate(key) {
    this.transitionObjects[key].update = true;
  }

  removeFromUpdate(key) {
    this.transitionObjects[key].update = false;
  }
}
