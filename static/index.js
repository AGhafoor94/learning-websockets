let show_side_bar = true;
let websocket_connection;
let enable_connect_button = 0;
let username_entered = false;
let password_entered = false;
let ip_address_selected = false;
let validation_error = "";

const loading = document.getElementById("loading-spinner");
const loading_div = document.getElementById("loading-spinner-div");
const main_header = document.getElementById("main-header");
const main_main = document.getElementById("main-main");
const main_footer = document.getElementById("main-footer");
const login_main = document.getElementById("login-main");
const error_html = document.getElementById("error-div");
const submit_user_button = document.getElementById("submit-user-button");

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
window.addEventListener("load", () => {
  // username_input = document.getElementById("username");
  // password_input = document.getElementById("password");
  document.getElementById("validation-error").style.display = "none";
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
  add_sftp_connections_to_drop_down();
  add_data_to_side_bar();

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
document.getElementById("side-bar-toggle").addEventListener("click", () => {
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
  //   console.log("Change styles clicked");
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
      item.classList.add(current_default_class.replace("default", "dark"));
    });
    document.getElementById("sftp-select").classList.remove("display");
    document.getElementById("sftp-select").classList.add("dark");
    document.getElementById("sftp-select").classList.add("dark-form-control");
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
      item.classList.add(current_default_class.replace("dark", "default"));
    });
    document.getElementById("sftp-select").classList.remove("dark");
    document.getElementById("sftp-select").classList.add("display");
    document
      .getElementById("sftp-select")
      .classList.add("display-form-control");
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

document.getElementById("sftp-select").addEventListener("change", (event) => {
  if (event.target.value !== "") {
    ip_address_selected = true;
  } else {
    ip_address_selected = false;
  }
  console.log(event.target.value);
  validate_for_submitting();
});
submit_user_button.addEventListener("click", async () => {
  if (
    document.getElementById("sftp-select").value !== "" &&
    username_entered &&
    password_entered
  ) {
    // post_data_to_endpoint();
    await post_data();
  } else {
    document.getElementById("validation-error").innerHTML = validation_error;
    document.getElementById("validation-error").style.display = "block";
  }
});

function add_sftp_connections_to_drop_down() {
  sftp_connections.forEach((item) => {
    let option = document.createElement("option");
    option.value = item.ip;
    option.innerHTML = item.display_name;
    document.getElementById("sftp-select").appendChild(option);
  });
}
function click_test(i) {
  console.log(i);
}
function add_data_to_side_bar() {
  sftp_side_menu = document.getElementById("side-menu");
  for (let i = 0; i < 5; i++) {
    sftp_side_menu.innerHTML += `<div class="folders" id='button-${i}' style='width: 100%; padding: 5px;margin: 5px 0;display: flex;align-items: center;' onclick="click_test(${i})">${return_folder_filled_icon(
      32,
      "fill: var(--default-colour-theme-grey) !important"
    )} <span style="margin-left: 10px">Folder ${i}</span></div>`;
  }
}
document.getElementById("sftp-select").addEventListener("change", (event) => {
  document.getElementById("title").innerHTML = event.target.value;
});
function set_ip_address(target_id) {
  console.log(sftp_connections[target_id]);
  console.log(target_id);
  document.getElementById("ip-chosen").innerHTML =
    sftp_connections[target_id].ip;
  //   document.getElementById("ip-input").value = sftp_connections[target_id].ip;

  validate_for_submitting();
}
function validate_for_submitting() {
  if (username_entered && password_entered && ip_address_selected) {
    submit_user_button.setAttribute(
      "title",
      `Click to connect to: ${document.getElementById("sftp-select").value}`
    );
    submit_user_button.removeAttribute("disabled");
  } else {
    submit_user_button.setAttribute("disabled", "true");
    if (!ip_address_selected) {
      validation_error += " Select SFTP Connection. ";
    }
    if (!username_entered) {
      validation_error += " Enter Username. ";
    }
    if (!password_entered) {
      validation_error += " Enter Password. ";
    }
    submit_user_button.setAttribute("title", validation_error);
    // if (document.getElementById("ip-input").value === "") {
    //   validation_error += " Please select SFTP Server. ";
    // }
  }
}
document.getElementById("menu-opened-location").innerHTML =
  return_menu_opened_icon(32, "");

document.getElementById("menu-closed-location").innerHTML =
  return_menu_closed_icon(32, "");

document.getElementById("moon-icon-location").innerHTML = return_moon_icon(
  32,
  "position: absolute; right: 20px; top: 35px; cursor: pointer"
);

document.getElementById("sun-icon-location").innerHTML = return_sun_icon(
  32,
  "position: absolute; right: 20px; top: 35px; display: none; cursor: pointer;"
);
