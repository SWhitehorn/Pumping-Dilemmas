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
        const leveldata = data.create0Data;
        this.scene.start('CreateTutorial', {automata: leveldata.automata, words: leveldata.words, language: leveldata.language, alphabet:leveldata.alphabet});
      });

      const btn2 = this.add.text(20, 60, 'Create new level', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn2.on('pointerup', () => {
        const createLevelData = data.createLevelData;
        this.scene.start('LevelCreator', {automata:createLevelData.automata, word:createLevelData.words, alphabet:createLevelData.alphabet, language:createLevelData.language}); 
      });

      const btn3 = this.add.text(20, 100, 'Level 3', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn3.on('pointerup', () => {
        this.scene.start('Non_RegularLevel', {language:level3Data.language}); 
      });
      
    }
  }