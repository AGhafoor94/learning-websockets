package main

import (
	"fmt"
	"net/http"
	"sync"
)

type web_socket_manager_struct struct {
	user_clients user_client_list
	sync.RWMutex
}

func new_web_socket_manager() *web_socket_manager_struct {
	return &web_socket_manager_struct{
		user_clients: make(user_client_list),
	}
}
func (manager *web_socket_manager_struct) serve_websocket(response_writer http.ResponseWriter, request *http.Request) {
	connection, err := websocket_upgrader.Upgrade(response_writer, request, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	// connection.Close()
	client := new_user_client(connection, manager)

	manager.add_client(client)

	// Start clients with read and write messages
	// Gorilla only allows 1 user to write so need to change that
}

func (manager *web_socket_manager_struct) add_client(user_client *user_client_websocket_struct) {
	manager.Lock()
	defer manager.Unlock()
	manager.user_clients[user_client] = true
}
func (manager *web_socket_manager_struct) remove_client(user_client *user_client_websocket_struct) {
	manager.Lock()

	defer manager.Unlock()

	if _, ok := manager.user_clients[user_client]; ok {
		user_client.connection.Close()
		delete(manager.user_clients, user_client)
	}
}
