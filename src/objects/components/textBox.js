import colours from "../../utils/colours.js";
import addWordUI from "./addWordUI.js";

/**
 * Adds a textBox to the scene, displaying the message
 * @param {Scene} scene - Scene to add textBox to
 * @param {String[]} lines - Message to display
 * @param {Number} y - Overrides default y position of textBox (at bottom of screen)
 */
export default (scene, lines, y=null) => {
    
    let page = 0;
    

    const content = lines.join('\f\n')

    let yPos;

    // Set y position to y if defined, otherwise default to bottom of screen
    y ? yPos = y : yPos = 450;

    const GetValue = Phaser.Utils.Objects.GetValue;
    
    const createTextBox = function (scene, x, y, config) {
        
        var wrapWidth = GetValue(config, 'wrapWidth', 0);
        var fixedWidth = GetValue(config, 'fixedWidth', 0);
        var fixedHeight = GetValue(config, 'fixedHeight', 0);
        var textBox = scene.rexUI.add.textBox({
                x: x,
                y: y,

                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, colours.DARKBLUE)
                    .setStrokeStyle(2, colours.LIGHTBLUE),

                text: getTextObject(scene, wrapWidth, fixedWidth, fixedHeight),

                action: scene.add.image(0, 0, 'nextPage').setTint(colours.WHITE).setVisible(false),

                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                    icon: 10,
                    text: 10,
                }
            })
            .setOrigin(0.5)
            .layout();

        textBox
            .setInteractive()
            .on('pointerdown', function () {
                var icon = this.getElement('action').setVisible(false);
                this.resetChildVisibleState(icon);
                if (this.isTyping) {
                    this.stop(true);
                } else {
                    if (this.isLastPage){
                        this.destroy();
                        
                        // textBoxCallback defines what a scene does after textbox is destroyed, but may not be defined.
                        try {
                            scene.textBoxCallback();
                        } catch (e) {
                            console.log('Function does not exist');
                        }
                        
                        return;
                    } else {
                        this.typeNextPage(); 
                        if (scene.scene.key === "OpeningScene"){
                            if (page === 3){ scene.startComputation();}
                        } else if (scene.scene.key === "LoopTutorial"){
                        }
                        
                        page++;
                    }
                }
            }, textBox)
            .on('pageend', function () {
                if (this.isLastPage) {
                    return;
                } 
                var icon = this.getElement('action').setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30', // '+=100'
                    ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false
                });
            }, textBox)
        //.on('type', function () {
        //})


        textBox.setDepth(2);
        return textBox;
    }

    const getTextObject = function (scene, wrapWidth, fixedWidth, fixedHeight) {
        return scene.add.text(0, 0, '', {
                color: colours.TEXTWHITE,
                fontSize: '20px',
                wordWrap: {
                    width: wrapWidth
                },
                maxLines: 3,
                fontFamily: 'Quantico'
            })
            .setFixedSize(fixedWidth, fixedHeight);
    }

    createTextBox(scene, 400, yPos, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
        })
        .start(content, 50);
}