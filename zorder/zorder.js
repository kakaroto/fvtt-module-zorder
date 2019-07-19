class ZOrder {
    static onRenderTileHUD(hud, html, data) {
	let element = html.find(".locked")
	if (element.length > 0) {
	    element.after(`<div class="control-icon zorder-back">
  			  <img src="icons/svg/direction.svg" width="36" height="36" title="Send to Back"/>
			  </div>`)
	    element.after(`<div class="control-icon zorder-front">
			  <img src="icons/svg/direction.svg" style="transform: rotate(180deg);" width="36" height="36" title="Send to Front"/>
			  </div>`)
	    html.find(".zorder-back").click(() => ZOrder.sendToBack(hud))
	    html.find(".zorder-front").click(() => ZOrder.sendToFront(hud))
	}
    }
    static sendToBack(hud) {
	ZOrder.sendTo(hud, 0)
    }
    static sendToFront(hud) {
	ZOrder.sendTo(hud, canvas.scene.data.tiles.length)
    }
    static sendTo(hud, pos) {
	let tile = hud.object.data
	let tiles = canvas.scene.data.tiles
	let idx = tiles.indexOf(tile)
	if (idx >= 0 && idx != pos) {
	    tiles = tiles.slice()
	    tiles.splice(idx, 1)
	    tiles.splice(pos, 0, tile)
	    canvas.scene.update({"tiles": tiles})
	}
    }
    static patchFunction(func, line_number, line, new_line) {
        let funcStr = func.toString()
        let lines = funcStr.split("\n")
        if (lines[line_number].trim() == line.trim()) {
            let fixed = funcStr.replace(line, new_line)
	    func = Function('"use strict";return (function ' + fixed + ')')();
	    console.log("Changed function : \n", funcStr, "\nInto : \n", func.toString())
        } else {
            console.log("Function has wrong content at line ", line_number, " : ", lines[line_number].trim(), " != ", line.trim(), "\n", funcStr)
	}
	return func
    }
}

Hooks.on('renderTileHUD', ZOrder.onRenderTileHUD)
PlaceableObject.prototype.control = ZOrder.patchFunction(PlaceableObject.prototype.control, 12,
							 "this.toFront();",
							 "if (!(this.layer instanceof TilesLayer)) {this.toFront();}")
