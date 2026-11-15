const phrases = [
    ["Consuetudo est altera natura", "Привычка - вторая натура"],
    ["Nota bene", "Заметьте хорошо!"],
    ["Nulla calamitas sola", "Беда не приходит одна"],
    ["Per aspera ad astra", "Через тернии к звёздам"],
    ["Carpe diem", "Лови момент"],
    ["Veni, vidi, vici", "Пришёл, увидел, победил"],
    ["Dum spiro, spero", "Пока дышу, надеюсь"]
];

const order = phrases.map((_, index) => index);
for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
}

let clicks = 0;
const table = document.querySelector(".phrase-table");
const emptyNote = document.querySelector(".dom-empty");

document.querySelector(".dom-create").addEventListener("click", () => {
    if (order.length === 0) {
        emptyNote.hidden = false;
        return;
    }

    clicks += 1;
    const [latin, russian] = phrases[order.pop()];
    const row = document.createElement("tr");
    row.className = clicks % 2 === 0 ? "class1" : "class2";

    const latinCell = document.createElement("td");
    const russianCell = document.createElement("td");
    latinCell.textContent = latin;
    russianCell.textContent = russian;
    row.append(latinCell, russianCell);
    table.append(row);
});

document.querySelector(".dom-recolor").addEventListener("click", () => {
    const rows = [...table.querySelectorAll("tr")].slice(1);

    rows.forEach((row, index) => {
        const number = index + 1;
        row.style.fontWeight = number % 2 === 0 ? "bold" : "normal";
    });
});
