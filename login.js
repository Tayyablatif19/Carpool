import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const messageBox = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const button = loginForm.querySelector("button");

    if (!email || !password) {
      showMessage("Please enter both email and password.", "error");
      return;
    }

    button.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    } catch (error) {
      let message = "Login failed.";
      switch (error.code) {
        case "auth/user-not-found":
          message = "No user found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        default:
          message = "Login failed: " + error.message;
      }
      showMessage(message, "error");
      button.disabled = false;
    }
  });

  function showMessage(text, type = "info") {
    messageBox.textContent = text;
    messageBox.className = `auth-message ${type}`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 4000);
  }
});
