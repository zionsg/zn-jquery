znCrop jQuery plugin
--------------------

Resize and crop <img> children to fill their parent containers.

```
<style>
  .thumbnail {
    border: 3px solid green;
    height: 80px;
    overflow: hidden; /* though znCrop will add this later, this will prevent images from overflowing when loading */
    width: 80px;
  }

  .float {
    float: left;
    margin-right: 20px;
  }
</style>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
<script src="zn-jquery-zncrop.min.js"></script>

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
  <div class="thumbnail crop">
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
  <div class="thumbnail crop">
    <img src="portrait.jpg" />
  </div>
</div>

<script>
  // znCrop needs to be called after all the required images have completed loading
  // in order to compare the natural width and height, hence in window.load()
  var exampleScript = function () {
      $(window).load(function () {
          $('.crop').znCrop();
      });
  }();
</script>
```

_BECOMES_

![Screenshot of result](https://raw.github.com/zionsg/zn-jquery/master/znCrop/README_screenshot.jpg)
