import IntroScene from "./levels/introScene.js"
import CreateLevel from "./levels/createLevel.js";
import AddWordLevel from "./levels/addWordLevel.js";
import ControlLoopLevel from "./levels/controlLoopLevel.js";
import ComputerLoopLevel from "./levels/computerLoopLevel.js";
import Non_RegularLevel from "./levels/nonRegular/non-regularChooseWord.js";
import Non_RegularSelectRepeats from "./levels/nonRegular/non-regularSelectRepeats.js";


const scenes = [IntroScene, ControlLoopLevel, CreateLevel, AddWordLevel, ComputerLoopLevel, Non_RegularLevel, Non_RegularSelectRepeats]

const config = {
    type: Phaser.AUTO,
    backgroundColor: "88add5",
    width: 800,
    height: 500,
    scene: scenes
};

const game = new Phaser.Game(config);