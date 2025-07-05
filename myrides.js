import { auth, db } from './firebase.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const postedRidesContainer = document.getElementById("posted-rides");
const joinedRidesContainer = document.getElementById("joined-rides");

function parseTimestamp(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}`).getTime();
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const snapshot = await getDocs(collection(db, "rides"));
  let postedRides = [];
  let joinedRides = [];

  snapshot.forEach((docSnap) => {
    const ride = docSnap.data();
    const id = docSnap.id;
    const passengers = ride.passengers || [];

    if (ride.userId === user.uid) {
      postedRides.push({ id, ...ride });
    }

    passengers.forEach((p) => {
      if (p.userId === user.uid) {
        joinedRides.push({ id, ...ride });
      }
    });
  });

  // Sort both lists by date & time
  const sortByTime = (a, b) =>
    parseTimestamp(a.date, a.time) - parseTimestamp(b.date, b.time);

  postedRides = postedRides.sort(sortByTime);
  joinedRides = joinedRides.sort(sortByTime);

  // Posted Rides
  if (postedRides.length === 0) {
    postedRidesContainer.innerHTML = "<p>No rides posted yet.</p>";
  } else {
    postedRides.forEach((ride) => {
      const card = document.createElement("div");
      card.className = "ride-card minimal";
      card.innerHTML = `
        <div class="ride-card-inner">
          <div class="ride-info">
            <div class="date-time"><strong>${ride.date}</strong> | <strong>${ride.time}</strong></div>
            <h3>${ride.driverName} (You)</h3>
            <div class="rider-meta">${ride.department} - ${ride.batch}</div>
            <p><strong>From:</strong> ${ride.from}</p>
            <p><strong>To:</strong> ${ride.to}</p>
            <p><strong>Price:</strong> ${ride.price}</p>

            <h4 style="margin-top: 10px;">Passengers:</h4>
            ${
              ride.passengers && ride.passengers.length > 0
                ? ride.passengers.map(p => `
                    <div style="padding: 5px 0; border-bottom: 1px solid #ddd;">
                      <strong>Name:</strong> ${p.name}<br>
                      <strong>Contact:</strong> ${p.contact}
                    </div>
                  `).join("")
                : "<p>No passengers joined yet.</p>"
            }

            <div class="btn-group">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </div>
          <div class="ride-side">
            <img src="assets/car2.jpg" class="car-photo" />
            <div class="fare">${ride.price.toLowerCase() === "free" ? "Free" : `PKR ${ride.price}`} ⏱</div>
          </div>
        </div>
      `;

      const editBtn = card.querySelector(".edit-btn");
      const deleteBtn = card.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => {
        window.location.href = `edit.html?id=${ride.id}`;
      });

      deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this ride?");
        if (!confirmDelete) return;

        try {
          await deleteDoc(doc(db, "rides", ride.id));
          alert("Ride deleted.");
          window.location.reload();
        } catch (error) {
          alert("Error deleting ride: " + error.message);
        }
      });

      postedRidesContainer.appendChild(card);
    });
  }

  // Joined Rides
  if (joinedRides.length === 0) {
    joinedRidesContainer.innerHTML = "<p>You haven't joined any rides yet.</p>";
  } else {
    joinedRides.forEach((ride) => {
      const card = document.createElement("div");
      card.className = "ride-card minimal";
      card.innerHTML = `
        <div class="ride-card-inner">
          <div class="ride-info">
            <div class="date-time"><strong>${ride.date}</strong> | <strong>${ride.time}</strong></div>
            <h3>Ride Joined</h3>
            <div class="rider-meta">${ride.department} - ${ride.batch}</div>
            <p><strong>From:</strong> ${ride.from}</p>
            <p><strong>To:</strong> ${ride.to}</p>
            <p><strong>Price:</strong> ${ride.price}</p>

            <h4 style="margin-top: 10px;">Rider Info</h4>
            <p><strong>Name:</strong> ${ride.driverName || "N/A"}</p>
            <p><strong>Contact:</strong> ${ride.driverContact || "Not provided"}</p>

            <div class="btn-group">
              <button class="leave-btn">Leave Ride</button>
            </div>
          </div>
          <div class="ride-side">
            <img src="assets/car3.jpg" class="car-photo" />
            <div class="fare">${ride.price.toLowerCase() === "free" ? "Free" : `PKR ${ride.price}`} ⏱</div>
          </div>
        </div>
      `;

      const leaveBtn = card.querySelector(".leave-btn");

      leaveBtn.addEventListener("click", async () => {
        const confirmLeave = confirm("Are you sure you want to leave this ride?");
        if (!confirmLeave) return;

        try {
          const rideRef = doc(db, "rides", ride.id);
          const rideDoc = await getDocs(collection(db, "rides"));
          const docData = rideDoc.docs.find(d => d.id === ride.id)?.data();

          if (!docData) {
            alert("Ride no longer exists.");
            return;
          }

          const updatedPassengers = (docData.passengers || []).filter(
            p => p.userId !== user.uid
          );

          await updateDoc(rideRef, {
            passengers: updatedPassengers
          });

          alert("You have left the ride.");
          window.location.reload();
        } catch (error) {
          alert("Error leaving ride: " + error.message);
        }
      });

      joinedRidesContainer.appendChild(card);
    });
  }
});
