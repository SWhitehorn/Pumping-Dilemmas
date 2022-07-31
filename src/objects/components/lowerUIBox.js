import colours from "/src/utils/colours.js";

export default (scene, repeats) => {

    // Section containing number of repeats
    const createLeft = (sizer, repeats) => {

        const scene = sizer.scene;

        return scene.rexUI.add.sizer(
            {
                orientation: 0,
                x: 0,
                y: 0,
                width: 60,
                height: 100,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tl: 30, bl: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12))
            .add(scene.rexUI.add.label(
            {
                background: scene.rexUI.add.roundRectangle(0, 0, 1, 1, 5),
                space: {left: 3, right: 3},
                text: scene.rexUI.add.BBCodeText(0, 0, repeats, { fontSize: '30px' }),
            }
            ), {proportion: 0, expand: false, padding: {left: 30}})
    }
    
    // Section containing word
    const createMiddle = (sizer) => {
        const scene = sizer.scene;
        return scene.rexUI.add.sizer(
            {
                orientation: 1,
                width: 270
            })
            .addBackground(scene.add.rectangle(0, 0, 1, 1, colours.WHITE))
            .add(scene.rexUI.add.sizer({height: 70}).addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 0}, colours.WHITE).setStrokeStyle(3, 0x010A12)), {expand: true})
            .add(scene.rexUI.add.sizer({height: 30}).addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {br: 0}, colours.WHITE).setStrokeStyle(3, 0x010A12)), {expand: true})
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
                height: 100,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 30, br: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12));
    }

    let sizer = scene.rexUI.add.sizer({
        orientation: 0,
        x: 400,
        y: 425,
        width: 350,
        height: 100,
    })
    .addBackground(scene.add.rexRoundRectangle(400, 425, 350, 75, 30, colours.WHITE).setStrokeStyle(3, colours.BLACK));
    
    sizer.add(createLeft(sizer, repeats))
    .add(createMiddle(sizer), {expand: true})
    .add(createRight(sizer), {expand:true});

    

    
    // sizer.add(iconSizer, {align: 'center'});
 
    return sizer.layout();
}