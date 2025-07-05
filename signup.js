// signup.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple validation
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      // Create user account
      await createUserWithEmailAndPassword(auth, email, password);

      alert("✅ Account created successfully! Redirecting to login...");
      window.location.href = 'login.html';

    } catch (error) {
      // Friendly error messages
      let message = "❌ Signup failed.";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "⚠️ This email is already registered.";
          break;
        case "auth/invalid-email":
          message = "⚠️ Please enter a valid email address.";
          break;
        case "auth/weak-password":
          message = "⚠️ Password must be at least 6 characters.";
          break;
        default:
          message += `\n${error.message}`;
      }

      alert(message);
    }
  });
});
