import colours from "/src/utils/colours.js"

export default (scene) => {
    
    const COLOR_PRIMARY = colours.LIGHTBLUE;
    const COLOR_LIGHT = colours.WHITE;
    const COLOR_DARK = colours.DARKBLUE;

    var content = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.`;
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

                text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),

                action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

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
                    this.typeNextPage();
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

        return textBox;
    }

    const getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
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

    const getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
            return scene.rexUI.add.BBCodeText(0, 0, '', {
                fixedWidth: fixedWidth,
                fixedHeight: fixedHeight,

                fontSize: '20px',
                wrap: {
                    mode: 'word',
                    width: wrapWidth
                },
                maxLines: 3
            })
    }

    createTextBox(scene, 400, 250, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 65,
        })
        .start(content, 50);
}