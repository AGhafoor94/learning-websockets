package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	// "os/exec"

	"github.com/gorilla/websocket"
)

type status_return_struct struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

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
	// cmd := exec.Command("powershell", "-Command", fmt.Sprintf(`[System.Diagnostics.Process]::Start("chrome", "http://localhost%s")`, port))
	// _, err := cmd.Output()

	// if err != nil {
	// 	panic(err)
	// }
	log.Fatal(http.ListenAndServe(port, nil))
}

func submit_login_details(response_writer http.ResponseWriter, request *http.Request) {
	data_byte_array, err := io.ReadAll(request.Body)
	if err != nil {
		fmt.Println("Unable to read all request body: ", err)
	}
	fmt.Println(string(data_byte_array))
	// err = request.ParseForm()
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// name := request.PostFormValue("username")
	// fmt.Fprintf(response_writer, "Hello, %s!", name)
	type mapped_test_data map[string]string
	var new_data_temp = make(map[string]string)
	new_data_temp["test"] = "TEST DATA"
	new_data_temp["test_2"] = "TEST DATA_2"

	json_string_to_send, err := json.Marshal(new_data_temp)

	status_return := status_return_struct{
		Message: string(json_string_to_send),
		Status:  http.StatusOK,
	}
	response_writer.Header().Add("Content-Type", "application/json")
	// http.StatusOK
	response_writer.WriteHeader(http.StatusOK)
	json.NewEncoder(response_writer).Encode(status_return)
}
