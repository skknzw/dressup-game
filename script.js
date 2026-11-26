
// 衣装・背景データ
const items = [
  // 髪型
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

  // トップス
  {
    id: "top001",
    name: "シャツ",
    category: "top",
    image: "images/top001.png",
    thumbnail: "images/thumbnails/top001.jpg"
  },
  {
    id: "top002",
    name: "ゴシックトップス",
    category: "top",
    image: "images/top002.png",
    thumbnail: "images/thumbnails/top002.jpg"
  },

  // ボトムス
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
    id: "bottom003",
    name: "ゴシックスカート",
    category: "bottom",
    image: "images/bottom003.png",
    thumbnail: "images/thumbnails/bottom003.jpg"
  },

  // ワンピース
  {
    id: "onepiece001",
    name: "ワンピース",
    category: "onepiece",
    image: "images/onepiece001.png",
    thumbnail: "images/thumbnails/onepiece001.jpg"
  },

  // アウター
  {
    id: "outer001",
    name: "アウター",
    category: "outer",
    image: "images/outer001.png",
    thumbnail: "images/thumbnails/outer001.jpg"
  },

  // 靴
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

  // アクセサリー
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
  "top002",
  "bottom001",
  "bottom002",
  "bottom003",
  "onepiece001",
  "outer001",
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

// 旧ID inner001 を新ID top002 に移行
savedItems = savedItems.map(id => {
  return id === "inner001" ? "top002" : id;
});

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
  shoes: document.getElementById("shoes"),
  bottom: document.getElementById("bottom"),
  top: document.getElementById("top"),
  onepiece: document.getElementById("onepiece"),
  outer: document.getElementById("outer"),
  hair: document.getElementById("hair"),
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

// トップスとボトムスの前後関係
// 初期状態ではトップスが手前
let topBottomFront = "top";

function updateTopBottomOrder() {
  if (topBottomFront === "top") {
    layers.top.style.zIndex = "7";
    layers.bottom.style.zIndex = "6";
  } else {
    layers.top.style.zIndex = "6";
    layers.bottom.style.zIndex = "7";
  }
}

// 現在着ている衣装
const equippedItems = {
  shoes: null,
  bottom: null,
  top: null,
  onepiece: null,
  outer: null,
  hair: null,
  accessory: null
};

// 現在選択している背景
let equippedBackground = null;

// 初期装備
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

    // 選択中の背景は脱げない
    if (equippedBackground?.id === item.id) {
      return;
    }

    // 別の背景に切り替える
    backgroundLayer.src = item.image;
    equippedBackground = item;

    return;
  }

  const layer = layers[item.category];

  if (!layer) return;

  // 髪型の場合
  if (item.category === "hair") {

    // 選択中の髪型は脱げない
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

    // トップス・ボトムスをタップした順番で前後変更
    if (
      item.category === "top" ||
      item.category === "bottom"
    ) {
      topBottomFront = item.category;
      updateTopBottomOrder();
    }
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

  // 髪型以外の衣装を外す
  Object.keys(layers).forEach(category => {

    if (category === "hair") return;

    const layer = layers[category];

    if (layer) {
      layer.removeAttribute("src");
    }

    equippedItems[category] = null;
  });

  // トップスとボトムスの前後関係を初期状態に戻す
  topBottomFront = "top";
  updateTopBottomOrder();

  // 初期髪型・背景に戻す
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

// Canvasへの書き出しを可能にするため、キャラクター画像はCORSモードで読み込む
// ※ HTML側にもcrossorigin="anonymous"を指定し、初期画像の読み込み前に適用する
const characterImages = document.querySelectorAll(".character img");
characterImages.forEach(image => {
  image.crossOrigin = "anonymous";
});

// 最初の表示
setInitialItems();
updateTopBottomOrder();
updateBaseParts();
renderItems();


// =========================
// コーデ画像のJPEG保存
// =========================
const saveCoordinateButton = document.getElementById("save-coordinate-button");
const saveModal = document.getElementById("save-modal");
const savedCoordinatePreview = document.getElementById("saved-coordinate-preview");
const downloadJpegButton = document.getElementById("download-jpeg-button");
const closeSaveModalButton = document.getElementById("close-save-modal-button");

let currentJpegBlob = null;
let currentJpegUrl = null;

function waitForImage(image) {
  // 読み込み済みなら即時に進む。読み込み失敗も待ち続けずエラーにする
  if (image.complete) {
    if (image.naturalWidth > 0) return Promise.resolve();
    return Promise.reject(
      new Error(`画像を読み込めませんでした: ${image.src || image.id}`)
    );
  }

  return new Promise((resolve, reject) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", () => {
      reject(new Error(`画像を読み込めませんでした: ${image.src || image.id}`));
    }, { once: true });
  });
}

function drawImageFitted(context, image, width, height) {
  const fit = getComputedStyle(image).objectFit || "contain";

  if (fit === "fill") {
    context.drawImage(image, 0, 0, width, height);
    return;
  }

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;

  if (fit === "cover") {
    let sx = 0, sy = 0;
    let sw = image.naturalWidth, sh = image.naturalHeight;

    if (imageRatio > canvasRatio) {
      sw = image.naturalHeight * canvasRatio;
      sx = (image.naturalWidth - sw) / 2;
    } else {
      sh = image.naturalWidth / canvasRatio;
      sy = (image.naturalHeight - sh) / 2;
    }

    context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    return;
  }

  // object-fit: contain
  let drawWidth = width;
  let drawHeight = height;

  if (imageRatio > canvasRatio) {
    drawHeight = width / imageRatio;
  } else {
    drawWidth = height * imageRatio;
  }

  context.drawImage(
    image,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
}

async function createCoordinateJpeg() {
  const character = document.querySelector(".character");
  const images = Array.from(character.querySelectorAll("img"));

  const visibleImages = images.filter(image =>
    !image.hidden &&
    image.getAttribute("src") &&
    getComputedStyle(image).display !== "none"
  );

  await Promise.all(visibleImages.map(waitForImage));

  const canvas = document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 880;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("画像を作成できませんでした。");

  // JPEGには透明部分がないため、背景色を敷く
  context.fillStyle = "#fff9fb";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // 画面上のz-index順で合成し、同じ値ならHTML順を維持
  const sortedImages = visibleImages
    .map((image, index) => ({
      image,
      index,
      zIndex: Number.parseInt(getComputedStyle(image).zIndex, 10) || 0
    }))
    .sort((a, b) => a.zIndex - b.zIndex || a.index - b.index);

  for (const entry of sortedImages) {
    drawImageFitted(context, entry.image, canvas.width, canvas.height);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("JPEG画像の作成に失敗しました。"));
    }, "image/jpeg", 0.88);
  });
}

saveCoordinateButton.addEventListener("click", async () => {
  saveCoordinateButton.disabled = true;
  const originalLabel = "コーデ画像を保存";
  saveCoordinateButton.textContent = "画像を作成中…";

  try {
    const blob = await createCoordinateJpeg();

    if (currentJpegUrl) URL.revokeObjectURL(currentJpegUrl);

    currentJpegBlob = blob;
    currentJpegUrl = URL.createObjectURL(blob);
    savedCoordinatePreview.src = currentJpegUrl;
    saveModal.hidden = false;
  } catch (error) {
    console.error("コーデ画像の作成エラー:", error);
    alert(
      "画像を作成できませんでした。\n" +
      (error && error.message ? error.message : "画像ファイルの読み込み状態を確認してください。")
    );
  } finally {
    saveCoordinateButton.disabled = false;
    saveCoordinateButton.textContent = originalLabel;
  }
});

downloadJpegButton.addEventListener("click", () => {
  if (!currentJpegBlob || !currentJpegUrl) return;

  const link = document.createElement("a");
  link.href = currentJpegUrl;
  link.download = "my-coordinate.jpg";
  document.body.appendChild(link);
  link.click();
  link.remove();
});

function closeSaveModal() {
  saveModal.hidden = true;
}

closeSaveModalButton.addEventListener("click", closeSaveModal);

saveModal.addEventListener("click", event => {
  if (event.target === saveModal) closeSaveModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !saveModal.hidden) closeSaveModal();
});
