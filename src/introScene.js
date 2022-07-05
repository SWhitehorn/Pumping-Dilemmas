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
        this.scene.start('Level1', {automata:level1Data[0], word:level1Data[1]})
      });

      const btn2 = this.add.text(20, 60, 'Level 2', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn2.on('pointerup', () => {
        console.log('game started click');
        this.scene.start('Level2', {automata:level2Data[0], word:level2Data[1]}); 
      });

      const btn3 = this.add.text(20, 100, 'Level 3', { fontSize: '30px', color: '#ffffff' }).setInteractive();
      btn3.on('pointerup', () => {
        console.log('game started click');
        this.scene.start('Level3', {automata:level1Data[0]}); 
      });
    }
  }