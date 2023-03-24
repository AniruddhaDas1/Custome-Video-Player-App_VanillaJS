const container = document.querySelector(".container"),
  mainVideo = container.querySelector("video"),
  progressBar = container.querySelector(".progress-bar"),
  videoTimeline = container.querySelector(".video-timeline"),
  currentVidTime = container.querySelector(".current-time"),
  videoDuration = container.querySelector(".video-duration"),
  volumeBtn = container.querySelector(".volume i"),
  volumeSlider = container.querySelector(".left input"),
  skipBackward = container.querySelector(".skip-backward i"),
  skipForward = container.querySelector(".skip-forward i"),
  playPauseBtn = container.querySelector(".play-pause i"),
  speedBtn = container.querySelector(".playback-speed span"),
  picInPicBtn = container.querySelector(".pic-in-pic span"),
  fullscreenBtn = container.querySelector(".fullscreen i"),
  speedOptions = container.querySelector(".speed-options");
let timer;

const hideControls = () => {
  if (mainVideo.paused) return; // if video is paused return
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 3000);
};
hideControls();

container.addEventListener("mousemove", () => {
  container.classList.add("show-controls"); // add show-controls class on mouse move
  clearTimeout(timer); //clear Timer
  hideControls(); //calling hideControls
});

const formatTime = (time) => {
  // getting sconds, minutes & hours
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);
  // adding 0 at the begining if the particular value is less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = minutes < 10 ? `0${hours}` : hours;

  //if hours is 0 return minutes & seconds only elsereturn all
  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target; //getting current time & duration
  let percent = (currentTime / duration) * 100; // getting percentage
  progressBar.style.width = `${percent}%`; //Passing percentage in progressbar width
  currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration); //passing video duration as videoDuration innerText
});

videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = videoTimeline.clientWidth; //Getting video timeline width
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; //updating video timeline // offsertX gives mouse X position
});

const draggableProgressBar = (e) => {
  let timelineWidth = videoTimeline.clientWidth; //getting videoTimeline width
  progressBar.style.width = `${e.offsetX}px`; //passing offsetX value as progressbar width
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; //updating video currentTime
  currentVidTime.innerText = formatTime(mainVideo.currentTime); //passing video current time as currentVidTime innertext
};

videoTimeline.addEventListener("mousedown", () => {
  // calling draggableProgress function on mousemove event
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

container.addEventListener("mouseup", () => {
  // removing mousemove listner on mouseup event
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX; //getting mouse positions
  progressTime.style.left = `${offsetX}px`; //passing offsetX value as progreeTime left value
  let timelineWidth = videoTimeline.clientWidth; //getting videotimeline width
  let percent = (e.offsetX / timelineWidth) * mainVideo.duration; //geting percent
  progressTime.innerText = formatTime(percent); //passing percent as progressTime innerText
});

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    // if volume icon isn't volume high icon
    mainVideo.volume = 0.5; // passing 0.5 value as video volume
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0.0; //passing 0.0 value as video volume, so the video mute
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }
  volumeSlider.value = mainVideo.volume; // update slider value according to the video volume
});

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value; //passing slider value as video volume
  if (e.target.value == 0) {
    // if slider value is 0, change icon to mute
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show"); //toggle show class
});

speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    // adding click event on all speed options
    mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
    speedOptions.querySelector(".active").classList.remove("active"); //removing active class
    option.classList.add("active"); //adding active class on selected option
  });
});

document.addEventListener("click", (e) => {
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-rounded"
  )
    speedOptions.classList.remove("show");
});

picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture(); //changing video mode to picture in picture
});

fullscreenBtn.addEventListener("click", () => {
  container.classList.toggle("fullscreen"); //toggle fullscreen class
  if (document.fullscreenElement) {
    // if video is already in fullscreen  mode
    fullscreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen(); //exit from fullscreen mode and return
  }
  fullscreenBtn.classList.replace("fa-expand", "fa-compress");
  container.requestFullscreen(); //go to fullscreen mode
});

skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5; //Sunstract 5 sec from current video time
});
skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5; //Sunstract 5 sec from current video time
});

//If video is paused, play the video
playPauseBtn.addEventListener("click", () => {
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

// if video is play, icon changed to pause
mainVideo.addEventListener("play", () =>
  playPauseBtn.classList.replace("fa-play", "fa-pause")
);
// if video is pause, icon changed to play
mainVideo.addEventListener("pause", () =>
  playPauseBtn.classList.replace("fa-pause", "fa-play")
);
