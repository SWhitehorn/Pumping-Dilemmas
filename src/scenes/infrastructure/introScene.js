import data from "/assets/data/data.js"


export default class IntroScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'IntroScene'
      });
    }
  
    create() {
      const btn1 = this.add.text(20, 20, 'Opening scene test', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn1.on('pointerup', () => {
        const leveldata = data.level0Data;
        this.scene.start('LoopTutorial', {automata: leveldata.automata, word: leveldata.word[0], language: leveldata.language});
      });

      const btn2 = this.add.text(20, 60, 'Create new level', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn2.on('pointerup', () => {
        const level2Data = data.level2Data;
        this.scene.start('LevelCreator', {automata:level2Data.automata, word:level2Data.words, alphabet:level2Data.alphabet, language:level2Data.language}); 
      });

      const btn3 = this.add.text(20, 100, 'Level 3', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn3.on('pointerup', () => {
        this.scene.start('Non_RegularLevel', {language:level3Data.language}); 
      });
      
    }
  }