// const url = 'https://youtube-music-api3.p.rapidapi.com/search?q=Kun faya kun&type=song';
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "a5281526c4mshfc99f72b31822f1p158c17jsn3f3482a41862",
    "X-RapidAPI-Host": "youtube-music-api3.p.rapidapi.com",
  },
};

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const imageCards = document.querySelector(".image-card");
const searchInput = document.querySelector(".searchInput");
const musicListDiv = document.querySelector(".music-queue");

let counter = 0;

window.onload = () => {
  fetchData(
    "https://youtube-music-api3.p.rapidapi.com/search?q=Kun faya kun&type=song"
  );
};

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    counter = 0;
    musicListDiv.innerHTML = "";
    imageCards.innerHTML = "";
    let getInputValue = searchInput.value;
    const url = `https://youtube-music-api3.p.rapidapi.com/search?q=${getInputValue}&type=song`;
    fetchData(url);
    searchInput.value = null;
  }
});

function fetchData(url) {
  const fetchMusic = new Promise(async (resolve, reject) => {
    const res = await fetch(url, options);
    const data = await res.json();
    if (data) {
      resolve(data.result);
    } else {
      reject();
    }
  });

  fetchMusic
    .then((result) => {
      bindData(result);
    })
    .catch((err) => console.log("Fetch :: ", err));
}
function bindData(result) {
  let allData = result.map((data, index) => {
    let obj = {
      id: index,
      author: data.author,
      title: data.title,
      thumbnail: data.thumbnail,
    };
    return obj;
  });
  createImage(allData);
  musicQueue(allData);
}

function createImage(allData) {
  allData.forEach((data) => {
    let imageEle = document.createElement("img");
    imageEle.className = "music-image";
    imageEle.src = data.thumbnail;
    imageCards.append(imageEle);
    imageEle.style.left = `${data.id * 100}%`;
  });
}

// Slider Functionality :
function swapImage() {
  const images = imageCards.querySelectorAll("img");
  images.forEach((image) => {
    image.style.transform = `translateX(-${counter * 100}%)`;
  });
}

nextBtn.addEventListener("click", () => {
  const musicArr = musicListDiv.querySelectorAll(".card");
  const images = imageCards.querySelectorAll("img");
  console.log(counter, images.length);
  if (counter >= images.length - 1) {
    nextBtn.classList.add("grayBtn");
    return;
  } else {
    prevBtn.classList.remove("grayBtn");
    counter++;
    musicArr[counter].classList.add("currentMusic");
    musicArr[counter - 1].classList.remove("currentMusic");
    swapImage();
  }
});
prevBtn.addEventListener("click", () => {
  const musicArr = musicListDiv.querySelectorAll(".card");
  if (counter <= 0) {
    prevBtn.classList.add("grayBtn");
    return;
  } else {
    nextBtn.classList.remove("grayBtn");
    counter--;
    musicArr[counter].classList.add("currentMusic");
    musicArr[counter + 1].classList.remove("currentMusic");
    swapImage();
  }
});

function musicQueue(data) {
  const musicTemp = document.getElementById("music-card-template");
  data.forEach(({ author, title, thumbnail}) => {
    const clone = musicTemp.content.cloneNode(true);
    clone.querySelector(".sub-image").src = thumbnail;
    clone.querySelector(".music-title").innerText = title;
    clone.querySelector(".music-author").innerText = author;
    musicListDiv.append(clone);
  });
}
