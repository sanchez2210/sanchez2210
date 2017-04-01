Instructions for using the slideshow:

* The slideshow uses two folders: slides, and songs. This folder can be hosted on the service of your preference, it's currently using Amazon S3.  
On the top part of the index.html you will find the configuration part of the slideshow. These are:

 * songs: set this to the amount of files you want to load from the "songs" folder, starting from 1. The files MUST be present.

    * Example: If songs folder contains 1.mp3 , 2.mp3 , 3.mp4 , 4.mp3 , 6.mp3  
    "songs: 4" will load 1.mp3, 2.mp3, 3.mp3 and 4.mp3  
    "songs: 5" will fail to load 5.mp3 and will not work  

 * slides: the amount of files to load from the "slides" folder. similar to the songs parameter. JPG takes precedence over MP4.

    * Example: If "slides" folder contains 1.jpg, 2.jpg, 3.mp4, 4.jpg  
    "slides:3" will load 1.jpg, 2.jpg, 3.mp4  
    "slides:4" will load 1.jpg, 2.jpg, 3.mp4, 4.jpg  

    * Example: If "slides" folder contains 1.jpg, 1.mp4, 2.jpg  
    "slides:2" will load 1.jpg, 2.jpg It will ignore 1.mp4  

 * shuffleSongs: true or false to shuffle the background music.

 * shuffleSlides: true or false to shuffle slides.

 * idle: this sets the amount in milliseconds for each slide to stay on display. Not including transition.

 * source: If you are storing your slides on "http://great.hosting.com/1234/slides", then set source to "http://great.hosting.com/1234/". If using s3 make sure to select your files and click more->make public.

It's IMPORTANT to not have duplicate files, and have them in the correct order/format. Meaning no .jpeg, or .png files.



So basic flow of using the slider:

1. Copy the index.html file. And place it on the hosting of your selection. All the javascript is inside this file so it's the only file you need.
2. Upload/arrange the files from songs folder and slides folder.
3. Ensure correct format and that no duplicates (NO 3.jpg AND 3.mp4) are present.
4. Once the desired order of the slideshow is set. Update the contents of the config part at the top of index.html to reflect you changes on the folders.
5. Set shuffleSlides to false to preserve the order in "slides" folder.
6. Set shuffleSongs to false to preserve the order in "songs" folder.
7. Set the source to your current service.
8. Save and refresh.