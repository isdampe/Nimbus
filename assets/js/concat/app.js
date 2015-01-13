var hasClass = function (elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

var addClass = function (elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

var removeClass = function (elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

function isEven(n) {
  return n === parseFloat(n)? !(n%2) : void 0;
}
;/*
 * Vswipe.js
 * A super simple and quick swipe detection library for vanillaJS.
 *
 * License: MIT
*/
(function(window){

  this.config = {
    sensitivity: 130
  }

  this.attach = function(elementId,funcOnComplete) {

    var element = document.getElementById(elementId);
    var config = {
      x: 0
    };

    //Hook ontouch, mousedown etc.
    element.onmousedown = function(e) {
      window.swipe.start(element,config,e);
    }
    element.ontouchstart = function(e) {
      window.swipe.start(element,config,e);
    }
    element.onmouseup = function(e) {
      window.swipe.end(element,config,e,funcOnComplete);
    }
    element.ontouchend = function(e) {
      window.swipe.end(element,config,e,funcOnComplete);
    }
    element.ontouchcancel = function(e) {
      window.swipe.end(element,config,e,funcOnComplete);
    }
  }

  this.start = function(element,config,e) {

    if (typeof e.clientX !== "undefined") {
      config.x = e.clientX;
    } else {
      config.x = e.targetTouches[0].pageX;
    }

  }

  this.end = function(element,config,e,funcOnComplete) {

    var newX =  0;

    if (typeof e.clientX !== "undefined") {
      newX = e.clientX;
    } else {
      newX = e.changedTouches[0].pageX;
    }


    var diff_x = config.x - newX;

    var point_left = window.swipe.config.sensitivity;
    var point_right = window.swipe.config.sensitivity * -1;

    var swipeDir = 0;

    if (diff_x >= point_left) {
      //Swipe left.
      swipeDir = 1;
    }
    if (diff_x <= point_right) {
      //Swipe right.
      swipeDir = 2;
    }

    if (swipeDir !== 0) {
      funcOnComplete(swipeDir);
    }

  }

  window.swipe = this;

})(window);
;(function(window){

  var elements = {
    viewport: document.getElementById("viewport"),
    reader: document.getElementById("reader"),
    title: document.getElementById("title"),
    brightness: document.getElementById("brightness-toggle"),
    brightnessOverlay: document.getElementById("brightness-overlay"),
    brightnessBall: document.getElementById("slider-ball"),
    brightnessContent: document.getElementById("brightness-content"),
    beautifyLevel: document.getElementById("beautify-level"),
    dragDropOverlay: document.getElementById("drag-drop-overlay"),
    fileSelect: document.getElementById("file-select")
  };
  var config = {
    width: Math.max(elements.viewport.clientWidth, elements.viewport.innerWidth || 0),
    pageBreakpoint: 1300,
    activePages: 2,
    comicActive: 0,
    ballActive: 0,
    enhance: 0,
    lastEnhance: 0
  };
  var supportedFormats = [
    {
      type: "cbr",
      archive: "rar"
    }
  ];
  var comic = {
    title: "Futurama 01",
    pageCount: 8,
    currentPage: 1,
    pages: [
      'assets/media/example-comic/1.jpg',
      'assets/media/example-comic/2.jpg',
      'assets/media/example-comic/3.jpg',
      'assets/media/example-comic/4.jpg',
      'assets/media/example-comic/5.jpg',
      'assets/media/example-comic/6.jpg',
      'assets/media/example-comic/7.jpg',
      'assets/media/example-comic/8.jpg'
    ]
  }

  if ( config.width < config.pageBreakpoint ) {
    config.activePages = 1;
  }

  this.loadComic = function(){

    //Fetch comic data.
    removeClass(document.body, "splash");
    removeClass(elements.reader, "hidden");
    addClass(elements.fileSelect, "hidden");

    //Activate comic.
    config.comicActive = 1;
    comic.currentPage = 1;

    window.nimbus.loadPage(comic.currentPage);

  };

  this.loadPage = function(currentPage) {

    var pageone, pagetwo;

    //Clear internal image buffers.
    elements.reader.innerHTML = "";

    if ( config.activePages < 2 ) {
      //Create single image.
      pageone = new Image;
      pageone.src = comic.pages[comic.currentPage -1];
      pageone.style.opacity = 0;

      //Inject into reader.
      elements.reader.appendChild(pageone);

      //Change title meta.
      elements.title.innerHTML = comic.title + " | " + comic.currentPage + "/" + comic.pageCount;

      //Remove loading class.
      window.setTimeout(function(){
        nimbus.animateIn(function(){
          removeClass(elements.reader, "loading");
        });
      }, 200);

    } else {

      //Create two images.
      pageone = new Image;
      pageone.src = comic.pages[comic.currentPage -1];
      pageone.style.opacity = 0;

      if ( comic.currentPage < comic.pageCount ) {
        pagetwo = new Image;
        pagetwo.src = comic.pages[comic.currentPage];
        pagetwo.style.opacity = 0;
      }

      //Inject into reader.
      elements.reader.appendChild(pageone);
      elements.reader.appendChild(pagetwo);

      //Change title meta.
      elements.title.innerHTML = comic.title + " | " + (comic.currentPage + 1) + "/" + comic.pageCount;

      //Remove loading class.
      window.setTimeout(function(){
        nimbus.animateIn(function(){
          removeClass(elements.reader, "loading");
        });
      }, 200);

    }

  };

  this.animateIn = function(callBack) {

    var i = 0, max, images;

    images = document.querySelectorAll("#reader img");
    max = images.length;

    for (i;i<max;i++) {
      images[i].style.opacity = 1;
    }

    window.setTimeout(function(){
      callBack();
    }, 200);

  };

  this.animateOut = function(callBack) {

    var i = 0, max, images;

    images = document.querySelectorAll("#reader img");
    max = images.length;

    for (i;i<max;i++) {
      images[i].style.opacity = 0;
    }

    window.setTimeout(function(){
      addClass(elements.reader, "loading");
      callBack();
    }, 200);

  };

  this.navigate = function(direction) {

    switch (direction) {
      case 1:

        //Forwards.
        if ( comic.currentPage < comic.pageCount ) {
          //Go forwards.

          if ( config.activePages > 1 ) {
            if ( comic.currentPage < comic.pageCount -1 ) {
              comic.currentPage += 2;
            } else {
              return;
            }
          } else {
            comic.currentPage++;
          }

          nimbus.animateOut(function(){
            nimbus.loadPage();
          });

        } else {
          return;
        }

        break;

      case 2:

        //Backwards.
        if ( comic.currentPage > 1 ) {
          //Go backwards.

          if ( config.activePages > 1 ) {
            if ( comic.currentPage > 2 ) {
              comic.currentPage -= 2;
            } else {
              return;
            }
          } else {
            comic.currentPage--;
          }

          nimbus.animateOut(function(){
            nimbus.loadPage();
          });

        } else {
          return;
        }

        break;
    }

  };

  this.checkSize = function(){

    config.width = Math.max(elements.viewport.clientWidth, elements.viewport.innerWidth || 0);

    if ( config.comicActive === 1 ) {
      if ( config.width > config.pageBreakpoint ) {
        config.activePages = 2;

        if ( comic.currentPage > 1 ) {

          if ( isEven(comic.currentPage) ) {
            comic.currentPage -= 1;
          }
        }

      } else {
        config.activePages = 1;

      }

      nimbus.loadPage();
    }

  };

  this.brightnessOn = function() {

    addClass(elements.brightnessOverlay, "active");
    window.setTimeout(function(){
      elements.brightnessOverlay.style.opacity = 1;
    },50);

  };

  this.brightnessOff = function() {

    config.ballActive = 0;
    elements.brightnessOverlay.style.opacity = 0;

    //Add necessary class.
    elements.reader.className = "reader amplify-" + config.enhance;

    window.setTimeout(function(){
      removeClass(elements.brightnessOverlay, "active");
    },200);

  };

  this.ballMove = function(e) {

    var x, contentOffset, contentWidth, contentRight, perc;

    if ( config.ballActive ) {

      x = e.x;
      contentOffset = elements.brightnessContent.offsetLeft;
      contentWidth = elements.brightnessContent.offsetWidth;
      contentRight = contentOffset + contentWidth;

      if ( x < contentRight && x > contentOffset ) {
        x = x - contentOffset;
        elements.brightnessBall.style.left = x + "px";
      }

      perc = Math.round( ( x / contentWidth ) * 10 );
      if ( perc > 10 ) {
        perc = 10;
      } else if ( perc < 0 ) {
        perc = 0;
      }

      config.enhance = perc;

      //Get percentage.
      if ( config.enhance !== config.lastEnhance ) {
        elements.beautifyLevel.innerHTML = "x" + config.enhance;
        config.lastEnhance = config.enhance;
      }

    }

  };

  this.loadFileDialogue = function(){
    alert("Rquers file");
  };

  this.handleFile = function(file) {

    var ext;

    ext = nimbus.checkFormat(file.name);

    //Check if format is okay.
    if ( ext === false ) {
      alert("Invalid file format.");
      return;
    }

    nimbus.extractArchive(file, ext);

  };

  this.extractArchive = function(file, ext) {

    var archiveHandle, archiveFileList = [];

    switch(ext) {
      case "cbr":

        //Deflate archive.

        break;
    }

  };

  this.checkFormat = function(filename) {

    var re, ext, result, i, max;

    re = /(?:\.([^.]+))?$/;
    ext = re.exec(filename)[1].toLowerCase();
    result = false;
    max = supportedFormats.length;

    for ( i=0; i<max; i++ ) {
      if ( ext === supportedFormats[i].type ) {
        result = true;
        break;
      }
    }

    if ( result === true ) {
      return ext;
    } else {
      return false;
    }

  };

  //Hooks.
  window.onresize = function(){
    nimbus.checkSize();
  };

  //Onswipe.
  swipe.attach("viewport", function(direction){

    if ( config.comicActive === 0 ) {
      return;
    }

    nimbus.navigate(direction);

  });

  //Onkeydown.
  window.onkeydown = function(e) {

    var direction;

    if (typeof e.which === "undefined") {
      return;
    }

    switch (e.which) {
      case 39:
        direction = 1;
        break;
      case 37:
        direction = 2;
        break;
    }

    nimbus.navigate(direction);

  };

  //Menu hooks.
  elements.brightness.onclick = function(e){
    e.preventDefault();
    nimbus.brightnessOn();
  };
  elements.brightnessBall.onmousedown = function(e){
    e.preventDefault();
    e.stopPropagation();
    config.ballActive = 1;
    addClass(elements.brightnessBall,"inactive");
  };
  elements.brightnessBall.ontouchstart = function(e){
    e.preventDefault();
    e.stopPropagation();
    config.ballActive = 1;
    addClass(elements.brightnessBall,"inactive");
  };
  elements.brightnessContent.onmouseup = function(e){
    e.preventDefault();
    config.ballActive = 0;
    removeClass(elements.brightnessBall,"inactive");
    nimbus.brightnessOff();
  };
  elements.brightnessContent.ontouchend = function(e){
    e.preventDefault();
    config.ballActive = 0;
    removeClass(elements.brightnessBall,"inactive");
    nimbus.brightnessOff();
  };
  elements.brightnessContent.onclick = function(e){
    e.preventDefault();
    e.stopPropagation();
  };
  elements.brightnessContent.onmousemove = function(e){
    e.stopPropagation();
    nimbus.ballMove(e);
  };
  elements.brightnessContent.ontouchmove = function(e){
    e.stopPropagation();
    e.x = e.targetTouches[0].pageX;
    nimbus.ballMove(e);
  };

  elements.brightnessOverlay.onclick = function(e){
    e.preventDefault();
    nimbus.brightnessOff();
  };

  //Alow drag drop.
  document.body.addEventListener("dragover", function(e){
    addClass(elements.dragDropOverlay, "active");
    window.setTimeout(function(){
      removeClass(elements.dragDropOverlay, "active");
    }, 5000);
  });
  document.body.addEventListener("dragend", function(e){
    removeClass(elements.dragDropOverlay, "active");
  });
  document.body.addEventListener("drop", function(e){

    var fileList;

    removeClass(elements.dragDropOverlay, "active");

    if ( typeof e.dataTransfer.files === "undefined" ) {
      return;
    }

    fileList = e.dataTransfer.files;

    if ( fileList.length > 1 ) {
      return;
    }

    nimbus.handleFile(fileList[0]);

  });

  window.nimbus = this;

  window.onload = function(){
    //nimbus.loadComic();
    nimbus.checkSize();
  };

})(window);
