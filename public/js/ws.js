	var ws;
	var wsServer;
    const port = location.PORT || 4000;
    
    if(window.location.hostname == "localhost" || window.location.hostname.startsWith("192.168") || window.location.hostname.includes(".local")) {
    	console.log("Websocket to localhost : "+window.location.hostname);
    	// LOCAL
    	wsServer = "ws://" + window.location.hostname + ":" + port;// + "/ws";
    } else {
    	console.log("Websocket to heroku : "+window.location.hostname);
    	// HEROKU
    	wsServer = "wss://" + window.location.hostname + "/wss";
    }
    
    /* -- Web Sockets -- */
    document.addEventListener("visibilitychange", function() {
        //console.log("Visibility changed to: " + document.visibilityState);
        if(document.visibilityState == "visible" ) {
            checkWSStateAndReconnectIfNecessary(ws.readyState);

            // Check again in one second
            setTimeout(function(){
                checkWSStateAndReconnectIfNecessary(ws.readyState);
            }, 3000);
        }
    });

    document.addEventListener("onfocus", function() {
        //console.log("Gained focus");
        checkWSStateAndReconnectIfNecessary(ws.readyState);

        // Check again in one second
        setTimeout(function(){
            checkWSStateAndReconnectIfNecessary(ws.readyState);
        }, 3000);
    });

    function checkWSStateAndReconnectIfNecessary(wsReadyState) {
        switch(wsReadyState) {
            case ws.CONNECTING:
                console.log("- WebSocket Connecting...");
                break;
            case ws.OPEN:
                console.log("- WebSocket Open :)");
                break;
            case ws.CLOSING:
                console.log("- WebSocket Closing...");
                break;
            case ws.CLOSED:
                console.log("* WebSocket Closed :(");
                connectToWS();
                break;
        }
    }
