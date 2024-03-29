import "../typedefs/typedefs.js";
import colours from "../utils/colours.js";
import { sameState } from "../utils/utils.js";

/**
 * Class defining points on transition. Used to store data about transition.
 * @class
 */
export default class TransitionPoint {
  selected = false;
  dragging = false;
  SIZE = 8;
  inputs = [];

  /**
   * Creates new point
   * @param {number} x - x position of point
   * @param {number} y - y position of points
   * @param {Object} scene - Phaser scene that point belongs to
   * @param {string} key - Key for transition
   * @returns {TransitionPoint} This
   */
  constructor(x, y, scene, key) {
    this.x = x;
    this.y = y;
    this.scene = scene;
    this.key = key;

    // Flags
    this.active = false; // Whether point has moved from default (straight-line) position

    return this;
  }

  /**
   * Returns co-ordinates of point
   * @returns {Point} Point containing x and y properties of transitionPoint
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   * Set position of transition point
   * @param {number} x - x position to set to
   * @param {number} y - y position to set to
   * @returns {TransitionPoint} This
   */
  setPosition(x, y) {
    // Allow for method to be called with object with x and y properties
    if (!y && typeof x === "object" && x.hasOwnProperty("y")) {
      y = x.y;
      x = x.x;
    }

    this.x = x;
    this.y = y;

    return this;
  }

  /**
   * Destroys point
   */
  destroy() {
    console.log("destroying ", this.key);

    this.scene.automata.removeKey(this.key);
    this.scene.transitions.transitionObjects[this.key].label.destroy();
    delete this.scene.transitions.transitionObjects[this.key];
  }

  /**
   * Adds given input symbol to transitionPoint array
   * @param {string} input - symbol to add to transition
   */
  addInput(input) {
    this.inputs.push(input);
    return this;
  }

  /**
   * Set start state of transition
   * @param {State} startState - Starting state of transition
   * @returns {transitionPoint} This
   */
  setStart(startState) {
    this.startState = startState;
    return this;
  }

  /**
   * Set end state of transition
   * @param {State} end - End state of transition
   * @param {string} endName - String with code of end state
   * @returns {TransitionPoint} - This
   */
  setEnd(end, endName) {
    this.endState = end;
    this.endName = endName;
    return this;
  }

  /**
   * Adds or removes given letter from inputs, depending on whether is included
   * @param {string} letter - Letter to add/remove
   */
  changeInput(letter) {
    const transitions = this.startState.transitions;

    if (transitions.hasOwnProperty(letter)) {
      const index = transitions[letter].indexOf(this.endName);

      // Transition between states over letter is defined, remove it
      if (index != -1) {
        transitions[letter].splice(index, 1);
        this.inputs.splice(this.inputs.indexOf(letter), 1);

        // Delete data if array is empty
        if (transitions[letter].length === 0) {
          delete transitions[letter];
        }

        if (this.hasEmptyTransition()) {
          if (transitions.hasOwnProperty("ε")) {
            transitions["ε"].push(this.endName);
          } else {
            transitions["ε"] = [this.endName];
          }
          this.inputs.push("ε");
        }

        // Transition over letter is defined, but not to end state
      } else {
        transitions[letter].splice(0, 0, this.endName);
        this.inputs.push(letter);
      }

      // Transition over input is not defined, create new transition
    } else {
      if (this.hasEmptyTransition()) {
        // Clear inputs
        this.inputs = [];

        // Delete ε-transitions
        if (transitions["ε"]) {
          transitions["ε"].splice(transitions["ε"].indexOf(this.endName), 1);
          if (transitions["ε"].length === 0) {
            delete transitions["ε"];
          }
        }
      }

      transitions[letter] = [this.endName];
      this.inputs.push(letter);

      console.log(transitions[letter]);
      console.log(this.inputs);
    }
  }

  /**
   * Render letter in green if part of transition, red if not
   * @param {string} letter - single letter
   * @param {number} i - position of letter
   */
  renderLetter(letter, i) {
    const y = sameState(this.key) ? this.y - 30 : this.y;

    // Render letter in green if included in transition
    if (
      this.startState.transitions.hasOwnProperty(letter) &&
      this.startState.transitions[letter].includes(this.endName)
    ) {
      this.letterArray.push(
        this.scene.add.text(this.x + 10 + i * 30, y, letter, {
          fontSize: "30px",
          color: colours.TEXTWHITE,
        })
      );

      // Render letter in yellow if not
    } else {
      this.letterArray.push(
        this.scene.add.text(this.x + 10 + i * 30, y, letter, {
          fontSize: "30px",
          color: "#000000",
        })
      );
    }
  }

  /**
   * Remove letter menu if present
   */
  removeLetters() {
    if (this.letterArray) {
      this.letterArray.forEach((letter) => {
        letter.destroy();
      });
      delete this.letterArray;
    }

    // Set normal label to render again
    if (this.scene.transitions.transitionObjects[this.key]) {
      this.scene.transitions.transitionObjects[this.key].label.visible = true;
    }
  }

  /**
   * Test whether array of inputs is empty
   * @returns {boolean} Returns true no inputs are present in array
   */
  hasEmptyTransition() {
    return (
      this.inputs.length === 0 ||
      (this.inputs.includes("ε") && this.scene.deterministic)
    );
  }

  /**
   * Tests whether given input is defined for point
   * @param {string} input - Single character representing input
   * @returns {boolean} True if input present
   */
  definedOver(input) {
    return this.inputs.indexOf(input) !== -1;
  }
}
