const board = document.querySelector(".sort");
const pile = document.querySelector(".sort__pile");
const turnButton = document.querySelector(".sort__turn");

let draggedAnimal = null;
let selectedAnimal = null;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;
let moved = false;

const animals = [...document.querySelectorAll(".animal")];
for (let i = animals.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [animals[i], animals[j]] = [animals[j], animals[i]];
}

animals.forEach((animal) => {
    animal.dataset.angle = String(45 * (1 + Math.floor(Math.random() * 7)));
    applyAngle(animal);
    pile.append(animal);
});

turnButton.addEventListener("click", turnSelected);
board.addEventListener("pointerdown", startDrag);
document.addEventListener("pointermove", moveDrag);
document.addEventListener("pointerup", stopDrag);
document.addEventListener("pointercancel", stopDrag);

function applyAngle(animal) {
    animal.style.setProperty("--angle", animal.dataset.angle + "deg");
}

function turnSelected() {
    if (!selectedAnimal) {
        return;
    }

    const angle = Number(selectedAnimal.dataset.angle) + 45;
    selectedAnimal.dataset.angle = String(angle);
    applyAngle(selectedAnimal);
    checkPlaces();
}

function selectAnimal(animal) {
    if (selectedAnimal) {
        selectedAnimal.classList.remove("is-selected");
    }

    selectedAnimal = animal;
    selectedAnimal.classList.add("is-selected");
    turnButton.disabled = false;
}

function startDrag(event) {
    const animal = event.target.closest(".animal");
    if (!animal) {
        return;
    }

    draggedAnimal = animal;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    const rect = animal.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    selectAnimal(animal);
    animal.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
    if (!draggedAnimal) {
        return;
    }

    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!moved && dx * dx + dy * dy < 25) {
        return;
    }

    if (!moved) {
        moved = true;
        liftAnimal(draggedAnimal);
    }

    draggedAnimal.style.left = (event.clientX - offsetX) + "px";
    draggedAnimal.style.top = (event.clientY - offsetY) + "px";
    markZone(event.clientX, event.clientY);
}

function liftAnimal(animal) {
    const rect = animal.getBoundingClientRect();
    animal.classList.add("is-drag");
    animal.style.width = rect.width + "px";
    animal.style.height = rect.height + "px";
    animal.style.left = rect.left + "px";
    animal.style.top = rect.top + "px";
}

function stopDrag(event) {
    if (!draggedAnimal) {
        return;
    }

    const animal = draggedAnimal;
    draggedAnimal = null;
    clearZones();

    if (!moved) {
        return;
    }

    const under = document.elementFromPoint(event.clientX, event.clientY);
    const group = under && under.closest(".sort__group");
    const back = under && under.closest(".sort__pile");
    let target = animal.parentElement;
    if (group) {
        target = group.querySelector(".sort__drop");
    } else if (back) {
        target = pile;
    }

    animal.classList.remove("is-drag");
    animal.style.left = "";
    animal.style.top = "";
    animal.style.width = "";
    animal.style.height = "";
    target.append(animal);
    checkPlaces();
}

function markZone(x, y) {
    clearZones();
    const under = document.elementFromPoint(x, y);
    const zone = under && under.closest(".sort__group, .sort__pile");
    if (zone) {
        zone.classList.add("is-over");
    }
}

function clearZones() {
    document.querySelectorAll(".is-over").forEach((zone) => {
        zone.classList.remove("is-over");
    });
}

function checkPlaces() {
    let ready = true;
    document.querySelectorAll(".animal").forEach((animal) => {
        const group = animal.closest(".sort__group");
        const upright = Number(animal.dataset.angle) % 360 === 0;
        if (!group || group.dataset.kind !== animal.dataset.kind || !upright) {
            ready = false;
        }
    });

    board.classList.toggle("is-done", ready);
}
