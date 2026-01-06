import { collection, getDocs } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const ADMIN_UID = "zPuzBifNNAgtRGq1MMth6sUl4SC2";

auth.onAuthStateChanged(async user => {
  if (!user || user.uid !== ADMIN_UID) return;

  const snap = await getDocs(collection(db, "users"));
  snap.forEach(d => {
    console.log(d.id, d.data().progress);
  });
});
