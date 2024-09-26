const video = document.querySelector("video");
let recordBtncont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtncont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");

const timerBtn = document.querySelector(".btn");
const toast = document.querySelector(".toast")

let recordFlag = false;
let transparentColor = "transparent";


let recorder;
let chunks = [];

const constraints = {
    video: true,
    audio: true
}
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;

        recorder = new MediaRecorder(stream);
        recorder.addEventListener("start", (e) => {
            chunks = [];  //to empty the data 
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
        recorder.addEventListener("stop", (e) => {
            // convert media chunks in media video
            let blob = new Blob(chunks, { type: "video/mp4" });
            if (db) {
                let videoID = shortid();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoEntry = {
                    id: `vid-${videoID}`,
                    blobData: blob

                }
                videoStore.add(videoEntry);
            }

            // let videoURL = URL.createObjectURL(blob);
            // let a = document.createElement("a");
            // a.href = videoURL;
            // a.download = "stream.mp4";
            // a.click();
        })
    })
recordBtncont.addEventListener("click", (e) => {
    if (!recorder) return;
    recordFlag = !recordFlag;
    if (recordFlag) {
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else {
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }

})
captureBtncont.addEventListener("click", (e) => {
    // if(recorder);
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    //filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    if (db) {
        let imageID = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }
setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
}, 500)
    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();

})

let timerID;
let counter = 0; //represent total seconds
let timer = document.querySelector(".timer");
function startTimer() {
    timer.style.display = "block";
    function displayTimer() {
        let totalSeconds = counter;
        let hours = Number.parseInt(counter / 3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
        counter++;

    }
    timerID = setInterval(displayTimer, 1000);
}
function stopTimer() {
    timer.style.display = "none";
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}
// filtering logic
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        //  color set nhi karna hai set karna hai 
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");

        // yahn pe set kar ajayega background color.
        filterLayer.style.backgroundColor = transparentColor;

    })
})

// timerBtn.addEventListener("click" , () => {
//     const text = 2-secondtimer;
//     showToast(text);
// });


// function showToast(message) {
//     toast.textContent = message;
//     toast.style.display = "block";
//     setTimeout(() => {
//         toast.style.display = "none"
//     }, 1000)
// }
// const timer = 2000;

// setTimeout(() => {
    //     capturePhoto(video, canvas);
    // }, timer);

// },timer)
