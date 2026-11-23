
// 衣装データ
const items = [
  {
    id: "hair001",
    name: "テストヘア",
    category: "hair",
    image: "images/hair001.png"
  },
  {
    id: "top001",
    name: "テストトップス",
    category: "top",
    image: "images/top001.png"
  },
  {
    id: "bottom001",
    name: "テストスカート",
    category: "bottom",
    image: "images/bottom001.png"
  },
  {
    id: "onepiece001",
    name: "お気に入りワンピース",
    category: "onepiece",
    image: "images/onepiece001.png"
  },
  {
    id: "shoes001",
    name: "シューズ",
    category: "shoes",
    image: "images/shoes001.png"
  },
  {
    id: "shoes002",
    name: "シューズ２",
    category: "shoes",
    image: "images/shoes002.png"
  }
];

// 最初から持っている衣装
const starterItems = [
  "hair001",
  "top001",
  "bottom001",
  "onepiece001",
  "shoes001",
  "shoes002"
];

// ブラウザに保存された所持情報を読み込む
let savedItems = [];

try {
  savedItems = JSON.parse(
    localStorage.getItem("ownedItems") || "[]"
  );

  if (!Array.isArray(savedItems)) {
    savedItems = [];
  }
} catch {
  savedItems = [];
}

// 初期衣装は必ず所持状態にする
let ownedItems = [...new Set([
  ...starterItems,
  ...savedItems
])];

// 保存
function saveItems() {
  localStorage.setItem(
    "ownedItems",
    JSON.stringify(ownedItems)
  );
}

saveItems();

// キャラクターの着せ替えパーツ
const layers = {
  hair: document.getElementById("hair"),
  top: document.getElementById("top"),
  bottom: document.getElementById("bottom"),
  onepiece: document.getElementById("onepiece"),
  shoes: document.getElementById("shoes"),
  accessory: document.getElementById("accessory")
};

const itemsArea = document.getElementById("items");
const countText = document.getElementById("collection-count");
const categoryButtons =
  document.querySelectorAll("#categories button");
const resetButton = document.getElementById("reset-button");

let currentCategory = "all";

// クローゼットを表示
function renderItems() {
  itemsArea.innerHTML = "";

  const filteredItems = items.filter(item => {
    return ownedItems.includes(item.id) &&
      (
        currentCategory === "all" ||
        item.category === currentCategory
      );
  });

  filteredItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;

    const name = document.createElement("p");
    name.textContent = item.name;

    card.appendChild(image);
    card.appendChild(name);

    card.addEventListener("click", () => {
      const layer = layers[item.category];

      if (layer) {
        layer.src = item.image;
      }
    });

    itemsArea.appendChild(card);
  });

  countText.textContent =
    `所持アイテム：${ownedItems.length}種類`;
}

// カテゴリー切り替え
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;
    renderItems();
  });
});

// コーデをリセット
resetButton.addEventListener("click", () => {
  Object.values(layers).forEach(layer => {
    layer.removeAttribute("src");
  });
});

// QRコードから衣装を受け取る
const claimArea = document.getElementById("claim-area");
const claimName = document.getElementById("claim-name");
const claimButton = document.getElementById("claim-button");

const params = new URLSearchParams(
  window.location.search
);

const itemId = params.get("item");

const claimItem = items.find(
  item => item.id === itemId
);

if (claimItem) {
  if (ownedItems.includes(claimItem.id)) {
    claimName.textContent = "この衣装はすでに持っているよ！";
    claimButton.hidden = true;
    claimArea.hidden = false;
  } else {
    claimName.textContent =
      `${claimItem.name} が届いたよ！`;

    claimArea.hidden = false;

    claimButton.addEventListener("click", () => {
      if (!ownedItems.includes(claimItem.id)) {
        ownedItems.push(claimItem.id);
        saveItems();
      }

      claimName.textContent =
        `${claimItem.name} を受け取ったよ！`;

      claimButton.hidden = true;
      renderItems();
    });
  }
}

// 最初の表示
renderItems();
