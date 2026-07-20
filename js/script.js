const tilesContainer = document.querySelector("#tiles");
const tiles = Array.from(document.querySelectorAll(".tile"));
const zones = document.querySelectorAll(".drop-zone");
const scoreEl = document.querySelector("#score");
const totalEl = document.querySelector("#total");
const poemLines = document.querySelector("#poemLines");
const shuffleButton = document.querySelector("#shuffleButton");
const resetButton = document.querySelector("#resetButton");
const explodeButton = document.querySelector("#explodeButton");

let score = 0;
let unlockedLines = [];

totalEl.textContent = tiles.length;

function updateScore() {
  scoreEl.textContent = score;
}

function renderPoem() {
  poemLines.innerHTML = "";

  if (unlockedLines.length === 0) {
    poemLines.innerHTML = "<p>Drag a tile into the correct zone to unlock the first line. 🍓</p>";
    return;
  }

  unlockedLines.forEach((line, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${line}`;
    p.style.setProperty("--tilt", `${Math.floor(Math.random() * 14) - 7}deg`);
    poemLines.appendChild(p);
  });

  if (score === tiles.length) {
    const finalLine = document.createElement("p");
    finalLine.textContent = "Final unlock: Berry Vibes blooms when comfort becomes confidence. ✨";
    finalLine.style.setProperty("--tilt", "0deg");
    poemLines.appendChild(finalLine);
  }
}

function setUpTile(tile) {
  tile.addEventListener("dragstart", () => {
    if (tile.classList.contains("locked")) return;
    tile.classList.add("dragging");
  });

  tile.addEventListener("dragend", () => {
    tile.classList.remove("dragging");
  });
}

tiles.forEach(setUpTile);

zones.forEach(zone => {
  zone.addEventListener("dragover", event => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", event => {
    event.preventDefault();
    zone.classList.remove("drag-over");

    const draggedTile = document.querySelector(".dragging");

    if (!draggedTile || draggedTile.classList.contains("locked")) {
      return;
    }

    const tileVibe = draggedTile.dataset.vibe;
    const zoneVibe = zone.dataset.vibe;

    if (tileVibe === zoneVibe) {
      zone.appendChild(draggedTile);
      draggedTile.classList.add("locked");
      draggedTile.setAttribute("draggable", "false");

      score++;
      updateScore();

      unlockedLines.push(draggedTile.dataset.line);
      renderPoem();

      zone.classList.add("correct-flash");
      setTimeout(() => zone.classList.remove("correct-flash"), 350);
    } else {
      draggedTile.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 250 }
      );
    }
  });
});

shuffleButton.addEventListener("click", () => {
  const movableTiles = Array.from(tilesContainer.querySelectorAll(".tile:not(.locked)"));

  for (let i = movableTiles.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [movableTiles[i], movableTiles[randomIndex]] = [movableTiles[randomIndex], movableTiles[i]];
  }

  movableTiles.forEach(tile => tilesContainer.appendChild(tile));
});

explodeButton.addEventListener("click", () => {
  poemLines.classList.toggle("explode");
});

resetButton.addEventListener("click", () => {
  tiles.forEach(tile => {
    tile.classList.remove("locked", "dragging");
    tile.setAttribute("draggable", "true");
    tilesContainer.appendChild(tile);
  });

  score = 0;
  unlockedLines = [];
  updateScore();
  renderPoem();
});

updateScore();
renderPoem();

