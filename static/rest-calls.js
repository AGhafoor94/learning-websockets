function post_data_to_endpoint() {
  let time_out_num;
  loading_div.style.display = "flex";
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/details-login", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  // xhr.send(
  //   JSON.stringify({
  //     test: "Test",
  //   })
  // );
  xhr.onloadend = () => {
    if (xhr.status === 200) {
      error_html.style.height = "0";
      error_html.style.padding = "0";
      error_html.innerHTML = "";
      const json_response = JSON.parse(xhr.responseText);
      console.log(JSON.parse(json_response.message));
      window.history.pushState(
        { html: "", pageTitle: "" },
        "",
        "http://localhost:8080"
      );
      time_out_num = setTimeout(() => {
        login_main.style.display = "none";
        main_header.style.display = "block";
        main_main.style.display = "block";
        main_footer.style.display = "block";
        loading_div.style.display = "none";
      }, 2000);
    }
    if (xhr.status > 300) {
      error_html.innerHTML = `<h2 style='font-size:1.5rem !important'>Error connecting to <span style='text-decoration:underline;font-size:1.5rem !important'>${
        document.getElementById("sftp-select").value
      }</span> with credentials</h2>`;
      error_html.style.height = "75px";
      //   error_html.style.padding = "20px";
      console.error("Request failed with status:", xhr.status);
      time_out_num = setTimeout(() => {
        error_html.innerHTML = "";
        error_html.style.height = "0";
        error_html.style.padding = "0";
        loading_div.style.display = "none";
      }, 4000);
    }
  };
  clearTimeout(time_out_num);
  xhr.send(
    JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      //   ip: document.getElementById("ip-chosen").innerHTML,
      ip: document.getElementById("sftp-select").value,
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
