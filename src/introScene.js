import { level1Data, level2Data } from "./dfa.js";


export default class IntroScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'IntroScene'
      });
    }
  
    create() {
      const btn1 = this.add.text(20, 20, 'Level 1', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn1.on('pointerup', () => {
        console.log('game started click');
        const word = "abbab"
        this.scene.start('LoopLevel', {automata:level1Data.automata, word:level1Data.word[0]})
      });

      const btn2 = this.add.text(20, 60, 'Level 2', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn2.on('pointerup', () => {
        console.log('game started click');
        this.scene.start('CreateLevel', {automata:level2Data.automata, word:level2Data.word[0], language:level2Data.language}); 
      });

      const btn3 = this.add.text(20, 100, 'Level 3', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn3.on('pointerup', () => {
        console.log('game started click');
        this.scene.start('AddWordLevel', {automata:level1Data.automata}); 
      });
    }
  }