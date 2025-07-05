import { auth } from './firebase.js';
import {
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");

  // Optional: Only show logout if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (!user && logoutLink) {
      logoutLink.style.display = "none";
    }
  });

  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "index.html"; // Redirect to homepage after logout
      } catch (error) {
        alert("Logout failed: " + error.message);
      }
    });
  }
});
