let cards = JSON.parse(localStorage.getItem('bingoCards')) || [];
let currentCardIndex = null;

function saveCards() {
  localStorage.setItem('bingoCards', JSON.stringify(cards));
}

function backToMenu() {
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("editor").classList.add("hidden");
  document.getElementById("play").classList.add("hidden");
  renderCardList();
}

function renderCardList() {
  const list = document.getElementById("cardList");
  list.innerHTML = "";

  cards.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card-entry";

    const name = document.createElement("span");
    name.textContent = card.name;

    const playBtn = document.createElement("button");
    playBtn.textContent = "🎮";
    playBtn.onclick = () => playCard(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editCard(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => {
      if (confirm("Karte wirklich löschen?")) {
        cards.splice(index, 1);
        saveCards();
        renderCardList();
      }
    };

    const exportBtn = document.createElement("button");
    exportBtn.textContent = "⬇️";
    exportBtn.onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(card));
      const dlAnchor = document.createElement("a");
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", `${card.name}.json`);
      dlAnchor.click();
    };

    div.appendChild(name);
    div.appendChild(playBtn);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    div.appendChild(exportBtn);
    list.appendChild(div);
  });
}

function createNewCard() {
  const name = document.getElementById("cardName").value.trim();
  if (!name) return alert("Bitte Namen eingeben!");
  const fields = Array(16).fill({ category: "", text: "" });
  cards.push({ name, fields });
  saveCards();
  document.getElementById("cardName").value = "";
  editCard(cards.length - 1);
}

function editCard(index) {
  currentCardIndex = index;
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("editor").classList.remove("hidden");
  document.getElementById("editorTitle").textContent = `Bearbeite: ${cards[index].name}`;

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  cards[index].fields.forEach((field, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";

    const catInput = document.createElement("input");
    catInput.placeholder = "Kategorie";
    catInput.value = field.category;
    catInput.oninput = e => cards[index].fields[i].category = e.target.value;

    const textInput = document.createElement("input");
    textInput.placeholder = "Inhalt";
    textInput.value = field.text;
    textInput.oninput = e => cards[index].fields[i].text = e.target.value;

    cell.appendChild(catInput);
    cell.appendChild(textInput);
    grid.appendChild(cell);
  });
}

function saveCard() {
  saveCards();
  backToMenu();
}

function playCard(index) {
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");
  document.getElementById("playTitle").textContent = cards[index].name;

  const grid = document.getElementById("playGrid");
  grid.innerHTML = "";

  cards[index].fields.forEach((field, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => cell.classList.toggle("marked");

    if (field.category) {
      const cat = document.createElement("div");
      cat.className = "category";
      cat.textContent = field.category;
      cell.appendChild(cat);
    }

    const txt = document.createElement("div");
    txt.textContent = field.text;
    cell.appendChild(txt);
    grid.appendChild(cell);
  });
}

// Init
renderCardList();
