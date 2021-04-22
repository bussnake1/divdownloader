import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import {saveAs} from 'file-saver'; 

var Promise = window.Promise;
if (!Promise) {
    Promise = JSZip.external.Promise;
}

var zip = new JSZip();

/**
 * Fetch the content and return the associated promise.
 * @param {String} url the url of the content to fetch.
 * @return {Promise} the promise containing the data.
 */
function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function addToZip(filename, url){
  zip.file(filename, urlToPromise(url), {binary:true});
}

function download(){
  zip.generateAsync({type:"blob"})
  .then(function callback(blob) {
    // see FileSaver.js
    saveAs(blob, "images.zip");

    // clearing zip
    zip = new JSZip();
  }, function (e) {
    console.log(e);
  });
}

export default function downloadImgs(imgElements){
  if(imgElements.length){
    imgElements.forEach(img => {
      var name = img.src.split('/');
      name = name[name.length - 1];

      // TODO: remove this shit, and determine extension properly
      var ext = name.match(/\.(png|jpg)/g);
      var temp = name.split('.');
      if(ext) {
        console.log(ext[0])
        name.replace(ext[0], '');
        name += ext[0];
      }
      else name += '.jpg';
      
      addToZip(name, img.src);
    });
    console.log('Downloading...')
    // all added to zip then download
    download();
  }
  else{
    console.log('No images found to download in this element.')
  }
}