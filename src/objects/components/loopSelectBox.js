import colours from "/src/utils/colours.js";
import lowerUIBox from "./lowerUIBox.js";
import popUp from "./popUp.js"

export default (scene, repeats) => {

    const extraWidth = scene.scene.key==="Non_RegularSelectRepeats" ? 150 : 0;

    // Section containing number of repeats
    const createLeft = (sizer, repeats) => {

        const scene = sizer.scene;

        return scene.rexUI.add.sizer(
            {
                orientation: 'y',
                x: 0,
                y: 0,
                width: 60,
                height: 90,
            })
            .add(scene.rexUI.add.sizer(
                {
                    orientation: 'x',
                    x: 0,
                    y: 0,
                    width: 60,
                    height: 60,
                }
                ).addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tl: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12))
                .add(scene.rexUI.add.label(
                {
                    background: scene.rexUI.add.roundRectangle(0, 0, 1, 1, 5),
                    space: {left: 3, right: 3},
                    text: scene.add.text(0, 0, repeats, { fontSize: '30px', fontFamily: 'Quantico' }),
                }
                ), {proportion: 0, expand: false, padding: {left: 20}, key: 'label'})
            , {key: 'top'})
            .add(scene.rexUI.add.sizer(
                {
                    orientation: 'x',
                    x: 0,
                    y: 0,
                    width: 60,
                    height: 30,
                }
                ).add(scene.rexUI.add.label(
                    {
                        space: {left: 10, right: 3},
                        icon: scene.add.triangle(0, 0, 5, -3, -7, 6, 5, 15, colours.WHITE)
                            .setStrokeStyle(2, colours.BLACK, 1).setInteractive()
                    }), {align: 'left', padding: {left:5}, key: 'decrease'}
                )
                .add(scene.rexUI.add.label(
                    {
                        icon: scene.add.triangle(0, 0, 0, -3, 12, 6, 0, 15, colours.WHITE)
                            .setStrokeStyle(2, colours.BLACK, 1).setInteractive()
                    }), {align: 'right', padding: {left: 10}, key: 'increase'}
                )
            , {key: 'bottom'})
            
    }
    
    // Section containing word
    const createMiddle = (sizer) => {
        const scene = sizer.scene;
        return scene.rexUI.add.sizer(
            {
                orientation: 1,
                width: (320 + extraWidth)
            })
            .addBackground(scene.add.rectangle(0, 0, 1, 1, colours.WHITE))
            .add(scene.rexUI.add.sizer({height: 60}).addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 0}, colours.WHITE).setStrokeStyle(3, 0x010A12), 'background'), {expand: true, key: 'top'})
            .add(scene.rexUI.add.sizer({height: 30}).addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {br: 0}, colours.LIGHTBLUE).setStrokeStyle(3, 0x010A12)), {expand: true, key:'bottom'})
    }

    // Section containing play button
    const createRight = (sizer) => {
        
        const scene = sizer.scene;
        
        return scene.rexUI.add.sizer(
            {
                orientation: 0,
                x: 0,
                y: 0,
                width: 60,
                height: 90,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12))
            .add(scene.rexUI.add.label(
                {
                    background: scene.rexUI.add.roundRectangle(0, 0, 1, 1, 5),
                    space: {left: 3, right: 3},
                    icon: scene.add.triangle(0, 0, 0, -5, 20, 10, 0, 25, colours.WHITE)
                        .setStrokeStyle(2, colours.BLACK, 1).setInteractive().on('pointerup', () => {
                            scene.pressPlay();
                        }),
                },
                    
                ), {proportion: 0, expand: false, padding: {left: 20}, key: 'label'})
    }

    let sizer = lowerUIBox(scene);

    sizer.add(createLeft(sizer, repeats), {key: 'left'})
    .add(createMiddle(sizer), {expand: true, key: 'middle'})
    .add(createRight(sizer), {expand:true, key: 'right'});

    

    
    // sizer.add(iconSizer, {align: 'center'});
 
    return sizer.layout();
}