import colours from "../../utils/colours.js";

export default (scene) => {
    return scene.rexUI.add.sizer({
        orientation: 0,
        x: 400,
        y: 460,
        width: 400,
        height: 80,
    }).addBackground(
        scene.add.rexRoundRectangle(0, 0, 1, 1, {tr: 30, tl: 30}, colours.DARKBLUE).setStrokeStyle(3, colours.BLACK)
    );
}