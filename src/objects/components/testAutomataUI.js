import colours from "../../utils/colours.js";
import lowerUIBox from "./lowerUIBox.js";

export default (scene) => {
    
    const createLeft = (scene) => {

        return scene.rexUI.add.sizer(
            {
                orientation: 'x',
                x: 0,
                y: 0,
                width: 60,
                height: 80,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tl: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12))
            .add(scene.rexUI.add.label(
            {
                background: scene.rexUI.add.roundRectangle(0, 0, 1, 1, 5),
                space: {left: 3, right: 3},
                icon: scene.add.circle(0, 0, 10, colours.WHITE),
            }
            ), {proportion: 0, expand: false, padding: {left: 15}, key: 'label'})
    }
    
    const createMiddle = (scene) => {
        return scene.rexUI.add.sizer(
            {
                x: 0, 
                y: 0,
                orientation: 'x',
                width: 290,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {}, colours.WHITE).setStrokeStyle(3, 0x010A12))
    }

    const createRight = (scene) => {

        return scene.rexUI.add.sizer(
            {
                orientation: 'x',
                x: 0,
                y: 0,
                width: 60,
                height: 80,
            })
            .addBackground(scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 30}, colours.DARKBLUE).setStrokeStyle(3, 0x010A12))
            .add(scene.rexUI.add.label(
            {
                background: scene.rexUI.add.roundRectangle(0, 0, 1, 1, 5),
                space: {left: 3, right: 3},
                text: scene.add.text(0, 0, ">>", { fontSize: '30px', color: colours.TEXTWHITE, fontFamily: 'Quantico'} )
            }
            ), {proportion: 0, expand: false, padding: {left: 10}, key: 'label'})
    }
    

    return lowerUIBox(scene)
        .add(createLeft(scene), {expand: true, key: 'left'})
        .add(createMiddle(scene), {expand: true, key: 'middle'})
        .add(createRight(scene), {expand: true, key:'right'})
}
