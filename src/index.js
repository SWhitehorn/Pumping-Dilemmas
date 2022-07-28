import LevelSelect from "/src/scenes/infrastructure/levelSelectScene.js";
import IntroScene from "/src/scenes/infrastructure/introScene.js"
import CreateLevel from "/src/scenes/createAutomataScene.js"
import AddWordLevel from "/src/scenes/addWordScene.js"
import ControlLoopLevel from "/src/scenes/loop/controlLoopScene.js";
import ComputerLoopLevel from "/src/scenes/loop/computerLoopScene.js";
import Non_RegularLevel from "/src/scenes/non-regularChooseWord.js";
import Non_RegularSelectRepeats from "/src/scenes/loop/non-regularSelectRepeatsScene.js";
import LoopLevel from "/src/scenes/loop/baseLoopScene.js";
import LevelCreator from "/src/scenes/infrastructure/newLevelCreatorScene.js";
import LevelEnd from "/src/scenes/infrastructure/levelEndScene.js";
import TestCreateLevel from "/src/scenes/testAutomataScene.js";
import colours from "/src/utils/colours.js";


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
    backgroundColor: colours.BLUE,
    width: 800,
    height: 500,
    scene: scenes,
    parent: 'canvas-container'
};

const game = new Phaser.Game(config);