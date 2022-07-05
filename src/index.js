import Level1 from "/src/level1.js";
import Level from "./levelTemplate.js";
import IntroScene from "/src/introScene.js"
import Level2 from "/src/level2.js";
import Level3 from "/src/level3.js";

const config = {
    type: Phaser.AUTO,
    backgroundColor: "88add5",
    width: 800,
    height: 500,
    scene: [IntroScene, Level1, Level2, Level3]
};

const game = new Phaser.Game(config);