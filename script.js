// // postAndLogout.js — optional combined fallback
// import { auth, db } from './firebase.js';
// import {
//   onAuthStateChanged,
//   signOut
// } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
// import {
//   addDoc,
//   collection
// } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// onAuthStateChanged(auth, (user) => {
//   if (!user) window.location.href = 'login.html';
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const logoutLink = document.getElementById("logoutLink");
//   const rideForm = document.getElementById("rideForm");

//   if (logoutLink) {
//     logoutLink.addEventListener("click", async () => {
//       try {
//         await signOut(auth);
//         alert("Logged out successfully!");
//         window.location.href = "login.html";
//       } catch (error) {
//         alert("Logout error: " + error.message);
//       }
//     });
//   }

//   if (rideForm) {
//     rideForm.addEventListener("submit", async function (e) {
//       e.preventDefault();

//       const driverName = document.getElementById("driverName").value.trim();
//       const from = document.getElementById("from").value.trim();
//       const to = document.getElementById("to").value.trim();
//       const date = document.getElementById("date").value;
//       const time = document.getElementById("time").value;
//       const seats = parseInt(document.getElementById("seats").value);
//       const price = document.getElementById("price").value.trim();

//       const user = auth.currentUser;
//       if (!user) {
//         alert("You must be logged in to post a ride.");
//         return;
//       }

//       const ride = {
//         driverName,
//         from,
//         to,
//         date,
//         time,
//         seats,
//         price,
//         passengers: [],
//         userId: user.uid
//       };

//       try {
//         await addDoc(collection(db, "rides"), ride);
//         alert("Ride posted successfully!");
//         window.location.href = "rides.html";
//       } catch (error) {
//         alert("Failed to post ride: " + error.message);
//       }
//     });
//   }
// });
