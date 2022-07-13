import Level from "./levels/levelTemplate.js";
import IntroScene from "./levels/introScene.js"
import LoopLevel from "./levels/loopLevel.js";
import CreateLevel from "./levels/createLevel.js";
import AddWordLevel from "./levels/addWordLevel.js";

const config = {
    type: Phaser.AUTO,
    backgroundColor: "88add5",
    width: 800,
    height: 500,
    scene: [IntroScene, LoopLevel, CreateLevel, AddWordLevel]
};

const game = new Phaser.Game(config);