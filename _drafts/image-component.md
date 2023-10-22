---
layout: post
title: An Image Component for the Block Editor
---
Whenever I create a new custom block with an image, there is a bunch of code to write just to get the minimum functionality in place. You need the `MediaPlaceholder` component to display the media upload and media library buttons before an image is selected. Then you need a couple of `Button` components: one to remove the selected image, one to trigger the `MediaUpload` component to replace the selected image.

You might also want to add the `FocalPointPicker` component if the image will be displayed cropped. 

For someone who builds a lot of custom blocks this adds up to a lot of time and a lot of code. Doing it from scratch every time also results in many different variations of the same functionality. 

So I decided to build my own custom `Image` component to handle all image related settings. A component that I can reuse to get the same experience every time, and not have to build the same functionality over and over again. 
