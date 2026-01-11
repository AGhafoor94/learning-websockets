function post_data_to_endpoint() {
  let time_out_num;
  loading_screen(true, 0);
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
      time_out_num = loading_screen(false, 4000);
    }
    if (xhr.status > 300) {
      error_html.innerHTML = `<h2 style='font-size:1.5rem !important'>Error connecting to <span style='text-decoration:underline;font-size:1.5rem !important'>${
        document.getElementById("sftp-select").value
      }</span> with credentials</h2>`;
      error_html.style.height = "75px";
      //   error_html.style.padding = "20px";
      console.error("Request failed with status:", xhr.status);
      time_out_num = loading_screen(false, 4000);
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
const get_data = async () => {
  const url = "http://localhost:8080";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};
const post_data = async () => {
  loading_screen(true, 0);
  const url = "http://localhost:8080/api/v1.0/details-login";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      ip: document.getElementById("sftp-select").value,
    }),
  });
  if (!response.ok) {
    error_html.innerHTML = `<h2 style='font-size:1.5rem !important'>Error connecting to <span style='text-decoration:underline;font-size:1.5rem !important'>${
      document.getElementById("sftp-select").value
    }</span> with credentials (Status Code: ${response.status})</h2>`;
    error_html.style.height = "75px";
    //   error_html.style.padding = "20px";
    console.error("Request failed with status:", response.status);

    time_out_num = loading_screen(false, 4000);
    return;
    // throw new Error(`Response status: ${response.status}`);
  }

  const result = await response.json();
  error_html.style.height = "0";
  error_html.style.padding = "0";
  error_html.innerHTML = "";
  console.log(result);
  const json_response = JSON.parse(result.message);
  console.log(json_response);
  window.history.pushState(
    { html: "", pageTitle: "" },
    "",
    "http://localhost:8080"
  );
  time_out_num = loading_screen(false, 4000);
  console.log(result);
};
const get_folder_data_tree = async (folder_name) => {
  loading_screen(true, 0);
  const url = `http://localhost:8080/api/v1.0/get-folder-data?folder=${folder_name}`;
  const response = await fetch(url);

  if (!response.ok) {
    loading_screen(false, 2100);
    throw new Error(`Response status: ${response.status}`);
  }

  const result = await response.json();
  console.log(result);
  loading_screen(false, 2100);
};
