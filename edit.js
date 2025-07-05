import { auth, db } from './firebase.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  doc,
  getDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const form = document.getElementById("editForm");
const urlParams = new URLSearchParams(window.location.search);
const rideId = urlParams.get("id");

if (!rideId) {
  alert("Invalid ride ID.");
  window.location.href = "myrides.html";
}

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  const rideRef = doc(db, "rides", rideId);
  const rideSnap = await getDoc(rideRef);

  if (!rideSnap.exists()) {
    alert("Ride not found.");
    window.location.href = "myrides.html";
    return;
  }

  const ride = rideSnap.data();

  if (ride.userId !== currentUser.uid) {
    alert("Unauthorized access.");
    window.location.href = "myrides.html";
    return;
  }

  // Pre-fill form
  document.getElementById("driverName").value = ride.driverName || "";
  document.getElementById("driverContact").value = ride.driverContact || "";
  document.getElementById("department").value = ride.department || "";
  document.getElementById("batch").value = ride.batch || "";
  document.getElementById("gender").value = ride.gender || "";
  document.getElementById("from").value = ride.from || "";
  document.getElementById("to").value = ride.to || "";
  document.getElementById("date").value = ride.date || "";
  document.getElementById("time").value = ride.time || "";
  document.getElementById("seats").value = ride.seats || "";
  document.getElementById("price").value = ride.price || "";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedRide = {
    driverName: document.getElementById("driverName").value.trim(),
    driverContact: document.getElementById("driverContact").value.trim(),
    department: document.getElementById("department").value.trim(),
    batch: document.getElementById("batch").value.trim(),
    gender: document.getElementById("gender").value,
    from: document.getElementById("from").value.trim(),
    to: document.getElementById("to").value.trim(),
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    seats: parseInt(document.getElementById("seats").value),
    price: document.getElementById("price").value.trim()
  };

  try {
    await updateDoc(doc(db, "rides", rideId), updatedRide);
    alert("Ride updated successfully!");
    window.location.href = "myrides.html";
  } catch (err) {
    alert("Update failed: " + err.message);
  }
});
