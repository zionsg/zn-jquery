znResize jQuery plugin
----------------------

##### version 1.1.0, 2013-06-26

Resize image to fit parent container.

```
<style>
  .thumbnail {
    border: 3px solid green;
    height: 80px;
    margin: auto;
    overflow: hidden; /* though znResize will add this later, this will prevent images from overflowing when loading */
    width: 80px;
  }

  .float {
    border: 1px dotted gray;
    float: left;
    margin-right: 50px;
    padding: 10px;
    text-align: center;
  }

</style>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
<script src="zn-jquery-znresize.min.js"></script>

<div class="float">
  Original<br />
  <img src="landscape.jpg" />
  <br />

  Crop<br />
  <div class="thumbnail">
    <img class="crop" src="landscape.jpg" />
  </div>
  <br />

  Fit<br />
  <div class="thumbnail">
    <img class="fit" src="landscape.jpg" />
  </div>
</div>

<div class="float">
  Original<br />
  <img src="portrait.jpg" />
  <br />

  Crop<br />
  <div class="thumbnail">
    <img class="crop" src="portrait.jpg" />
  </div>
  <br />

  Fit<br />
  <div class="thumbnail">
    <img class="fit" src="portrait.jpg" />
  </div>
</div>

<script>
  // znResize needs to be called after all the required images have completed loading
  // in order to compare the natural width and height, hence placed in window.load()
  var exampleScript = function () {
      $(window).load(function () {
          $('.crop').znResize();
          $('.fit').znResize({
              strategy: 'fit',
              center: true,
              middle: true
          });
      });
  }();
</script>
```

_BECOMES_

![Screenshot of result](https://raw.github.com/zionsg/zn-jquery/master/znResize/README_screenshot.jpg)
