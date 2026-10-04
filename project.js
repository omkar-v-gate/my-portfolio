const container = document.querySelector(".project-container");
const cards = document.querySelectorAll(".project-card");
let index = 0;

document.querySelector(".arrow.right").addEventListener("click", () => {
  if (index < cards.length - 1) {
    index++;
    container.style.transform = `translateX(-${index * 100}%)`;
  }
});

document.querySelector(".arrow.left").addEventListener("click", () => {
  if (index > 0) {
    index--;
    container.style.transform = `translateX(-${index * 100}%)`;
  }
});
