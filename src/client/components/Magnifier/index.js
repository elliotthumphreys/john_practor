const Magnifier = (img, zoom) => {
  var glass, w, h, bw;

  /*create magnifier glass:*/
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");
  /*insert magnifier glass:*/
  img.parentElement.insertBefore(glass, img);
  /*set background properties for the magnifier glass:*/
  glass.style.backgroundImage = "url('" + img.src.replace(/1000/, '1920') + "')";
  glass.style.backgroundRepeat = "no-repeat";
  bw = 2;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;
  /*execute a function when someone moves the magnifier glass over the image:*/
  window.addEventListener("mousemove", addOrRemoveEvents)
  window.addEventListener("touchmove", addOrRemoveEvents)

  glass.style.display = "none"

  function addOrRemoveEvents(e){
    let { x, y } = getCursorPosWithinImage(e);
    if (x < 0 || y < 0 || x > img.width || y > img.height) {
      glass.style.display = "none"
      glass.removeEventListener("mousemove", moveMagnifier);
      img.removeEventListener("mousemove", moveMagnifier);
      /*and also for touch screens:*/
      glass.removeEventListener("touchmove", moveMagnifier);
      img.removeEventListener("touchmove", moveMagnifier);
    } else {
      glass.style.display = "block"

      glass.addEventListener("mousemove", moveMagnifier);
      img.addEventListener("mousemove", moveMagnifier);
      /*and also for touch screens:*/
      glass.addEventListener("touchmove", moveMagnifier);
      img.addEventListener("touchmove", moveMagnifier);
    }
  }

  function moveMagnifier(e) {
    e.preventDefault();
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";

    let { x, y } = getCursorPosWithinImage(e)
    let { x: pX, y: pY } = getCursorPosWithinParent(e)

    let xDiff = (img.parentElement.offsetWidth - img.width) / 2
    let yDiff = (img.parentElement.offsetHeight - img.height) / 2

    if (x > img.width - (w / zoom)) {
      x = img.width - (w / zoom)
      pX = img.parentElement.offsetWidth - xDiff - (w / zoom)
    }
    if (x < (w / zoom)) {
      x = (w / zoom)
      pX = xDiff + (w / zoom)
    }

    if (y > img.height - (h / zoom)) {
      y = img.height - (h / zoom)
      pY = img.parentElement.offsetHeight - yDiff - (h / zoom)
    }
    if (y < (h / zoom)) {
      y = (h / zoom)
      pY = yDiff + (h / zoom)
    }

    glass.style.left = (pX - w) + "px"
    glass.style.top = (pY - h) + "px"

    glass.style.backgroundPosition = `-${(x * zoom) - w + bw}px -${(y * zoom) - h + bw}px`
  }

  function getCursorPosWithinParent(e) {
    var a, b, x = 0, y = 0;

    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.parentElement.getBoundingClientRect()

    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left
    y = e.pageY - a.top

    /*consider any page scrolling:*/
    x = x - window.pageXOffset
    y = y - window.pageYOffset

    return { x: x, y: y };
  }

  function getCursorPosWithinImage(e) {
    var a, b, x = 0, y = 0;

    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = img.getBoundingClientRect()

    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left
    y = e.pageY - a.top

    /*consider any page scrolling:*/
    x = x - window.pageXOffset
    y = y - window.pageYOffset

    return { x: x, y: y };
  }
}

export default Magnifier