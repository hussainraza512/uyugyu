let currentSong = new Audio();
let playSpeed = 1.0;
let songs;
let currentSongIndex = 0;
let activeSongIndex = 0;

const secondsToMinutesSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

async function getSongs(songList) {
    return await Promise.resolve(songList);
}

const playNextSong = () => {
    activeSongIndex = (activeSongIndex + 1) % songs.length;
    currentSongIndex = songs.findIndex((song) => song === songs[activeSongIndex]);
    playMusic(songs[activeSongIndex].split("/").pop().replace(/%20/g, " "));
    markActiveSong();
};

const playPreviousSong = () => {
    activeSongIndex = (activeSongIndex - 1 + songs.length) % songs.length;
    currentSongIndex = songs.findIndex((song) => song === songs[activeSongIndex]);
    playMusic(songs[activeSongIndex].split("/").pop().replace(/%20/g, " "));
    markActiveSong();
};

const markActiveSong = () => {
    const songListItems = document.querySelectorAll(".songList li");
    songListItems.forEach((li, index) => {
        li.classList.remove("active"); // Remove the 'active' class from all items
        if (index === activeSongIndex) {
            li.classList.add("active"); // Add the 'active' class to the currently playing item
        }
    });
};

const playMusic = (track, pause = false) => {
    currentSong.src = encodeURIComponent(track);

    if (!pause) {
        currentSong.play();
        play.src = "https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/cb54aa395ad2ff4fbfd64353b250bfaedee0611d/Video%2084%20-%20Project%202%20-%20Spotify%20Clone/img/pause.svg";
    }

    document.querySelector(".song-info").innerHTML = track;
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
};

const initializePlayer = async (songList) => {
    songs = await getSongs(songList);

    if (songs && songs.length > 0) {
        playMusic(songs[0].split("/").pop().replace(/%20/g, " "), true);
        markActiveSong(); // Mark the first song as active initially
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""; // Clear existing song list

    for (const song of songs) {
        const songName = song.split("/").pop().replace(/%20/g, " ");

        let li = document.createElement("li");
        li.innerHTML = `
            <img class="invert" src="https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/cb54aa395ad2ff4fbfd64353b250bfaedee0611d/Video%2084%20-%20Project%202%20-%20Spotify%20Clone/img/music.svg" alt="">
            <div class="info">
                <div>${songName}</div>
                <div></div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/cb54aa395ad2ff4fbfd64353b250bfaedee0611d/Video%2084%20-%20Project%202%20-%20Spotify%20Clone/img/play.svg" alt="">
            </div>
        `;
        songUL.appendChild(li);
    }

    Array.from(songUL.getElementsByTagName("li")).forEach((li, index) => {
        li.addEventListener("click", () => {
            const songName = li.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName);
            activeSongIndex = index; // Update the active song index
            markActiveSong(); // Mark the clicked song as active
        });
    });
};

const main = () => {
    // ... (existing code)

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/cb54aa395ad2ff4fbfd64353b250bfaedee0611d/Video%2084%20-%20Project%202%20-%20Spotify%20Clone/img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/cb54aa395ad2ff4fbfd64353b250bfaedee0611d/Video%2084%20-%20Project%202%20-%20Spotify%20Clone/img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        const formattedCurrentTime = secondsToMinutesSeconds(currentSong.currentTime);
        const formattedDuration = secondsToMinutesSeconds(currentSong.duration);

        document.querySelector(".song-time").innerHTML = `${formattedCurrentTime} / ${formattedDuration}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        let newTime = percent * currentSong.duration;

        document.querySelector(".circle").style.left = percent * 100 + "%";

        if (!isNaN(newTime) && isFinite(newTime)) {
            currentSong.currentTime = newTime;
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    const nextButton = document.querySelector("#next");
    const previousButton = document.querySelector("#previous");

    nextButton.addEventListener("click", playNextSong);
    previousButton.addEventListener("click", playPreviousSong);

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    const speedDropdown = document.querySelector("#playSpeedDropdown");

    // Set initial speed value
    speedDropdown.value = playSpeed;

    // Event listener for changing playback speed
    speedDropdown.addEventListener("change", () => {
        playSpeed = parseFloat(speedDropdown.value);
        currentSong.playbackRate = playSpeed;
    });

    document.querySelector(".one").addEventListener("click", () => {
        const oneSongList = ["Ch 1 Beginning Concepts.ogg",
                             "Ch 2 Nature of Linguistic competence.ogg"];
        initializePlayer(oneSongList);
    });

    document.querySelector(".two").addEventListener("click", () => {
        const twoSongList = [
            "Chp 1.1 Themes of Psycholinguistics.ogg",
            "Chp 1.2 Historical Context.ogg",
            "Ch 3.1 The Information Processing System .ogg",
            "Ch 3.2 Central Issues In Language Processing.ogg",
            "Ch 3.3 Development of Processing System.ogg",
            "Ch 4.1 The Structure Of Speech .ogg",
            "Ch 4.2 Acoustic Phonetics.ogg",
            "Ch 4.3 Perception of isolated speech segments.ogg",
            "Ch 4.4 Perception of continuous speech segments .ogg"
        ];
        initializePlayer(twoSongList);
    });

    document.querySelector(".three").addEventListener("click", () => {
        const threeSongList = [
            "Ch 1 Introducing Second Language Acquisition.ogg",
            "Ch 2.1  start to before The Role of Social experience .ogg",
            "Ch 2.2 From The Role of Social experience to End of chp .ogg",
            "Ch 4.1 From start to before Theories regarding Order of Acquisition .ogg",
            "4.2 From Theories regarding Order of Acquisition to before Difference in learners.ogg",
            "4.3 From differences in learners to before Learning strategies.ogg",
            "Ch 4.4 From  Learning strategies till end of Chp.ogg"
        ];
        initializePlayer(threeSongList);
    });
};

main();  // Call the main function to initialize the player

let swiperTestimonial = new Swiper(".card-container", {
    loop: true,
    grabCursor: true,
    spaceBetween: 48,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    breakpoints: {
        1200: {
            slidesPerView: 3,
        },
    },
});

const swipeElement = document.querySelector(".swipe");

function adjustSwipeDisplay() {
    const screenWidth = window.innerWidth;
    const displayStyle = screenWidth <= 1200 ? "block" : "none";
    swipeElement.style.display = displayStyle;
}

adjustSwipeDisplay();

window.addEventListener("resize", adjustSwipeDisplay);
