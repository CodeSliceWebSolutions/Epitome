let readCount = 0;

const button = document.getElementById("readBtn");
const counter = document.getElementById("counter");

button.addEventListener("click", () => {
	readCount++;
	counter.textContent = `Times read: ${readCount}`;
});
