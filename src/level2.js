import Level from "./levelTemplate.js";
import Colours from "./colours.js";


// Draggable automaton
export default class Level2 extends Level {

    inputWord = "bbbbab"
    inputAutomata = {}
    word = "bbbbab"
    draw = false;

    constructor(){
        super('Level2')
    }

    create({automata}){
        this.draw = false;
        this.input.mouse.disableContextMenu(); // Allow for right clicking
        this.interactive = true;
        this.interactiveGraphics = this.add.graphics({ lineStyle: { width: this.THICKNESS, color: Colours.BLACK } });

        super.create(automata);
        
        const getNextLetter = (letter) => {
            if (letter === 'z'){
                return 'a';
            }
            return String.fromCharCode(letter.charCodeAt(0) + 1);
        }
        

        // Iterate through states, adding
        for (let s in this.automata.states){
            let state = this.automata.states[s];
            this.setDrag(state);
            state.graphic.on('pointerup', (pointer) => {
                
                if (pointer.rightButtonReleased()){
                    console.log('rightdown');
                    
                    // Start drawing transition
                    if (!this.draw){
                        this.draw = true;
                        this.selectedState = state;
                    }
                    
                    // Connect states
                    else{
                        let input = 'a';
                        // Get first available letter
                        while (this.selectedState.transitions.hasOwnProperty(input)){
                            input = getNextLetter(input);
                        }
                        
                        this.draw = false;
                        this.selectedState.transitions[input] = [s];
                    }
                }
            })
        }

        this.input.on('pointermove', (pointer) => {

            this.graphics.clear();
            if (this.draw)
            {
                const line = new Phaser.Geom.Line (this.selectedState.graphic.x, this.selectedState.graphic.y, pointer.x, pointer.y);
                this.graphics.strokeLineShape(line);
            }

    
        }); 
    }

    update(){
        for (let key in this.labels){
            this.labels[key].destroy();
        }
        this.labels = {}
        if (!this.draw){
            this.graphics.clear();
        }
        this.drawTransitions(); 
    }
    
    setDrag(state){
        this.input.setDraggable(state.graphic);
        this.input.on('drag', function (pointer, graphic, dragX, dragY) {
            graphic.x = dragX;
            graphic.y = dragY;
            if(graphic.inner){
                graphic.inner.x = dragX;
                graphic.inner.y = dragY;
            }
        })
    }

    
}