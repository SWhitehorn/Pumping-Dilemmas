import colours from "../../utils/colours.js";

export default (scene) => {
    
    const top = () => {
        return scene.rexUI.add.sizer({
            orientation: 'x',
            x: 0,
            y: 0,
            width: 600,
            height: 60,
        })
    }

    const bottom = () => {
        return scene.rexUI.add.sizer({
            orientation: 'x',
            x: 0,
            y: 0,
            width: 600,
            height: 40,
        })
        .addBackground(
                scene.add.rexRoundRectangle(0, 0, 1, 1, {br: 20, bl: 20}, colours.DARKBLUE).setStrokeStyle(3, colours.BLACK)
        )
        .add(scene.rexUI.add.sizer(
            {
                orientation: 'x',
                x: 0,
                y: 0,
                width: 300,
                height: 40,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {bl: 20}).setStrokeStyle(3, colours.BLACK))
            .add(scene.rexUI.add.label({
                text: scene.add.text(650, 400, "Decrease", {fontSize: '30px', color: '#ffffff', fontFamily: 'Quantico'})
                .setInteractive()
                .on('pointerup', () => {
                    // Cap at 3
                    if (scene.numRepeats > 0) {
                        scene.numRepeats -= 1;
                        scene.UIElements.repeats.text = scene.numRepeats;
                    };
                })
            }), {padding: {left: 100}, key: 'label'}),
        {key: 'right'})
        .add(scene.rexUI.add.sizer(
            {
                orientation: 'x',
                x: 0,
                y: 0,
                width: 300,
                height: 40,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {br: 20}).setStrokeStyle(3, colours.BLACK))
            .add(scene.rexUI.add.label({
                text: scene.add.text(650, 400, "Increase", {fontSize: '30px', color: '#ffffff', fontFamily: 'Quantico'})
                .setInteractive().on('pointerup', () => {
                    // Cap at 3
                    if (scene.numRepeats < 3) {
                        scene.numRepeats += 1;
                        scene.UIElements.repeats.text = scene.numRepeats;
                    };
                })
            }), {padding: {left: 100}, key: 'label'}),
        {key: 'left'});

    }

    const baseSizer = scene.rexUI.add.sizer({
        orientation: 'y',
        x: 400,
        y: 250,
        width: 600,
        height: 100,
    }).addBackground(
        scene.add.rexRoundRectangle(0, 0, 1, 1, 20, colours.WHITE).setStrokeStyle(3, colours.BLACK)
    );

    return baseSizer.add(top(), {key: 'top'}).add(bottom(), {key: 'bottom'});
}