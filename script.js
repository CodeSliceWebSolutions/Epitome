import { doc, getDoc, setDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const lessonMessages = {
  0: "message 1.",
  1: "Gmessage 2.",
  2: "N3.",
  3: "St4.",
  4: "Lemessage 5."
};

let count = 0;

const countEl = document.getElementById("count");
const messageEl = document.getElementById("lessonMessage");
const lessonContentEl = document.getElementById("lessonContent");
const readBtn = document.getElementById("readBtn");

function renderLesson(count) {
  if (count >= 4) {
    messageEl.textContent = lessonMessages[4];
    readBtn.disabled = true;

    lessonContentEl.innerHTML = `
      <h1>progress</h1>
      
    `;
  } else {
    messageEl.textContent = lessonMessages[count];
  }
}

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    count = snap.data().progress?.lesson1 || 0;
  } else {
    await setDoc(ref, { progress: { lesson1: 0 } });
    count = 0;
  }

  countEl.textContent = count;
  renderLesson(count);
});

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
