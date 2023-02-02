import textBox from "../../objects/components/textBox.js";
import Level from "../../scenes/levelTemplate.js";
import addWordUI from "../../objects/components/addWordUI.js";

export default class OpeningScene extends Level {
  repeat = true;

  constructor() {
    super("OpeningScene");
  }

  preload() {
    super.preload();
    this.load.image(
      "nextPage",
      "https://raw.githubusercontent.com/SWhitehorn/Pumping-Dilemmas/main/assets/arrow-down-left.png"
    );
  }

  create({ automata, word, language, lines }) {
    this.word = word;

    super.create(automata, language);

    textBox(this, lines);
  }

  update() {
    if (this.UIAdded) {
      this.textEntry.text = this.word;
    }
  }

  textBoxCallback() {
    this.UI = addWordUI(this).layout();
    this.repeat = false;
    const play = this.UI.getElement("right")
      .getElement("label")
      .getElement("icon");

    play.on("pointerup", () => {
      this.automata.stopComputation();
      this.automata.startComputation();
    });

    this.UIAdded = true;
  }
}
