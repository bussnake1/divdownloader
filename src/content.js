import downloadImgs from './download';

// currently selected element, element which has the pointer on
var extensionEnabled = false;

function getEnabled(){
  chrome.storage.local.get(['divDownloaderEnabled'], function(result) {
    // console.log('Value currently is ' + result.divDownloaderEnabled);
    extensionEnabled = result.divDownloaderEnabled;
    if(!extensionEnabled){
      clear();
      hideButton();
    }
  });
}
getEnabled();
setInterval(getEnabled, 1000);

var selected = null;
var lastSelectedClass = 'last-selected-by-div-downloader';
var excludeFromHighlightClass = 'exclude-from-highlight-by-div-download';
var downloadButtonId = 'div-downloader-download-button';

var downloadIcon = '<svg class="svg-inline--fa fa-download fa-w-16 fa-lg exclude-from-highlight-by-div-download" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="download" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>'

var interval = 100;
var bgColor = null;
var highlightColor = '#498cff';
var downloadButton = null;

// make sure to copy to css as well
var downloadButtonOffsetY = 40;
var downloadButtonOffsetX = 0;

// setInterval( ()=> {console.log(extensionEnabled) }, 1000 );

function main(){
  // setInterval(() => {
  //   var element = 
  // }, interval);
  
  // inserting fontawesome
  // document.head.innerHTML += '<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/js/all.min.js"></script>';
  addDownloadButton();
  window.onmousemove = logCoords;
}

function logCoords(e){
  if(extensionEnabled){
    var elem = document.elementFromPoint(e.clientX, e.clientY);
    if(elem){
      select(elem);
    }
  }
}

function select(elem){
  // exclude our custom download button from all highhlight logic && previously selected element
  if(( !elem.classList || !elem.classList.contains(excludeFromHighlightClass) )&& 
    ( !elem.parentNode || !elem.parentNode.classList || !elem.parentNode.classList.contains(excludeFromHighlightClass) )&& // fontawesomeicon is svg which has a child <path> element which doesn't have the exclude class
   !elem.classList.contains(lastSelectedClass)){
    // clear previous element
    clear(selected);
  
    // highlight new hover element
    highlight(elem);
    showButton(elem);
  
    // save elem
    selected = elem;
    elem.classList.add(lastSelectedClass);
  }
}

function highlight(elem){
  // save elems color
  if(elem){
    bgColor = elem.style['background-color'];
    // change to highlight color
    elem.style['background-color'] = highlightColor;
  }
}

function clear(elem){
  // change to highlight color
  if(elem){
    elem.style['background-color'] = bgColor;
    // remove class from prev selected
    elem.classList.remove(lastSelectedClass);
  }
}

function showButton(elem){
  positionButton(elem);
  downloadButton.style.visibility = 'visible';
}

function hideButton(){
  downloadButton.style.visibility = 'hidden';
}

function positionButton(elem){
  var pos = elem.getBoundingClientRect();
  if(pos){
    // make sure button is always in viewport
    var left = pos.left + window.pageXOffset - downloadButtonOffsetX;
    var top = pos.top + window.pageYOffset - downloadButtonOffsetY;

    top = top >= 0 ? top : 0;
    left = left >= 0 ? left : 0;

    // position button
    downloadButton.style.top = (top).toString() + 'px';
    downloadButton.style.left = (left).toString() + 'px';
  }
  
}

function addDownloadButton(){
  downloadButton = document.createElement("a");
  downloadButton.id = downloadButtonId;
  // downloadButton.innerHTML = `<i class="fa fa-download fa-lg ${excludeFromHighlightClass}" aria-hidden="true"></i>`;
  downloadButton.innerHTML = downloadIcon;
  document.body.appendChild(downloadButton);
  downloadButton.classList.add(excludeFromHighlightClass);
  downloadButton.onclick = downloadImages;
}

function downloadImages(e){
  var elements = [];

  // to check target element as well (if its an image already)
  elements.push(selected);

  elements = allDescendants(selected, elements);
  var images = elements.filter( child => (child.tagName && child.tagName.toLowerCase() === 'img') || (child.nodeName && child.nodeName.toLowerCase() === 'img'));
  // console.log(images)
  downloadImgs(images);
}


function allDescendants (node, resultArray) {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    allDescendants(child, resultArray);
    resultArray.push(child);
  }
  return resultArray;
}

function enableExtension(){
  console.log('enabled')
  extensionEnabled = true;
}

function disableExtension(){
  console.log('disabled')
  extensionEnabled = false;
  hideButton();
  clear(selected);
}

window.onload = main;


chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    // console.log('message received')
    if (request.status === "enabled"){
      enableExtension();
      sendResponse({status: "enabled"});
    }
    else if (request.status === "disabled")
    disableExtension();
      sendResponse({status: "disabled"});
});

