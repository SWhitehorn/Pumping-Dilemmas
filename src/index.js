import Level from "./levelTemplate.js";
import IntroScene from "./introScene.js"
import LoopLevel from "./loopLevel.js";
import CreateLevel from "./createLevel.js";
import AddWordLevel from "./addWordLevel.js";

const config = {
    type: Phaser.AUTO,
    backgroundColor: "88add5",
    width: 800,
    height: 500,
    scene: [IntroScene, LoopLevel, CreateLevel, AddWordLevel]
};

const game = new Phaser.Game(config);