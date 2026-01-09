package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"

	"github.com/gorilla/websocket"
)

var (
	websocket_upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

const port string = ":8080"

func main() {
	fmt.Println("STARTED")
	http.HandleFunc("/details-login", submit_login_details)
	start_server()
}
func start_server() {
	websocket_manager := new_web_socket_manager()
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.Handle("/", http.FileServer(http.Dir("./templates")))
	http.HandleFunc("/websocket", websocket_manager.serve_websocket)
	cmd := exec.Command("powershell", "-Command", fmt.Sprintf(`[System.Diagnostics.Process]::Start("msedge", "http://localhost%s")`, port))
	// http.HandleFunc("/details-login", submit_login_details)
	_, err := cmd.Output()

	if err != nil {
		panic(err)
	}
	log.Fatal(http.ListenAndServe(port, nil))
}
func submit_login_details(response_writer http.ResponseWriter, request *http.Request) {

	err := request.ParseForm()
	if err != nil {
		fmt.Println(err)
	}

	name := request.PostFormValue("username")
	fmt.Fprintf(response_writer, "Hello, %s!", name)
}
