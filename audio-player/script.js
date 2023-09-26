const menuBtn = document.querySelector('.menu-btn'),
  container = document.querySelector('.container'),
  playlistContainer = document.querySelector('#playlist'),
  infoWrapper = document.querySelector(".info"),
  coverImage = document.querySelector(".cover-image"),
  currentSongTitle = document.querySelector(".current-song-title"),
  currentFavorite = document.querySelector("#current-favorite"),
  playPauseBtn = document.querySelector("#playpause"),
  nextBtn = document.querySelector("#next"),
  prevBtn = document.querySelector("#prev"),
  shuffleBtn = document.querySelector("#shuffle"),
  repeatBtn = document.querySelector("#repeat"),
  progressBar = document.querySelector(".bar"),
  progressDot = document.querySelector(".dot"),
  currentTimeEl = document.querySelector(".current-time"),
  durationEl = document.querySelector(".duration");
      

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
  {
    audioSrc: "assets/audio/michael-jackson_-_remember-the-time.mp3",
    imgSrc: "assets/img/remember-the-time.jpg",
    title: "Remember The Time",
    artist: "Michael Jackson"
  },
  {
    audioSrc: "assets/audio/michael-jackson_-_black-or-white.mp3",
    imgSrc: "assets/img/black-or-white.jpg",
    title: "Black or White",
    artist: "Michael Jackson"
  },
  {
    audioSrc: "assets/audio/morandy_-_colors.mp3",
    imgSrc: "assets/img/colors.jpg",
    title: "Colors",
    artist: "Morandy"
  },
  {
    audioSrc: "assets/audio/pitbull_-_hotel-room-service.mp3",
    imgSrc: "assets/img/hotel-room-service.jpg",
    title: "Hotel Room Service",
    artist: "Pitbull"
  },
  {
    audioSrc: "assets/audio/lady-gaga_-_love-game.mp3",
    imgSrc: "assets/img/love-game.jpg",
    title: "Love Game",
    artist: "Lady Gaga"
  },
  {
    audioSrc: "assets/audio/haddaway_-_what-is-love.mp3",
    imgSrc: "assets/img/what-is-love.jpg",
    title: "What Is Love",
    artist: "Haddaway"
  },
  {
    audioSrc: "assets/audio/bad-boys-blue_-_you-are-a-woman.mp3",
    imgSrc: "assets/img/you-are-a-woman.jpg",
    title: "You're a Woman",
    artist: "Bad Boys Blue"
  },
  
];


// TWO PLAYER DISPLAY MODES

menuBtn.addEventListener('click', () => {
  container.classList.toggle('active');
});


// INITIALIZATION

function init() {
  updatePlaylist(songs);
  loadSong(currentSong);
}

init();


// PLAYLIST FUNCTIONALITY

function updatePlaylist(songs) {

  // remove any existing elements

  playlistContainer.innerHTML = "";

  // use for each song in the array

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


    // favorites
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


    // duration
    const audioForDuration = new Audio(`${audioSrc}`);
    audioForDuration.addEventListener("loadedmetadata", () => {
      const duration = audioForDuration.duration;

      let songDuration = formatTime(duration);
      tr.querySelector(".length h5").innerText = songDuration;
    })
  });
}


// FORMAT SONG TIME

function formatTime(time) {
  // format time like 2:03
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  // add traling zero if seconds less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}


// PLAYBACK FUNCTIONALITY

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


// PLAY / PAUSE FUNCTIONALITY

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



// NEXT FUNCTIONALITY

function nextSong() {
  if (shuffle) {
    // In shuffle mode, get a random song index
    currentSong = getRandomSongIndex();
  } else {
    // In normal mode, increment currentSong
    currentSong++;
    if (currentSong >= songs.length) {
      // If at the end of the playlist, go back to the first song
      currentSong = 0;
    }
  }
  
  loadSong(currentSong);

  // Play the song if it was playing
  if (playing) {
    audio.play();
  }
}


// PREV FUNCTIONALITY

function prevSong() {
  if (shuffle) {
    // In shuffle mode, get a random song index
    currentSong = getRandomSongIndex();
  } else {
    // In normal mode, decrement currentSong
    currentSong--;
    if (currentSong < 0) {
      // If at the beginning of the playlist, go to the last song
      currentSong = songs.length - 1;
    }
  }

  loadSong(currentSong);

  // Playback the song, if it was playing
  if (playing) {
    audio.play();
  }
}


nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);



// FAVORITES FUNCTIONALITY

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


// SHUFFLE FUNCTIONALITY

function shuffleSongs() {
  // if 'shuffle' is currently set to 'false', change it to 'true', or vice versa
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
}


shuffleBtn.addEventListener("click", shuffleSongs);


// Function to generate a random song index
function getRandomSongIndex() {
  return Math.floor(Math.random() * songs.length);
}


// REPEAT FUNCTIONALITY

function repeatSong() {
  if (repeat === 0) {
    // if 'repeat' is off, set it to 1, which means repeat the current song
    repeat = 1;
    repeatBtn.classList.add("active");
  }
  else if (repeat === 1) {
    // if 'repeat' is 1, which means repeat the current song, set it to 2, which means repeat playlist
    repeat = 2;
    repeatBtn.classList.add("active");
  }
  else {
    // turn off `repeat` and revise
    repeat = 0;
    repeatBtn.classList.remove("active");
  }
}


repeatBtn.addEventListener("click", repeatSong);

// if 'repeat' is turned on, on audio end
audio.addEventListener("ended", () => {
  if (repeat === 1) {
    // if repeat current song
    // again load the current song
    loadSong(currentSong);
    audio.play();
  }
  else if (repeat === 2) {
    // if repeat playlist
    // play next song
    nextSong();
    audio.play();
  }
  else {
    // if `repeat` is turned off
    // just play the entire playlist once, then stop
    if (currentSong === songs.length - 1) {
      // if it's the last song in the playlist, pause playback
      audio.pause();
      playPauseBtn.classList.replace("fa-pause", "fa-play");
      playing = false;
    } else {
      // if not last continue to next
      nextSong();
      audio.play();
    }
  }
});


// PROGRESS BAR

function progress() {

  // get duration and current time from audio
  let { duration, currentTime } = audio;

  // if anyone is not a number, set it to 0
  isNaN(duration) ? (duration = 0) : duration;
  isNaN(currentTime) ? (currentTime = 0) : currentTime;

  // update time elements

  currentTimeEl.innerHTML = formatTime(currentTime);
  durationEl.innerHTML = formatTime(duration);

  // automatic movement of the progress dot while a song is playing

  let progressPercentage = (currentTime / duration) * 100;
  progressDot.style.left = `${progressPercentage}%`;
}


// update progress on the `audio timeupdate` event

audio.addEventListener("timeupdate", progress);


// manual progress dot movement on click

function setProgress(e) {
  let width = this.clientWidth;
  let clickX = e.offsetX;
  let duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener("click", setProgress);
