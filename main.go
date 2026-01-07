package main

import "net/http"

/*
Try WebRTC

 WEBSOCKETS:

		HTTP Header: Connection: Upgrade ->
		<- HTTP 101 Switching Protocols
	<- WebSocket Bidirectional Communication ->
					Close ->
*/

func main() {
	setup_http_server()
}

func setup_http_server() {
	http.Handle("/", http.FileServer(http.Dir("./templates")))
}
