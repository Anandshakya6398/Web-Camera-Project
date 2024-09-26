// console.log("Hello from gallery")
setTimeout(() => {
    if (db) {
        //image retrieve
        //image retrieve
        let dbTransaction = db.transaction("video", "readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
             <div class="media">
                <video autoplay loop src="${url}"></video>
            </div>
            <div class="delete action">Delete</div>
            <div class="download action">Download</div>
        </div> `;
                galleryCont.appendChild(mediaElem);

                //listener

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);

                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener);


            })
        }

        // image works

        let dbsTransaction = db.transaction("image", "readonly");
        let imageStore = dbsTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
        <div class="media">
        <img src="${url}"/>
        </div>
        <div class="delete action">Delete</div>
        <div class="download action">Download</div>
        </div> `;
                galleryCont.appendChild(mediaElem);

                //listener

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteListener);

                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadListener)

            })
        }

    }
}, 100)

function deleteListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if (type === "img") {
        let dbsTransaction = db.transaction("image", "readwrite");
        let imageStore = dbsTransaction.objectStore("image");
        imageStore.delete(id);
    }

    e.target.parentElement.remove();

}
function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let dbTransaction = db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");

        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if (type === "img") {
        let dbsTransaction = db.transaction("image", "readwrite");
        let imageStore = dbsTransaction.objectStore("image");

        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

        let a = document.createElement("a");
        a.href = imageResult.url;
        a.download = "image.jpg";
        a.click();
    }
    }
}