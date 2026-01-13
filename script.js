// 🔹 Firestore imports
import { doc, getDoc, setDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Firebase config (already working in your project)
import { auth, db } from "./firebase.js";

// ----------------------------
// LOCAL LESSON MESSAGES
// ----------------------------
const lessonMessages = {
  0: "message 1.",
  1: "Gmessage 2.",
  2: "N3.",
  3: "St4.",
  4: "Lemessage 5."
};

let count = 0;

// ----------------------------
// DOM ELEMENTS
// ----------------------------
const countEl = document.getElementById("count");
const messageEl = document.getElementById("lessonMessage");
const lessonContentEl = document.getElementById("lessonContent");
const readBtn = document.getElementById("readBtn");

// ----------------------------
// RENDER LOCAL LESSON MESSAGE
// ----------------------------
function renderLesson(count) {
  if (count >= 4) {
    messageEl.textContent = lessonMessages[4];
    readBtn.disabled = true;

    lessonContentEl.innerHTML = `
      <h1>Progress Complete</h1>
      <p>You have completed this lesson.</p>
    `;
  } else {
    messageEl.textContent = lessonMessages[count];
  }
}

// ----------------------------
// LOAD TASK FROM FIRESTORE
// ----------------------------
async function loadTask(taskId) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      lessonContentEl.innerHTML = "<p>Task not found.</p>";
      return;
    }

    const task = taskSnap.data();

    lessonContentEl.innerHTML = `
      <h1>${task.title}</h1>
      <p>${task.description}</p>
      <small>XP Reward: ${task.xp}</small>
    `;
  } catch (error) {
    console.error("Error loading task:", error);
    lessonContentEl.innerHTML = "<p>Error loading task.</p>";
  }
}

// ----------------------------
// AUTH STATE LISTENER
// ----------------------------
auth.onAuthStateChanged(async user => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    count = snap.data().progress?.lesson1 || 0;
  } else {
    await setDoc(userRef, {
      progress: { lesson1: 0 }
    });
    count = 0;
  }

  countEl.textContent = count;
  renderLesson(count);

  // 🔥 LOAD TASK FROM FIRESTORE
  loadTask("task_001");
});

// ----------------------------
// READ BUTTON CLICK
// ----------------------------
readBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  count++;
  countEl.textContent = count;
  renderLesson(count);

  await setDoc(
    doc(db, "users", user.uid),
    { progress: { lesson1: count } },
    { merge: true }
  );
});
