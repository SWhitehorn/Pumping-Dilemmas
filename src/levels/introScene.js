import data from "../data.js";


export default class IntroScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'IntroScene'
      });
    }
  
    create() {
      const btn1 = this.add.text(20, 20, 'Level 1', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn1.on('pointerup', () => {
        const word = "abbab";
        const level1Data = data[0];
        this.scene.start('ControlLoopLevel', {automata:level1Data.automata, word:level1Data.word[0], language:level1Data.language});
      });

      const btn2 = this.add.text(20, 60, 'Level 2', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn2.on('pointerup', () => {
        const level2Data = data[2];
        this.scene.start('LevelCreator', {automata:level2Data.automata, word:level2Data.word[0], alphabet:level2Data.alphabet, language:level2Data.language}); 
      });

      const btn3 = this.add.text(20, 100, 'Level 3', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn3.on('pointerup', () => {
        this.scene.start('Non_RegularLevel', {language:level3Data.language}); 
      });
      
    }
  }