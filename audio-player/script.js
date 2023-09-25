const menuBtn = document.querySelector('.menu-btn'),
  container = document.querySelector('.container'),
  playlistContainer = document.querySelector('#playlist'),
  infoWrapper = document.querySelector(".info"),
  coverImage = document.querySelector(".cover-image"),
  currentSongTitle = document.querySelector(".current-song-title"),
  currentFavorite = document.querySelector("#current-favorite"),
  playPauseBtn = document.querySelector("#playpause"),
  nextBtn = document.querySelector("#next"),
  prevBtn = document.querySelector("#prev");
      

let playing = false,
  currentSong = 0,
  shuffle = false,
  repeat = false,
  favorites = [],
  audio = new Audio();


const songs = [
  {
    audioSrc: "assets/audio/michael-jackson_-_this-is-it.mp3",
    imgSrc: "assets/img/this-is-it.jpg",
    title: "This Is It",
    artist: "Michael Jackson"
  },
  {
    audioSrc: "assets/audio/michael-jackson_-_beat-it.mp3",
    imgSrc: "assets/img/beat-it.jpg",
    title: "Beat It",
    artist: "Michael Jackson"
  },
  {
    audioSrc: "assets/audio/michael-jackson_-_give-in-to-me.mp3",
    imgSrc: "assets/img/give-in-to-me.jpg",
    title: "Give In to Me",
    artist: "Michael Jackson"
  },
  {
    audioSrc: "assets/audio/freddie-mercury_-_who-wants-to-live-forever.mp3",
    imgSrc: "assets/img/who-wants-to-live-forever.jpg",
    title: "Who Wants to Live Forever",
    artist: "Queen"
  },
  {
    audioSrc: "assets/audio/queen_-_living-on-my-own.mp3",
    imgSrc: "assets/img/living-on-my-own.jpg",
    title: "Living on My Own",
    artist: "Freddie Mercury"
  },
];


menuBtn.addEventListener('click', () => {
  container.classList.toggle('active');
});


function init() {
  updatePlaylist(songs);
  loadSong(currentSong);
}

init();

function updatePlaylist(songs) {

  // remove any existing elements

  playlistContainer.innerHTML = "";

  // use for each on songs array

  songs.forEach((song, index) => {
    // extract data from song
    const { title, audioSrc } = song;

    // check if included in favorites array
    const isFavorite = favorites.includes(index);

    // create a tr to wrappe song
    const tr = document.createElement("tr");
    tr.classList.add("song");
    tr.innerHTML = `
    <td class="no">
      <h5>${index + 1}</h5>
    </td>
    <td class="title">
      <h6>${title}</h6>
    </td>
    <td class="length">
      <h5>2:33</h5>
    </td>
    <td>
      <i class="fas fa-heart ${ isFavorite ? "active" : ""}"></i>
    </td>
    `;

    playlistContainer.appendChild(tr);



    tr.addEventListener("click", (e) => {

      // add song to favorites, when clicked on heart
      if (e.target.classList.contains("fa-heart")) {
        addToFavorites(index);
        e.target.classList.toggle("active");
        // if heart clicked, just add to favorites, don't play
        return;
      }

      // play song, when ckicked on playlist song, except clicking heart
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      playPauseBtn.classList.replace("fa-play", "fa-pause");
      playing = true;

    });


    const audioForDuration = new Audio(`${audioSrc}`);
    audioForDuration.addEventListener("loadedmetadata", () => {
      const duration = audioForDuration.duration;

      let songDuration = formatTime(duration);
      tr.querySelector(".length h5").innerText = songDuration;
    })
  });
}


function formatTime(time) {
  // format time like 2:03
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  // add traling zero if seconds less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}


// audio play functionality

function loadSong(num) {
  // change all the title artist and times to current song

  infoWrapper.innerHTML = `
      <h2>${songs[num].title}</h2>
      <h3>${songs[num].artist}</h3>
  `;

  currentSongTitle.innerHTML = songs[num].title;

  // change the cover image

  coverImage.style.backgroundImage = `url(${songs[num].imgSrc})`;

  // add src of current song to audio variable

  audio.src = `${songs[num].audioSrc}`;

  // if song is in favorite highlight

  if (favorites.includes(num)) {
    currentFavorite.classList.add("active");
  }
  else {
    // if not remove active
    currentFavorite.classList.remove("active");
  }
}


// play/pause prev/next functionality
playPauseBtn.addEventListener("click", () => {
  if (playing) {
    //pause, if already playing
    playPauseBtn.classList.replace("fa-pause", "fa-play");
    playing = false;
    audio.pause();
  } else {
    // play, if not playing
    playPauseBtn.classList.replace("fa-play", "fa-pause");
    playing = true;
    audio.play();
  }
});


function nextSong() {
  // if current song is not last in playlist
  if (currentSong < songs.length - 1) {
    // load the next song
    currentSong++;
    loadSong(currentSong);
  } else {
    // if its last song, then play first song
    currentSong = 0;
  }
  loadSong(currentSong);

  // after loading, if the song was playing keep it playing

  if (playing) {
    audio.play();
  }
}


function prevSong() {
  // if current song is not first in playlist
  if (currentSong > 0) {
    // load the previous song
    currentSong--;
    loadSong(currentSong);
  } else {
  // if the first song is playing, then go to the last song
    currentSong =  songs.length - 1;
  }

  loadSong(currentSong);

  // after loading, if the song was playing keep it playing

  if (playing) {
    audio.play();
  }
}


nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);


function addToFavorites(index) {
  // check if it's already in favorites, then remove it
  if (favorites.includes(index)) {
    favorites = favorites.filter((item) => item !== index);

    // if current song what is playing removed, than remove active for currentFavorite
    currentFavorite.classList.remove("active");
  } else {
    // add to favorites,  if it hasn't been added before
    favorites.push(index);
    
    // if the index matches that of the current favorite
    if (index === currentSong) {
    currentFavorite.classList.add("active");
    }
  }

  // after adding a favorite, update the playlist to display the favorites
  updatePlaylist(songs);
}


// add the current song to favorites, if it hasn't been added before
currentFavorite.addEventListener("click", () => {
  currentFavorite.classList.toggle("active");
  addToFavorites(currentSong);
});


