window.onload = () => {
  renderAnimeList();
};

async function addAnime() {
  const input = document.getElementById("animeInput");
  const animeName = input.value.trim().toLowerCase();
  if (!animeName) return;
  input.value = ""; // Clear input

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${animeName}&limit=1`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const anime = data.data[0];
      const saved = JSON.parse(localStorage.getItem("animeList") || "[]");

      const alreadyExistsIndex = saved.findIndex(a => a.id === anime.mal_id);
      if (alreadyExistsIndex !== -1) {
        scrollToAnime(anime.mal_id);
        return;
      }

      saved.push({ id: anime.mal_id, image: anime.images.jpg.image_url });
      localStorage.setItem("animeList", JSON.stringify(saved));
      renderAnimeList(() => scrollToAnime(anime.mal_id));
    } else {
      alert("Anime not found!");
    }
  } catch (err) {
    alert("Error fetching anime data!");
    console.error(err);
  }
}

function renderAnimeList(callback) {
  const list = document.getElementById("animeList");
  list.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("animeList") || "[]");

  saved.forEach((anime, index) => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.id = `anime-${anime.id}`;
    card.style.position = "relative";
    card.innerHTML = `
      <img src="${anime.image}" alt="Anime Logo" style="width: 100%; border-radius: 8px;">
      <button onclick="deleteAnime(${index})"
        style="position: absolute; top: 4px; right: 4px; background: #000000; color: white; border: none; border-radius: 100%; width: 10px; height: 35px; cursor: pointer;">
        ✖
      </button>
    `;
    list.appendChild(card);
  });

  updateCounterDisplay(saved.length);
  if (typeof callback === "function") callback();
}


function deleteAnime(index) {
  const saved = JSON.parse(localStorage.getItem("animeList") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("animeList", JSON.stringify(saved));
  renderAnimeList();
}

function scrollToAnime(id) {
  const el = document.getElementById(`anime-${id}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function updateCounterDisplay(count) {
  const counter = document.getElementById("animeCounter");
  counter.textContent = `Total Animes: ${count}`;
}
