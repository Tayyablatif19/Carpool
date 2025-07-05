import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const rideList = document.getElementById("ride-list");
const joinPopup = document.getElementById("joinPopup");
const joinForm = document.getElementById("joinForm");
const closeBtn = document.getElementById("closePopup");

let selectedRideId = null;

// Random car images list
const carImages = [
  "assets/car1.jpg",
  "assets/car2.jpg",
  "assets/car3.jpg",
  "assets/car4.jpg"
];

// Convert date to DD MM YYYY
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day} ${month} ${year}`;
}

// Load and render rides
const snapshot = await getDocs(collection(db, "rides"));
if (snapshot.empty) {
  rideList.innerHTML = "<p>No rides available yet.</p>";
}

const now = Date.now();

snapshot.forEach((docSnap) => {
  const ride = docSnap.data();
  const id = docSnap.id;

  if (ride.expiryTimestamp && ride.expiryTimestamp < now) return;

  const joined = ride.passengers?.length || 0;
  const seatsLeft = Math.max(0, ride.seats - joined);
  const carImage = carImages[Math.floor(Math.random() * carImages.length)];

  const priceDisplay =
    ride.price.toLowerCase() === "free" ? "Free" : `PKR ${ride.price}`;

  const card = document.createElement("div");
  card.className = "ride-card minimal";

card.innerHTML = `
  <div class="ride-card-inner">
    <div class="ride-info">
      <div class="date-time">${formatDate(ride.date)} | ${ride.time}</div>
      <h3>${ride.driverName}</h3>
      <div class="rider-meta">${ride.department} - ${ride.batch}</div>
      
      <p><strong>From:</strong> ${ride.from}</p>
      <p><strong>To:</strong> ${ride.to}</p>
      
      <span class="ride-status ${seatsLeft > 0 ? "planned" : "awaiting"}">
        ${seatsLeft > 0 ? "Planned" : "Awaiting Driver"}
      </span>
    </div>
    <div class="ride-side">
      <img src="${carImage}" class="car-photo" />
      <div class="fare">${priceDisplay} ⏱</div>
      <button class="join-btn" data-id="${id}" ${seatsLeft === 0 ? "disabled" : ""}>
        Join Ride
      </button>
    </div>
  </div>
`;



  rideList.appendChild(card);
});

// Join popup logic
rideList.addEventListener("click", (e) => {
  if (e.target.classList.contains("join-btn")) {
    const rideId = e.target.getAttribute("data-id");

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "login.html";
      } else {
        selectedRideId = rideId;
        joinPopup.classList.remove("hidden");
      }
    });
  }
});

closeBtn.addEventListener("click", () => {
  joinPopup.classList.add("hidden");
  joinForm.reset();
});

joinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("passengerName").value.trim();
  const contact = document.getElementById("passengerContact").value.trim();

  const rideRef = doc(db, "rides", selectedRideId);
  const rideSnap = await getDoc(rideRef);

  if (!rideSnap.exists()) {
    alert("Ride not found.");
    return;
  }

  const rideData = rideSnap.data();
  const passengers = rideData.passengers || [];

  if (passengers.length >= rideData.seats) {
    alert("No seats available.");
    return;
  }

  passengers.push({
    name,
    contact,
    userId: auth.currentUser.uid
  });

  await updateDoc(rideRef, { passengers });

  alert("Successfully joined the ride!");
  joinPopup.classList.add("hidden");
  joinForm.reset();
  window.location.reload();
});
