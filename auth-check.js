import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const authLink = document.getElementById("authLink");
const logoutLink = document.getElementById("logoutLink");
const postRideLink = document.getElementById("postRideLink");
const myRidesLink = document.getElementById("myRidesLink");
const ctaPostRide = document.getElementById("ctaPostRide"); // button on homepage

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Show Logout
    if (authLink) {
      authLink.textContent = "Logout";
      authLink.href = "#";
      authLink.addEventListener("click", async () => {
        await signOut(auth);
        window.location.reload();
      });
    }

    if (logoutLink) {
      logoutLink.style.display = "block";
      logoutLink.addEventListener("click", async () => {
        await signOut(auth);
        window.location.reload();
      });
    }
  } else {
    // Show Login
    if (authLink) {
      authLink.textContent = "Login";
      authLink.href = "login.html";
    }
    if (logoutLink) {
      logoutLink.style.display = "none";
    }

    // Protect buttons/links that require login
    if (postRideLink) {
      postRideLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }

    if (myRidesLink) {
      myRidesLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }

    if (ctaPostRide) {
      ctaPostRide.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }
  }
});
