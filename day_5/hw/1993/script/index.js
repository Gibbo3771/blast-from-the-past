// globals
isKitty = true;

function fetchCuteAnimals(url, apiKey, limit, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = JSON.parse(xmlhttp.responseText);
      callback(data);
    }
  };

  xmlhttp.open("GET", url + "&limit=" + limit, true);
  xmlhttp.setRequestHeader("x-api-key", apiKey);
  xmlhttp.send();
}

const fadeOut = (element, duration, callback) => {
  let op = 1;
  let timer = setInterval(function() {
    if (op <= 0.1) {
      clearInterval(timer);
      element.parentNode.removeChild(element);
      if (callback) callback();
    }
    element.style.opacity = op;
    op -= op * 0.1;
  }, duration);
};

const randomBgColor = () => {
  const i =
    "hsla(" +
    Math.round(Math.random() * 360) +
    ", " +
    "100%, " +
    "50%, " +
    1 +
    ")";
  return i;
};

const randomRotation = (max, min) => {
  const r =
    "rotate(" +
    (Math.floor(Math.random() * (max - min + 1)) + min) +
    "deg" +
    ")";
  return r;
};

const createMouseParticles = evt => {
  [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].forEach(function(i) {
    const starParts = [
      document.createElement("div"),
      document.createElement("div")
    ];
    const offset = (1 - i) * 40;
    const size = Math.random() * 12 + "px";
    const background = randomBgColor();
    const offSetX =
      evt.clientX +
      document.body.scrollLeft +
      Math.round(Math.random() * offset - offset / 2) +
      "px";
    const offSetY =
      evt.clientY +
      document.body.scrollTop +
      Math.round(Math.random() * offset - offset / 2) +
      "px";
    const fade = Math.round(Math.random() * i * 45);
    for (let y = 0; y < starParts.length; y++) {
      part = starParts[y];
      part.style.position = "fixed";
      part.style.top = offSetY;
      part.style.left = offSetX;
      part.style.width = size;
      part.style.height = size;
      if (y % 2 == 1) {
        part.style.webkitTransform = "rotate(45deg)";
        part.style.mozTransform = "rotate(45deg)";
        part.style.msTransform = "rotate(45deg)";
        part.style.oTransform = "rotate(45deg)";
        part.style.transform = "rotate(45deg)";
      }
      part.style.background = background;
      part.style.pointerEvents = "none"; // Lol stop it from triggering pointer change
      document.body.appendChild(part);
      fadeOut(part, fade);
    }
  });
};

const addAnimalGifs = data => {
  for (let x = 0; x < data.length; x++) {
    const img = document.createElement("img");
    img.src = data[x].url;
    img.classList.add("gif", "pulse");
    img.style.transform = randomRotation(4, -4);
    i = x % 2 === 0 ? "left" : "right";
    document.getElementsByClassName(`fixed-flex-gifs-${i}`)[0].appendChild(img);
  }
};

const killAllAnimals = evt => {
  isKitty = !isKitty;
  const animLeft = document.getElementsByClassName("gif");
  for (left of animLeft) {
    fadeOut(left, Math.round(Math.random() * 20));
  }
  console.dir(evt);
  if (isKitty) {
    fetchCats();
    evt.target.innerText = "I don't like these cats, please kill them";
  } else {
    fetchDogs();
    evt.target.innerText = "I don't like these dogs, please kill them";
  }
};

const destroyTodo = container => {
  container.parentNode.removeChild(container);
};

const handleSubmit = evt => {
  evt.preventDefault();
  const container = document.getElementById("important-stuffz");
  const item = createListItem(evt.target);
  container.appendChild(item);
};

const createListItem = form => {
  const todoItemContainer = document.createElement("div");
  todoItemContainer.style.background = randomBgColor();
  todoItemContainer.classList.add("todo-item-container");
  const title = document.createElement("h2");
  const desc = document.createElement("h2");
  title.textContent = form.title.value;
  title.classList.add("separator");
  desc.textContent = form.desc.value;

  todoItemContainer.appendChild(title);
  todoItemContainer.appendChild(desc);

  todoItemContainer.style.transform = randomRotation(1, -1);
  const destroyButton = document.createElement("button");
  destroyButton.textContent = "x";
  destroyButton.classList.add("scrap-button");
  destroyButton.addEventListener("click", () => destroyTodo(todoItemContainer));
  todoItemContainer.appendChild(destroyButton);
  return todoItemContainer;
};

const fetchCats = () => {
  fetchCuteAnimals(
    "https://api.thecatapi.com/v1/images/search?mime_types=gif",
    "ceb4f5c6-382c-46f6-b930-2d73cd08898d",
    14,
    addAnimalGifs
  );
};

const fetchDogs = () => {
  fetchCuteAnimals(
    "https://api.thedogapi.com/v1/images/search?mime_types=gif",
    "3c868889-2258-44a9-9b78-3dcacc9d4a0e",
    14,
    addAnimalGifs
  );
};

window.addEventListener("mousemove", createMouseParticles, false);
window.document.addEventListener("DOMContentLoaded", () => {
  fetchCats();

  document
    .getElementById("i-hate-everything-cute")
    .addEventListener("click", killAllAnimals);
  document.getElementById("todo-form").addEventListener("submit", handleSubmit);
});
