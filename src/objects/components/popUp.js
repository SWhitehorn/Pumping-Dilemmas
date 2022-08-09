import colours from "/src/utils/colours.js"

export default (messages, scene, long=false) => {
    
    let duration;
    long ? duration = 3000 : duration = 1500;

    const toast = scene.rexUI.add.toast({
        x:400, 
        y:250, 
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, colours.WHITE).setStrokeStyle(3, 0x010A12),
        text: scene.add.text(0,0, "", {
            fontSize: "24px", 
            color: colours.DARKBLUE, 
            fontFamily: 'Quantico',
            wordWrap: { width: 500},
            align: 'center'
        }),
        space: {left: 20, right: 20, top: 20, bottom: 20},
        duration: {
            in: 200,
            hold: duration,
            out: 200,
        }
    })

    for (let message of messages){
        toast.showMessage(message)
    }

    // Ensure popUp renders above everything else
    toast.setDepth(2);
    
    return toast;
}

