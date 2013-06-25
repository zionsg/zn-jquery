znResize jQuery plugin
----------------------

##### version 1.0.0, 2013-06-25

Resize image to fit parent container.

```
<style>
  .thumbnail {
    border: 3px solid green;
    height: 80px;
    overflow: hidden; /* though znResize will add this later, this will prevent images from overflowing when loading */
    width: 80px;
  }

  .float {
    float: left;
    margin-right: 20px;
  }
</style>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
<script src="zn-jquery-znResize.min.js"></script>

<div class="float">
  Original:<br />
  <img src="landscape.jpg" />
  <br />

  Scaled:<br />
  <div class="thumbnail">
    <img src="landscape.jpg" width="100%" />
  </div>
  <br />

  Cropped:<br />
  <div class="thumbnail resize">
    <img src="landscape.jpg" />
  </div>
</div>

<div class="float">
  Original:<br />
  <img src="portrait.jpg" />
  <br />

  Scaled:<br />
  <div class="thumbnail">
    <img src="portrait.jpg" height="100%" />
  </div>
  <br />

  Cropped:<br />
  <div class="thumbnail resize">
    <img src="portrait.jpg" />
  </div>
</div>

<script>
  // znResize needs to be called after all the required images have completed loading
  // in order to compare the natural width and height, hence placed in window.load()
  var exampleScript = function () {
      $(window).load(function () {
          $('.resize').znResize();
      });
  }();
</script>
```

_BECOMES_

![Screenshot of result](https://raw.github.com/zionsg/zn-jquery/master/znResize/README_screenshot.jpg)
