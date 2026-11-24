
// 衣装・背景データ
const items = [
  {
    id: "hair001",
    name: "みつあみ",
    category: "hair",
    image: "images/hair001.png",
    thumbnail: "images/thumbnails/hair001.jpg"
  },
  {
    id: "hair002",
    name: "ツインテール",
    category: "hair",
    image: "images/hair002.png",
    thumbnail: "images/thumbnails/hair002.jpg"
  },
  {
    id: "top001",
    name: "シャツ",
    category: "top",
    image: "images/top001.png",
    thumbnail: "images/thumbnails/top001.jpg"
  },
  {
    id: "bottom001",
    name: "ストライプスカート",
    category: "bottom",
    image: "images/bottom001.png",
    thumbnail: "images/thumbnails/bottom001.jpg"
  },
  {
    id: "bottom002",
    name: "マーメイドスカート",
    category: "bottom",
    image: "images/bottom002.png",
    thumbnail: "images/thumbnails/bottom002.jpg",
    hideBase: ["legs"]
  },
  {
    id: "onepiece001",
    name: "ワンピース",
    category: "onepiece",
    image: "images/onepiece001.png",
    thumbnail: "images/thumbnails/onepiece001.jpg"
  },
  {
    id: "shoes001",
    name: "シューズ",
    category: "shoes",
    image: "images/shoes001.png",
    thumbnail: "images/thumbnails/shoes001.jpg"
  },
  {
    id: "shoes002",
    name: "シューズ2",
    category: "shoes",
    image: "images/shoes002.png",
    thumbnail: "images/thumbnails/shoes002.jpg"
  },
  {
    id: "accessory001",
    name: "リボン",
    category: "accessory",
    image: "images/accessory001.png",
    thumbnail: "images/thumbnails/accessory001.jpg"
  },
  {
    id: "accessory002",
    name: "ティアラ",
    category: "accessory",
    image: "images/accessory002.png",
    thumbnail: "images/thumbnails/accessory002.jpg"
  },

  // 背景
  {
    id: "room001",
    name: "庭",
    category: "background",
    image: "images/backgrounds/room001.jpg",
    thumbnail: "images/thumbnails/room001.jpg"
  },
  {
    id: "room002",
    name: "夜空",
    category: "background",
    image: "images/backgrounds/room002.jpg",
    thumbnail: "images/thumbnails/room002.jpg"
  },
  {
    id: "room003",
    name: "遊園地",
    category: "background",
    image: "images/backgrounds/room003.jpg",
    thumbnail: "images/thumbnails/room003.jpg"
  }
];

// 最初から持っている衣装・背景
const starterItems = [
  "hair001",
  "hair002",
  "top001",
  "bottom001",
  "bottom002",
  "onepiece001",
  "shoes001",
  "shoes002",
  "accessory001",
  "accessory002",
  "room001",
  "room002",
  "room003"
];

// 保存済みアイテムを読み込む
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

// 初期所持アイテムを統合
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

// ベース画像
const baseParts = {
  body: document.getElementById("base-body"),
  arms: document.getElementById("base-arms"),
  legs: document.getElementById("base-legs")
};

// 背景画像
const backgroundLayer =
  document.getElementById("background");

// 衣装レイヤー
const layers = {
  hair: document.getElementById("hair"),
  top: document.getElementById("top"),
  bottom: document.getElementById("bottom"),
  onepiece: document.getElementById("onepiece"),
  shoes: document.getElementById("shoes"),
  accessory: document.getElementById("accessory")
};

// クローゼット関連
const itemsArea = document.getElementById("items");
const countText = document.getElementById("collection-count");

const categoryButtons =
  document.querySelectorAll("#categories button");

const resetButton =
  document.getElementById("reset-button");

let currentCategory = "all";

// 現在着ている衣装
const equippedItems = {
  hair: null,
  top: null,
  bottom: null,
  onepiece: null,
  shoes: null,
  accessory: null
};

// 現在選択している背景
let equippedBackground = null;

// 初期装備を設定
function setInitialItems() {
  const initialHair = items.find(
    item => item.id === "hair001"
  );

  const initialBackground = items.find(
    item => item.id === "room001"
  );

  // 初期髪型
  if (initialHair && layers.hair) {
    layers.hair.src = initialHair.image;
    equippedItems.hair = initialHair;
  }

  // 初期背景
  if (initialBackground && backgroundLayer) {
    backgroundLayer.src = initialBackground.image;
    equippedBackground = initialBackground;
  }
}

// ベース画像の表示状態を更新
function updateBaseParts() {
  const hiddenParts = new Set();

  Object.values(equippedItems).forEach(item => {
    if (item && Array.isArray(item.hideBase)) {
      item.hideBase.forEach(part => {
        hiddenParts.add(part);
      });
    }
  });

  Object.entries(baseParts).forEach(([part, image]) => {
    if (image) {
      image.hidden = hiddenParts.has(part);
    }
  });
}

// アイテムを着せ替える
function equipItem(item) {

  // 背景の場合
  if (item.category === "background") {

    // 選択中の背景を押しても解除しない
    if (equippedBackground?.id === item.id) {
      return;
    }

    // 別の背景に切り替える
    backgroundLayer.src = item.image;
    equippedBackground = item;

    return;
  }

  // 衣装の場合
  const layer = layers[item.category];

  if (!layer) return;

  // 髪型は脱げない
  if (item.category === "hair") {

    // 選択中の髪型なら何もしない
    if (equippedItems.hair?.id === item.id) {
      return;
    }

    // 別の髪型に切り替える
    layer.src = item.image;
    equippedItems.hair = item;

    return;
  }

  // 同じ衣装を再度押したら脱ぐ
  if (equippedItems[item.category]?.id === item.id) {
    layer.removeAttribute("src");
    equippedItems[item.category] = null;
  } else {
    // 違う衣装なら着替える
    layer.src = item.image;
    equippedItems[item.category] = item;
  }

  updateBaseParts();
}

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
    image.src = item.thumbnail || item.image;
    image.alt = item.name;

    const name = document.createElement("p");
    name.textContent = item.name;

    card.appendChild(image);
    card.appendChild(name);

    card.addEventListener("click", () => {
      equipItem(item);
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

  // 衣装をすべて外す
  Object.keys(layers).forEach(category => {

    // 髪型は初期装備を維持
    if (category === "hair") return;

    const layer = layers[category];

    if (layer) {
      layer.removeAttribute("src");
    }

    equippedItems[category] = null;
  });

  // 背景は初期装備を維持
  // room001に戻す
  setInitialItems();

  updateBaseParts();
});

// QRコードからアイテムを受け取る
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
    claimName.textContent =
      "このアイテムはすでに持っているよ！";

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
setInitialItems();
updateBaseParts();
renderItems();
