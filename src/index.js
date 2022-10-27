import LevelSelect from "./scenes/infrastructure/levelSelectScene.js";
import IntroScene from "./scenes/infrastructure/introScene.js"
import CreateLevel from "./scenes/createAutomataScene.js"
import AddWordLevel from "./scenes/addWordScene.js"
import ControlLoopLevel from "./scenes/loop/controlLoopScene.js";
import ComputerLoopLevel from "./scenes/loop/computerLoopScene.js";
import Non_RegularLevel from "./scenes/non-regularChooseWord.js";
import Non_RegularSelectRepeats from "./scenes/loop/non-regularSelectRepeatsScene.js";
import LoopLevel from "./scenes/loop/baseLoopScene.js";
import LevelCreator from "./scenes/infrastructure/newLevelCreatorScene.js";
import LevelEnd from "./scenes/infrastructure/levelEndScene.js";
import TestCreateLevel from "./scenes/testAutomataScene.js";
import colours from "./utils/colours.js";
import OpeningScene from "./scenes/tutorials/openingScene.js";
import LoopTutorial from "./scenes/tutorials/loopTutorialScene.js";
import CreateTutorial from "./scenes/tutorials/automataTutorial.js";


const scenes = [
    
    // Infrastructure levels (start menu, etc)
    LevelSelect, IntroScene,
    
    // Loop levels
    LoopLevel, ComputerLoopLevel, ControlLoopLevel, LoopTutorial,
    
    // Creation levels
    CreateLevel, CreateTutorial,

    // Choosing word levels 
    Non_RegularLevel, Non_RegularSelectRepeats, AddWordLevel,
    
    // Others
    LevelCreator, TestCreateLevel, OpeningScene,
]

const config = {
    type: Phaser.AUTO,
    backgroundColor: colours.BLUE,
    width: 800,
    height: 500,
    scene: scenes,
    parent: 'canvas-container',
    dom: {
        createContainer: true
    }
    
};

const game = new Phaser.Game(config);