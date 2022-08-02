import colours from "/src/utils/colours.js"

export default (messages, scene) => {
    const toast = scene.rexUI.add.toast({
        x:400, 
        y:250, 
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, colours.WHITE),
        text: scene.add.text(0,0, "", {fontSize: "24px", color: colours.DARKBLUE}),
        space: {left: 20, right: 20, top: 20, bottom: 20}
    })

    for (let message of messages){
        toast.showMessage(message)
    }

    return toast;
}

