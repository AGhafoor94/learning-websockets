package main

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type user_client_websocket_struct struct {
	connection         *websocket.Conn
	web_socket_manager *web_socket_manager_struct

	ingress_channel chan []byte
}
type user_client_list map[*user_client_websocket_struct]bool

func new_user_client(connection *websocket.Conn, web_socket_manager *web_socket_manager_struct) *user_client_websocket_struct {
	return &user_client_websocket_struct{
		connection:         connection,
		web_socket_manager: web_socket_manager,
		ingress_channel:    make(chan []byte),
	}
}
func (client *user_client_websocket_struct) read_data() {
	defer func() {
		// Clean up client
		client.web_socket_manager.remove_client(client)
	}()
	for {
		message_type, data, err := client.connection.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {

				fmt.Println(fmt.Sprintf("ERROR: %v", err))
			}
			break
		}
		fmt.Println(fmt.Sprintf("Message Type: %d, Data: %s", message_type, string(data)))
		for websocket_client := range client.web_socket_manager.user_clients {
			websocket_client.ingress_channel <- data
		}

	}
}
func (client *user_client_websocket_struct) write_data() {
	defer func() {
		// Clean up client
		client.web_socket_manager.remove_client(client)
	}()
	for {
		select {
		case message, ok := <-client.ingress_channel:
			if !ok {
				if err := client.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
					fmt.Println("Connection closed: ", err)
				}
				return
			}
			if err := client.connection.WriteMessage(websocket.TextMessage, message); err != nil {
				fmt.Println("Failed to send message: ", err)
				return
			}
			fmt.Println("Message sent")
		}
	}
}
