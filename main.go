package main

import (
	"fmt"
	"log"
	"net/http"
	// "os/exec"
)

const port string = ":8080"

func main() {
	fmt.Println("STARTED")
	http.HandleFunc("/details-login", submit_login_details)
	start_server()
}
func start_server() {
	http.Handle("/", http.FileServer(http.Dir("./templates")))
	// cmd := exec.Command("powershell", "-Command", fmt.Sprintf(`[System.Diagnostics.Process]::Start("msedge", "http://localhost%s")`, port))
	// // http.HandleFunc("/details-login", submit_login_details)
	// _, err := cmd.Output()

	// if err != nil {
	// 	panic(err)
	// }
	log.Fatal(http.ListenAndServe(port, nil))
}
func submit_login_details(response_writer http.ResponseWriter, request *http.Request) {

	err := request.ParseForm()
	if err != nil {
		// Handle error here via logging and then return
		fmt.Println(err)
	}

	name := request.PostFormValue("username")
	fmt.Fprintf(response_writer, "Hello, %s!", name)
}
