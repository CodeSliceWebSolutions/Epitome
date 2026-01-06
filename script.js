import { doc, getDoc, setDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

let count = 0;
const countEl = document.getElementById("count");

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
});

document.getElementById("readBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  count++;
  countEl.textContent = count;

  await setDoc(
    doc(db, "users", user.uid),
    { progress: { lesson1: count } },
    { merge: true }
  );
});
