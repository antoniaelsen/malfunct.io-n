var imageLoaded = false;

document.getElementById("save-button").disabled = !imageLoaded;
document.getElementById("clear-button").disabled = !imageLoaded;

document.getElementById("load-button").addEventListener("click", handleImageLoad);
document.getElementById("clear-button").addEventListener("click", handleImageClear);

function handleImageLoad() {
    imageLoaded = true;
    toggleImageButtons(!imageLoaded);
}

function handleImageClear() {
    imageLoaded = false;
    toggleImageButtons(!imageLoaded);
}


function toggleImageButtons(state){
  document.getElementById("save-button").disabled = state;
  document.getElementById("clear-button").disabled = state;
}
