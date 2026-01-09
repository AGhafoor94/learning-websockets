package main

import "github.com/gorilla/websocket"

type user_client_websocket_struct struct {
	connection         *websocket.Conn
	web_socket_manager *web_socket_manager_struct
}
type user_client_list map[*user_client_websocket_struct]bool

func new_user_client(connection *websocket.Conn, web_socket_manager *web_socket_manager_struct) *user_client_websocket_struct {
	return &user_client_websocket_struct{
		connection:         connection,
		web_socket_manager: web_socket_manager,
	}
}
