
async function addAnime() {
  const inputEl = document.getElementById("animeInput");
  const animeName = inputEl.value.trim();
  if (!animeName) return;
  inputEl.value = "";  // Clear input after fetch
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`);
  const data = await response.json();
  if (data.data && data.data.length > 0) {
    const anime = data.data[0];
    const card = {
      id: anime.mal_id,
      image: anime.images.jpg.image_url
    };
    saveAnime(card);
    renderAnimeList();
  } else {
    alert("Anime not found!");
  }
}

function saveAnime(anime) {
  const saved = JSON.parse(localStorage.getItem("animeList") || "[]");
  const exists = saved.find(a => a.id === anime.id);
  if (!exists) {
    saved.push(anime);
    localStorage.setItem("animeList", JSON.stringify(saved));
  }
}

function deleteAnime(id) {
  let saved = JSON.parse(localStorage.getItem("animeList") || "[]");
  saved = saved.filter(a => a.id !== id);
  localStorage.setItem("animeList", JSON.stringify(saved));
  renderAnimeList();
}

function renderAnimeList() {
  const list = document.getElementById("animeList");
  list.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("animeList") || "[]");
  saved.forEach(anime => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.innerHTML = `
      <button class="delete-btn" onclick="deleteAnime(${anime.id})">✖</button>
      <img src="${anime.image}" alt="Anime Logo">
    `;
    list.appendChild(card);
  });
}

window.onload = renderAnimeList;
