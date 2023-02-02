import "../../typedefs/typedefs.js";
import LoopLevel from "./baseLoopScene.js";

/**
 * Level where player can choose the number of loops
 * @class
 */
export default class ControlLoopLevel extends LoopLevel {
  constructor() {
    super("ControlLoopLevel");
  }

  /** Adds buttons for the player to increase or decrease number of loops */
  create({ automata, word, language, repeats }) {
    super.create({ automata, word, language });

    this.UIElements.play.on("pointerup", () => {
      this.automata.stopComputation();
      this.automata.startComputation();
    });
  }
}
