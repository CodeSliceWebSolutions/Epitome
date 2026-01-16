// 🔹 Firestore imports
import { doc, getDoc, setDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Firebase config
import { auth, db } from "./firebase.js";

let count = 0;

// ----------------------------
// DOM ELEMENTS
// ----------------------------
const countEl = document.getElementById("count");
const lessonContentEl = document.getElementById("lessonContent");
const readBtn = document.getElementById("readBtn");

// MODAL ELEMENTS
const modal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

// ----------------------------
// HELPERS
// ----------------------------
function getTaskIdFromProgress(progress) {
  return `task_${String(progress + 1).padStart(3, "0")}`;
}

// ----------------------------
// LOAD TASK FROM FIRESTORE
// ----------------------------
async function loadTask(taskId) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const snap = await getDoc(taskRef);

    if (!snap.exists()) {
      lessonContentEl.innerHTML = "<p>Task not found.</p>";
      return;
    }

    const task = snap.data();

    lessonContentEl.innerHTML = `
      <h1>${task.title}</h1>
      <p>${task.description}</p>
      <small>XP Reward: ${task.xp}</small>
    `;
  } catch (err) {
    lessonContentEl.innerHTML = "<p>Error loading task.</p>";
    console.error(err);
  }
}

// ----------------------------
// AUTH STATE
// ----------------------------
auth.onAuthStateChanged(async user => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    count = snap.data().progress?.lesson1 || 0;
  } else {
    await setDoc(userRef, { progress: { lesson1: 0 } });
    count = 0;
  }

  countEl.textContent = count;
  loadTask(getTaskIdFromProgress(count));
});

// ----------------------------
// READ BUTTON → OPEN MODAL
// ----------------------------
readBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// ----------------------------
// CONFIRM YES → PROGRESS
// ----------------------------
confirmYes.addEventListener("click", async () => {
  modal.classList.add("hidden");

  const user = auth.currentUser;
  if (!user) return;

  count++;
  countEl.textContent = count;

  await setDoc(
    doc(db, "users", user.uid),
    { progress: { lesson1: count } },
    { merge: true }
  );

  loadTask(getTaskIdFromProgress(count));
});

// ----------------------------
// CONFIRM NO → CLOSE MODAL
// ----------------------------
confirmNo.addEventListener("click", () => {
  modal.classList.add("hidden");
});
