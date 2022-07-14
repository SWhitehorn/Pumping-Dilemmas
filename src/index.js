import IntroScene from "./levels/introScene.js"
//import LoopLevel from "./levels/loopLevel.js";
import CreateLevel from "./levels/createLevel.js";
import AddWordLevel from "./levels/addWordLevel.js";
import ControlLoopLevel from "./levels/controlLoopLevel.js";
import ComputerLoopLevel from "./levels/computerLoopLevel.js";
import LoopLevel from "./levels/loopLevel.js";

const config = {
    type: Phaser.AUTO,
    backgroundColor: "88add5",
    width: 800,
    height: 500,
    scene: [IntroScene, ControlLoopLevel, CreateLevel, AddWordLevel, ComputerLoopLevel]
};

const game = new Phaser.Game(config);