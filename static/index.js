let show_side_bar = true;
      let websocket_connection;
      const sftp_connections = [
        {
          display_name: "Test",
          ip: "10.200.:22",
          user_access: true,
        },
        {
          display_name: "Test 234",
          ip: "10.300.:22",
          user_access: true,
        },
      ];
      window.addEventListener("load", (event) => {
        // username_input = document.getElementById("username");
        // password_input = document.getElementById("password");
        const client_style = localStorage.getItem("client_style");
        if (client_style === null) {
          localStorage.setItem("client_style", "default");
        }
        document.getElementById("menu-opened").style.display = "block";
        document.getElementById("menu-closed").style.display = "none";
        document.getElementById("side-menu").style.width = "250px";

        show_side_bar = !show_side_bar;
        if (client_style === "default") {
          set_dark_style = false;
        } else {
          set_dark_style = true;
        }
        change_css_styles();
        validate_for_submitting();
        add_sftp_connections_to_side_bar();

        if (window["WebSocket"]) {
          console.log("Websockets supported");
          websocket_connection = new WebSocket(
            "ws://" + document.location.host + "/websocket"
          );
          // check if websocket is waiting etc and display
          websocket_connection.onerror = function (event) {
            console.log("EVENT ERROR: ", event);
          };
          websocket_connection.onmessage = function (event) {
            console.log("event");
            console.log(event);
            document.getElementById("websocket-message").innerHTML += `
            <p><span>${event.data}</span></p>
            `;
          };
        } else {
          console.log("Websockets not supported");
        }
      });
      document
        .getElementById("side-bar-toggle")
        .addEventListener("click", () => {
          if (show_side_bar) {
            document.getElementById("menu-opened").style.display = "block";
            document.getElementById("menu-closed").style.display = "none";
            document.getElementById("side-menu").style.width = "250px";
            document.getElementById("side-menu").style.display = "block";
            show_side_bar = !show_side_bar;
          } else {
            document.getElementById("menu-closed").style.display = "block";
            document.getElementById("menu-opened").style.display = "none";
            document.getElementById("side-menu").style.display = "none";
            show_side_bar = !show_side_bar;
          }
        });
      function change_css_styles() {
        console.log("Change styles clicked");
        if (set_dark_style) {
          document.getElementById("moon-svg").style.display = "none";
          document.getElementById("sun-svg").style.display = "block";
          let list_of_default_styles = document.querySelectorAll(".default");
          list_of_default_styles.forEach((item) => {
            // item.classList.remove("dark");
            let current_default_class = "";
            item.classList.forEach((default_class) => {
              if (default_class.includes("default-")) {
                current_default_class = default_class;
              }
            });
            item.classList.remove("default");
            item.classList.remove(current_default_class);
            item.classList.add("dark");
            item.classList.add(
              current_default_class.replace("default", "dark")
            );
          });
          localStorage.setItem("client_style", "dark");
          set_dark_style = false;
        } else {
          document.getElementById("sun-svg").style.display = "none";
          document.getElementById("moon-svg").style.display = "block";
          let list_of_default_styles = document.querySelectorAll(".dark");
          list_of_default_styles.forEach((item) => {
            // item.classList.remove("dark");
            let current_default_class = "";
            item.classList.forEach((default_class) => {
              if (default_class.includes("dark-")) {
                current_default_class = default_class;
              }
            });
            item.classList.remove("dark");
            item.classList.remove(current_default_class);
            item.classList.add("default");
            item.classList.add(
              current_default_class.replace("dark", "default")
            );
          });
          localStorage.setItem("client_style", "default");
          set_dark_style = true;
        }
      }
      let set_dark_style = true;

      let selected_ip = sftp_connections[0].ip;
      const change_ip = () => {
        let new_selected_ip = document.getElementById(`button-${1}`).value;
        if (new_selected_ip !== selected_ip) {
          console.log(new_selected_ip);
        }
        return false;
      };

      enable_connect_button = 0;
      username_entered = false;
      password_entered = false;
      document.getElementById("username").addEventListener("input", (event) => {
        if (event.target.value.length > 0) {
          username_entered = true;
        } else {
          username_entered = false;
        }
        console.log(event.target.value);

        validate_for_submitting();
      });
      document.getElementById("password").addEventListener("input", (event) => {
        if (event.target.value.length > 0) {
          password_entered = true;
        } else {
          password_entered = false;
        }
        console.log(event.target.value);
        validate_for_submitting();
      });
      function add_sftp_connections_to_side_bar() {
        sftp_side_menu = document.getElementById("side-menu");
        sftp_connections.forEach((item, index) => {
          sftp_side_menu.innerHTML += `
            <button id='button-${index}' class='button' style='width: 100%; padding: 5px;margin: 5px 0' onclick='set_ip_address(${index})'>${item.display_name}</button>
          `;
        });
      }
      function set_ip_address(target_id) {
        console.log(sftp_connections[target_id]);
        console.log(target_id);
        document.getElementById("ip-chosen").innerHTML =
          sftp_connections[target_id].ip;
        document.getElementById("ip-input").value =
          sftp_connections[target_id].ip;
        validate_for_submitting();
      }
      function validate_for_submitting() {
        submit_user_button = document.getElementById("submit-user-button");
        if (
          username_entered &&
          password_entered &&
          document.getElementById("ip-input").value !== ""
        ) {
          submit_user_button.removeAttribute("disabled");
        } else {
          let validation_error = "";
          submit_user_button.setAttribute("disabled", "true");
          if (!username_entered) {
            validation_error += " Please enter username. ";
          }
          if (!password_entered) {
            validation_error += " Please enter password. ";
          }
          if (document.getElementById("ip-input").value === "") {
            validation_error += " Please select SFTP Server. ";
          }
        }
      }
      function post_data_to_endpoint() {
        var xhr = new XMLHttpRequest();
        console.log("HERE");
        xhr.open("POST", "https://localhost:8080/details-login", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
          JSON.stringify({
            test: "Test",
          })
        );
      }

      function send_message() {
        let username = document.getElementById("username");
        if (username.value !== null) {
          websocket_connection.send(username.value);
        }
        return false;
      }

      function read_message() {
        let password = document.getElementById("password");
        if (username.value !== null) {
          websocket_connection.get();
        }
        return false;
      }