import colours from "/src/utils/colours.js";

export default (scene, language) => {
    
    const createLabel = (scene, language) => {
        
        // Catch null language
        if (!language){
            language = ""
        }

        return scene.rexUI.add.label({

            width: 750,
            height: 50,
            background: scene.add.rexRoundRectangle(0, 0, 1, 1, {}, colours.DARKBLUE).setStrokeStyle(2, colours.BLACK),
            text: scene.add.text(0, 0, language, {color: colours.TEXTWHITE, fontSize: '20px', fontFamily: 'Quantico', align: 'center'}),
            align: 'center'
        })
        
    }

    const createBackButton = (scene) => {

        return scene.rexUI.add.label({

            width: 50,
            height: 50,
            background: scene.add.rexRoundRectangle(0, 0, 1, 1, {}, colours.WHITE).setStrokeStyle(2, colours.BLACK),
            icon: scene.add.image(0, 0, 'backArrow').setInteractive().on('pointerup', () => {
                scene.scene.start('LevelSelect');
            }),
            space: {left: 10}
        });
    }

    return scene.rexUI.add.sizer({
        orientation: 'x',
        x: 400,
        y: 25,
        width: 800,
        height: 50,
    })
    .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {}, colours.WHITE).setStrokeStyle(2, colours.BLACK))
    .add(createLabel(scene, language), {align: 'left', expand: 'true'})
    .add(createBackButton(scene), {align: 'right', expand: 'true'});


    
}