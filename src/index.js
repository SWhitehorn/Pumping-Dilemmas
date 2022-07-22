import LevelSelect from "./levelSelectMenu/levelSelect.js";
import IntroScene from "./levels/introScene.js"
import CreateLevel from "./levels/createAutomataScenes/createLevel.js";
import AddWordLevel from "./levels/addWord/addWordLevel.js";
import ControlLoopLevel from "./levels/loopScenes/controlLoopLevel.js";
import ComputerLoopLevel from "./levels/loopScenes/computerLoopLevel.js";
import Non_RegularLevel from "./levels/addWord/non-regularChooseWord.js";
import Non_RegularSelectRepeats from "./levels/loopScenes/non-regularSelectRepeats.js";
import LoopLevel from "./levels/loopScenes/loopLevel.js";
import LevelCreator from "./levels/createAutomataScenes/levelCreator.js";
import LevelEnd from "./levels/levelEndScene.js";
import TestCreateLevel from "./levels/createAutomataScenes/testCreate.js";


const scenes = [LevelSelect, 
    IntroScene,
    ControlLoopLevel, 
    CreateLevel, 
    AddWordLevel, 
    ComputerLoopLevel, 
    Non_RegularLevel, 
    Non_RegularSelectRepeats,
    LoopLevel, 
    LevelCreator, 
    LevelEnd,
    TestCreateLevel
]

const config = {
    type: Phaser.AUTO,
    backgroundColor: "88add5",
    width: 800,
    height: 500,
    scene: scenes
};

const game = new Phaser.Game(config);