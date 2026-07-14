const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError =
  document.getElementById("usernameError");

const passwordError =
  document.getElementById("passwordError");

const message = document.getElementById("message");

const rememberMe =
  document.getElementById("rememberMe");

const togglePassword =
  document.getElementById("togglePassword");

const forgotPassword =
  document.getElementById("forgotPassword");

const loginButton =
  document.getElementById("loginButton");

const buttonText =
  document.getElementById("buttonText");

const loader =
  document.getElementById("loader");

let failedAttempts = 0;

const correctUsername = "admin";
const correctPassword = "1234";

/*
  Page open aagumbothu saved username iruntha
  automatically input-la display aagum.
*/
window.addEventListener("DOMContentLoaded", function () {
  const savedUsername =
    localStorage.getItem("savedUsername");

  if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberMe.checked = true;
  }
});

/*
  Password show and hide.
*/
togglePassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Show";
  }
});

/*
  Username validation.
*/
usernameInput.addEventListener("input", function () {
  usernameError.textContent = "";

  usernameInput.classList.remove("error-input");

  message.textContent = "";
});

/*
  Password validation.
*/
passwordInput.addEventListener("input", function () {
  passwordError.textContent = "";

  passwordInput.classList.remove("error-input");

  message.textContent = "";
});

/*
  Login form submission.
*/
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  clearErrors();

  let isValid = true;

  if (username === "") {
    showUsernameError(
      "Username cannot be empty."
    );

    isValid = false;
  } else if (username.length < 3) {
    showUsernameError(
      "Username must contain at least 3 characters."
    );

    isValid = false;
  }

  if (password === "") {
    showPasswordError(
      "Password cannot be empty."
    );

    isValid = false;
  } else if (password.length < 4) {
    showPasswordError(
      "Password must contain at least 4 characters."
    );

    isValid = false;
  }

  if (!isValid) {
    return;
  }

  startLoading();

  setTimeout(function () {
    if (
      username === correctUsername &&
      password === correctPassword
    ) {
      failedAttempts = 0;

      if (rememberMe.checked) {
        localStorage.setItem(
          "savedUsername",
          username
        );
      } else {
        localStorage.removeItem(
          "savedUsername"
        );
      }

      sessionStorage.setItem(
        "loggedInUser",
        username
      );

      showMessage(
        "Login Successful! Redirecting...",
        "success"
      );

      /*
        Dashboard page create pannina apram
        keela irukkura line uncomment pannalaam.
      */

      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 1200);

    } else {
      failedAttempts++;

      const remainingAttempts =
        3 - failedAttempts;

      if (failedAttempts >= 3) {
        showMessage(
          "Too many failed attempts. Try again after 10 seconds.",
          "error"
        );

        disableLoginTemporarily();
      } else {
        showMessage(
          "Invalid Username or Password! " +
          remainingAttempts +
          " attempt(s) remaining.",
          "error"
        );
      }
    }

    stopLoading();

  }, 1000);
});

/*
  Forgot password alert.
*/
forgotPassword.addEventListener(
  "click",
  function (event) {
    event.preventDefault();

    alert(
      "Please contact the administrator to reset your password."
    );
  }
);

function showUsernameError(errorMessage) {
  usernameError.textContent = errorMessage;

  usernameInput.classList.add("error-input");
}

function showPasswordError(errorMessage) {
  passwordError.textContent = errorMessage;

  passwordInput.classList.add("error-input");
}

function clearErrors() {
  usernameError.textContent = "";
  passwordError.textContent = "";

  usernameInput.classList.remove("error-input");
  passwordInput.classList.remove("error-input");

  message.textContent = "";
  message.className = "";
}

function showMessage(text, type) {
  message.textContent = text;

  if (type === "success") {
    message.className = "success-message";
  } else {
    message.className = "error-message";
  }
}

function startLoading() {
  loginButton.disabled = true;

  buttonText.style.display = "none";
  loader.style.display = "block";
}

function stopLoading() {
  loginButton.disabled = false;

  buttonText.style.display = "inline";
  loader.style.display = "none";
}

function disableLoginTemporarily() {
  loginButton.disabled = true;
  usernameInput.disabled = true;
  passwordInput.disabled = true;

  let seconds = 10;

  const countdown = setInterval(function () {
    message.textContent =
      "Try again after " +
      seconds +
      " second(s).";

    seconds--;

    if (seconds < 0) {
      clearInterval(countdown);

      failedAttempts = 0;

      loginButton.disabled = false;
      usernameInput.disabled = false;
      passwordInput.disabled = false;

      showMessage(
        "You can try logging in again.",
        "success"
      );
    }
  }, 1000);
}