// 
// messages
//
chrome.runtime.onMessage.addListener(gotMessage);
 
function gotMessage(request, sender, sendResponse) {
	console.log('got message');
	if (request.type == "start-screenshots")
		startScreenshot();
	
	sendResponse({});
}
 
function startScreenshot() { console.log('start screenshot');
	//change cursor
	document.body.style.cursor = 'crosshair';

	document.addEventListener('mousedown', mouseDown, false);
	document.addEventListener('keydown', keyDown, false);
}
 
function endScreenshot(coords) {
	document.removeEventListener('mousedown', mouseDown, false);
	
	sendMessage({type: 'coords', coords: coords});
}
 
function sendMessage(msg) {
	//change cursor back to default
	document.body.style.cursor = 'default';

	console.log('sending message with screenshoot');
	chrome.runtime.sendMessage(msg, function(response) {});
};
 
// 
// end messages
//
 
var ghostElement, startPos, gCoords, startY;
 
function keyDown(e) {
	var keyCode = e.keyCode;
	
	// Hit: n
	if ( keyCode == '78' && gCoords ) {
		e.preventDefault();
		e.stopPropagation();
		
		endScreenshot(gCoords);
		
		return false;
	}
}
 
function mouseDown(e) {
	e.preventDefault();
 
	startPos = {x: e.pageX, y: e.pageY};
    startY = e.y;
	
	ghostElement = document.createElement('div');
	ghostElement.style.background = 'blue';
	ghostElement.style.opacity = '0.1';
	ghostElement.style.position = 'absolute';
	ghostElement.style.left = e.pageX + 'px';
	ghostElement.style.top = e.pageY + 'px';
	ghostElement.style.width = "0px";
	ghostElement.style.height = "0px";
	ghostElement.style.zIndex = "1000000";
	document.body.appendChild(ghostElement);
	
	document.addEventListener('mousemove', mouseMove, false);
	document.addEventListener('mouseup', mouseUp, false);
	
	return false;
}
 
function mouseMove(e) {
	e.preventDefault();
 
	var nowPos = {x: e.pageX, y: e.pageY};
	var diff = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};
	
	ghostElement.style.width = diff.x + 'px';
	ghostElement.style.height = diff.y + 'px';
	
	return false;
}
 
function mouseUp(e) {
	e.preventDefault();
	
	var nowPos = {x: e.pageX, y: e.pageY};
	var diff = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};
 
	document.removeEventListener('mousemove', mouseMove, false);
	document.removeEventListener('mouseup', mouseUp, false);
	
	ghostElement.parentNode.removeChild(ghostElement);
	
	setTimeout(function() {
		var coords = {
			w: diff.x,
			h: diff.y,
			x: startPos.x,
			y: startY
		};
		gCoords = coords;
		endScreenshot(coords);
	}, 50);
	
	return false;
}