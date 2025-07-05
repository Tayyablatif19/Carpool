import { auth, db } from './firebase.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection,
  addDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const rideForm = document.getElementById('rideForm');
  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
    } else {
      window.location.href = "login.html";
    }
  });

  rideForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to post a ride.");
      return;
    }

    const driverName = document.getElementById('driverName').value.trim();
    const driverContact = document.getElementById('driverContact').value.trim();
    const department = document.getElementById('department').value.trim();
    const batch = document.getElementById('batch').value.trim();
    const gender = document.getElementById('gender').value;
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const seats = parseInt(document.getElementById('seats').value);
    const price = document.getElementById('price').value.trim();

    const rideDateTime = new Date(`${date}T${time}`);
    const expiryTimestamp = rideDateTime.getTime();

    try {
      await addDoc(collection(db, "rides"), {
        driverName,
        driverContact,
        department,
        batch,
        gender,
        from,
        to,
        date,
        time,
        seats,
        price,
        passengers: [],
        userId: currentUser.uid,
        expiryTimestamp // 🕓 added for auto expiry
      });

      alert("Ride posted successfully!");
      rideForm.reset();
      window.location.href = "rides.html";
    } catch (error) {
      alert("Failed to post ride: " + error.message);
    }
  });
});
