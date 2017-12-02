---
title: Devon Smith
layout: default
---

## Homework 7
This homework assignment is about learning how to use a REST API to create an application. We will use C# 7.0, MVC 5,and JavaScript to create a web application that uses the Giphy web API to search Giphy to find animated gif images. In addition to using the API we need to do some server-side processing based on user interaction. We will also need to create some user interaction that is processed client-side.

* The assignment page can be found [here](http://www.wou.edu/~morses/classes/cs46x/assignments/HW7.html).
* The repository that contains this code can be found [here](https://bitbucket.org/devonsmith7696/cs460-project-repository)
* Live Demo Unavialable

Note for this log I decided to write the log as a series of requirements instead of a sequence of steps. This should make the journal easier to read and find the content that matches the project requirements.

### Requirement 1
*Has a single page JavaScript application; all functionality is driven by AJAX calls.* This application uses a single page for the search and all of the options selected by the user are used to create the server AJAX call or to create the layout of the page.

Here is the view code that generates the HTML for the page.
```html
@{
    ViewBag.Title = "Home";
}

<h1 class="fancy-text">Animated Image Search</h1>
<div class="row">
    <div class="col-lg-1"></div>
    <div class="col-lg-10">
        <form class="form-horizontal">
            <div class="form-group">
                <label class="col-lg-2 control-label" for="searchGiphy">Powered by <a href="https://giphy.com">Giphy</a>!</label>
                <div class="col-lg-10">
                    <input id="searchGiphy" type="text" placeholder="Search"><br />
                    <input id="searchButton" type="button" class="btn btn-primary" value="Search" />
                    <div id="nsfwPanel" class="checkbox">
                        <label>
                            <span id="nsfwContainer">
                                <input id="nsfw" type="checkbox"> NSFW
                            </span>                            
                        </label>
                    </div>
                    <div id="videoPanel" class="checkbox">
                        <label>
                            <span id="videoContainer">
                                <input id="video" type="checkbox" /> Video
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div class="col-lg-1"></div>
</div>
<div class="row">
    <div id="searchContainer" class="col-sm-12"></div>
</div>
@section PageScripts
{
    <script type="text/javascript" src="~/Scripts/JavaScript.js"></script>
}
```

The JavaScript that drives this page's content can be found in Requirement 2

Here is the Controller for this page:
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Web.Mvc;
using System.IO;
using CS460_Homework_7.Models;
using System.Diagnostics;
using System.Collections;
using CS460_Homework_7.DAL;

namespace CS460_Homework_7.Controllers
{
    public class SearchController : Controller
    {
        private ActivityLogContext database = new ActivityLogContext();

        // GET: Search JSON Object
        [HttpGet]
        public JsonResult Search(string safeSearch)
        {
            #region "Giphy Interaction"

            /*********** Things we get from the user ****************************/
            // The rating is determined by if the user is using safe search or not
            // quick bool creation because this will be used multiple times and a
            // conditional check against a bool is fast and a comparison against a
            // string is slow.
            bool nsfwSearch = (safeSearch == "nsfw");
            // set the rating of the search to get back from the Giphy API.
            string rating = (nsfwSearch) ? "r" : "g";


            /************ Things that are dynamically created ****************************************/
            // The URL for the content
            string uri = "https://api.giphy.com/v1/gifs/search?api_key="
                       + System.Web.Configuration.WebConfigurationManager.AppSettings["giphyAPIKey"]
                       // The user's query
                       + "&q=" + Request.QueryString["q"]
                       // The rating requested by the user.
                       + "&rating=" + rating
                       // Always use English.
                       + "&lang=en";

            // Create a WebRequest
            WebRequest dataRequest = WebRequest.Create(uri);
            Stream dataStream = dataRequest.GetResponse().GetResponseStream();
            // Get the gallery data

            // This example will get the data as a object graph, and while this is nice, 
            // the graph is slower to parse and not as useful. I will instead use a class
            // to deserialize the Json data to.
            //var galleryData = new System.Web.Script.Serialization.JavaScriptSerializer()
            //                      .DeserializeObject(new StreamReader(dataStream)
            //                      .ReadToEnd());

            // Deserialize to the root class from GiphyImage.cs.
            var galleryData = new System.Web.Script.Serialization.JavaScriptSerializer()
                                  .Deserialize<RootObject>(new StreamReader(dataStream)
                                  .ReadToEnd());

            // Close
            dataStream.Close();
            // Create a list of images that will be passed to the client.   
            List<GiphyImage> images = new List<GiphyImage>();

            for (int i = 0; i < 25; ++i)
            {
                // create a new GiphyImage object
                GiphyImage giphyImage = new GiphyImage();
                // the data object from the list of images inside the galleryData
                Datum data = galleryData.data[i];
                // get the preview image URL from the datum
                giphyImage.preview = data.images.downsized_medium.url;
                // get the link to the Giphy page for the image from the datum.
                giphyImage.url = data.url;
                // get video alternatives for the gifs
                // MP4 for browsers that support it.
                giphyImage.mp4 = data.images.fixed_width.mp4;
                // Webp for browsers that support that.
                giphyImage.webp = data.images.fixed_width.webp;
                // add the image data to the list.
                images.Add(giphyImage);
            }
            #endregion
            #region "Data Logging"
            /********************* Logging of user search data ****************************/
            // create the log item.
            var log = database.UserAccessLogs.Create();
            // What did the user search for?
            log.SearchString = Request.QueryString["q"];
            // The user agent string.
            log.AgentString = Request.UserAgent;
            // The time of the transaction
            log.TimeStamp = DateTime.Now;
            // The IP address of the request.
            log.IPAddress = Request.UserHostAddress;
            // Was the user looking for nsfw content?
            log.NSFW = (nsfwSearch) ? "True" : "False";
            // Add the information to the database.
            database.UserAccessLogs.Add(log);
            // save the changes to the database.
            database.SaveChanges();

            #endregion

            // Return the Json request
            return Json(images, JsonRequestBehavior.AllowGet);
        }
    }
}
```

The controller deserializes the data that comes from Giphy and only takes out the content that's needed. To do this there are two methods. You can deserialize to an object graph using the following code:

```csharp
var galleryData = new System.Web.Script.Serialization.JavaScriptSerializer()
                       .DeserializeObject(new StreamReader(dataStream)
                       .ReadToEnd());
```
This allows you to project the graph or traverse the graph to get the information you want from it. You can also create a class that contains the information from the object and deserialize to that data type. That is what I did for this project, here is the code to deserialize to an object:

```csharp
 var galleryData = new System.Web.Script.Serialization.JavaScriptSerializer()
                                  .Deserialize<RootObject>(new StreamReader(dataStream)
                                  .ReadToEnd());
```

Here is the model for the Giphy image data that is received when a search is performed:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CS460_Homework_7.Models
{
    /// <summary>
    /// GiphyImage class that's used to create the list that will be 
    /// passed on to the search client.
    /// </summary>
    public class GiphyImage
    {
        // the url for linking to the Giphy image.
        public string url { get; set; }
        // the image we're going to render on our page.
        public string preview { get; set; }
        // the video we're going to render on our page instead.
        public string mp4 { get; set; }
        public string webp { get; set; }
    }

    /// <summary>
    /// The fixed height still image from Giphy's API
    /// </summary>
    public class FixedHeightStill
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image.
        public string size { get; set; }
    }

    /// <summary>
    /// The original size still image from Giphy's API
    /// </summary>
    public class OriginalStill
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image.
        public string size { get; set; }
    }

    /// <summary>
    /// The fixed width version of the gif from Giphy's API
    /// </summary>
    public class FixedWidth
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image.
        public string size { get; set; }
        // the MP4  version of the image.
        public string mp4 { get; set; }
        // the size of the MP4 file.
        public string mp4_size { get; set; }
        // the WebP version of the file.
        public string webp { get; set; }
        // the size of the WebP file.
        public string webp_size { get; set; }
    }

    /// <summary>
    /// The fixed height small still image from Giphy's API
    /// </summary>
    public class FixedHeightSmallStill
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
    }

    /// <summary>
    /// The fixed height down-sampled image from Giphy's API
    /// </summary>
    public class FixedHeightDownsampled
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
        // the WebP version of the file.
        public string webp { get; set; }
        // the size of the WebP file.
        public string webp_size { get; set; }
    }

    /// <summary>
    /// A preview image from Giphy's API
    /// </summary>
    public class Preview
    {
        // the width of the preview image.
        public string width { get; set; }
        // the height of the preview image.
        public string height { get; set; }
        // the location of the preview file.
        public string mp4 { get; set; }
        // the size of the preview file.
        public string mp4_size { get; set; }
    }

    /// <summary>
    /// The small fixed height image from Giphy's API
    /// </summary>
    public class FixedHeightSmall
    {
        // the url of the image
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
        // the MP4 version of the file.
        public string mp4 { get; set; }
        // the size of the MP4 version of the file.
        public string mp4_size { get; set; }
        // the WebP version of the file.
        public string webp { get; set; }
        // the size of the WebP version of the file.
        public string webp_size { get; set; }
    }

    /// <summary>
    /// The down-sized still image from Giphy's API
    /// </summary>
    public class DownsizedStill
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
    }

    /// <summary>
    /// The downsized image from Giphy's API
    /// </summary>
    public class Downsized
    {
        public string url { get; set; }
        public string width { get; set; }
        public string height { get; set; }
        public string size { get; set; }
    }

    /// <summary>
    /// The large version of the down-sized image from Giphy's API
    /// </summary>
    public class DownsizedLarge
    {
        // The url of the image
        public string url { get; set; }
        // the width of the image
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
    }

    /// <summary>
    /// The fixed-width small still image from Giphy's API
    /// </summary>
    public class FixedWidthSmallStill
    {
        // the rul of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
    }

    /// <summary>
    /// The webp preview image from Giphy's API
    /// </summary>
    public class PreviewWebp
    {
        // the url of the preview WebP file.
        public string url { get; set; }
        // the width of the video
        public string width { get; set; }
        // the height of the video.
        public string height { get; set; }
        // the file size of the video.
        public string size { get; set; }
    }

    /// <summary>
    /// The fixed width still image from Giphy's API
    /// </summary>
    public class FixedWidthStill
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image.
        public string size { get; set; }
    }

    /// <summary>
    /// The fixed width small image from from Giphy's API
    /// </summary>
    public class FixedWidthSmall
    {
        // url to the page.
        public string url { get; set; }
        // width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the file.
        public string size { get; set; }
        // the MP4 version of the gif.
        public string mp4 { get; set; }
        // the size of the MP4 file.
        public string mp4_size { get; set; }
        // the WebP version of the file
        public string webp { get; set; }
        // the size of the WebP file.
        public string webp_size { get; set; }
    }

    /// <summary>
    /// The small down-sized image
    /// </summary>
    public class DownsizedSmall
    {
        // the url of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the MP4 video version of this size image.
        public string mp4 { get; set; }
        // the size of the video file
        public string mp4_size { get; set; }
    }

    /// <summary>
    /// The fixed-width downsampled image.
    /// </summary>
    public class FixedWidthDownsampled
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
        // the WebP video version of this file. 
        public string webp { get; set; }
        // the WebP video file size.
        public string webp_size { get; set; }
    }

    /// <summary>
    /// The medium down-sized image.
    /// </summary>
    public class DownsizedMedium
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
    }

    /// <summary>
    /// The original image uploaded to the Giphy service.
    /// </summary>
    public class Original
    {
        // the url to the original image.
        public string url { get; set; }
        // the size of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
        // the number of frames in the image.
        public string frames { get; set; }
        // the MP4 version of the file.
        public string mp4 { get; set; }
        // the size of the MP4 file.
        public string mp4_size { get; set; }
        // the WebP version of the file.
        public string webp { get; set; }
        // the size of the WebP file.
        public string webp_size { get; set; }
        // the original file hash.
        public string hash { get; set; }
    }

    /// <summary>
    /// The fixed-height version of the file.
    /// </summary>
    public class FixedHeight
    {
        // the url of the image.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
        // the MP4 version of this file.
        public string mp4 { get; set; }
        // the size of the MP4 file.
        public string mp4_size { get; set; }
        // the WebP version of the file.
        public string webp { get; set; }
        // the size of the WebP file.
        public string webp_size { get; set; }
    }

    /// <summary>
    /// The looping video image.
    /// </summary>
    public class Looping
    {
        // the MP4 version of the file to be looped.
        public string mp4 { get; set; }
        // the size of the MP4 file.
        public string mp4_size { get; set; }
    }

    // the original MP4 video file.
    public class OriginalMp4
    {
        // the width of the MP4 file.
        public string width { get; set; }
        // the height of the MP4 file.
        public string height { get; set; }
        // the MP4 file.
        public string mp4 { get; set; }
        // the size of the MP4 file.
        public string mp4_size { get; set; }
    }

    /// <summary>
    /// The preview gif
    /// </summary>
    public class PreviewGif
    {
        // the url to the preview gif.
        public string url { get; set; }
        // the width of the preview gif.
        public string width { get; set; }
        // the height of the preview gif.
        public string height { get; set; }
        // the size of the preview gif file.
        public string size { get; set; }
    }

    /// <summary>
    /// Low resolution still from invalid file type.
    /// </summary>
    public class __invalid_type__480wStill
    {
        // the url to the file.
        public string url { get; set; }
        // the width of the image.
        public string width { get; set; }
        // the height of the image.
        public string height { get; set; }
        // the size of the image file.
        public string size { get; set; }
    }

    /// <summary>
    /// The HD image of the gif as a video
    /// </summary>
    public class Hd
    {
        // the width of the video.
        public string width { get; set; }
        // the height of the video.
        public string height { get; set; }
        // the MP4 file location.
        public string mp4 { get; set; }
        // the MP4 file size.
        public string mp4_size { get; set; }
    }

    /// <summary>
    /// A collection of all the images that are delivered using Giphy's API
    /// This includes the images that are defined above.
    /// </summary>
    public class Images
    {
        public FixedHeightStill fixed_height_still { get; set; }
        public OriginalStill original_still { get; set; }
        public FixedWidth fixed_width { get; set; }
        public FixedHeightSmallStill fixed_height_small_still { get; set; }
        public FixedHeightDownsampled fixed_height_downsampled { get; set; }
        public Preview preview { get; set; }
        public FixedHeightSmall fixed_height_small { get; set; }
        public DownsizedStill downsized_still { get; set; }
        public Downsized downsized { get; set; }
        public DownsizedLarge downsized_large { get; set; }
        public FixedWidthSmallStill fixed_width_small_still { get; set; }
        public PreviewWebp preview_webp { get; set; }
        public FixedWidthStill fixed_width_still { get; set; }
        public FixedWidthSmall fixed_width_small { get; set; }
        public DownsizedSmall downsized_small { get; set; }
        public FixedWidthDownsampled fixed_width_downsampled { get; set; }
        public DownsizedMedium downsized_medium { get; set; }
        public Original original { get; set; }
        public FixedHeight fixed_height { get; set; }
        public Looping looping { get; set; }
        public OriginalMp4 original_mp4 { get; set; }
        public PreviewGif preview_gif { get; set; }
        public __invalid_type__480wStill __invalid_name__480w_still { get; set; }
        public Hd hd { get; set; }
    }

    /// <summary>
    /// User information for the image. If the image was submitted by a user, their information
    /// will be collected here.
    /// </summary>
    public class User
    {
        // the user's avatar location
        public string avatar_url { get; set; }
        // the user's channel banner
        public string banner_url { get; set; }
        // the url to the user's profile page.
        public string profile_url { get; set; }
        // the username of the user.
        public string username { get; set; }
        // the display name of the user.
        public string display_name { get; set; }
        // the link to the twitter account of the user.
        public string twitter { get; set; }
        // the indicator if the account has been verified.
        public bool is_verified { get; set; }
    }

    /// <summary>
    /// This is the datum that is returned from Giphy's API it contains the information
    /// from the search.
    /// </summary>
    public class Datum
    {
        public string type { get; set; }
        public string id { get; set; }
        public string slug { get; set; }
        public string url { get; set; }
        public string bitly_gif_url { get; set; }
        public string bitly_url { get; set; }
        public string embed_url { get; set; }
        public string username { get; set; }
        public string source { get; set; }
        public string rating { get; set; }
        public string content_url { get; set; }
        public string source_tld { get; set; }
        public string source_post_url { get; set; }
        public int is_indexable { get; set; }
        public string import_datetime { get; set; }
        public string trending_datetime { get; set; }
        public Images images { get; set; }
        public string title { get; set; }
        public User user { get; set; }
    }

    /// <summary>
    /// Pagination data from Giphy's API
    /// </summary>
    public class Pagination
    {
        // the total numer of images in this query.
        public int total_count { get; set; }
        // the number of items that you retrieved.
        public int count { get; set; }
        // the offset or starting image for this page.
        public int offset { get; set; }
    }

    /// <summary>
    /// File metadata from Giphy's API
    /// </summary>
    public class Meta
    {
        // the status of the response (200 should be good)
        public int status { get; set; }
        // the message attached (OK)
        public string msg { get; set; }
        // The unique identifier of the response.
        public string response_id { get; set; }
    }

    /// <summary>
    /// The root object of the JSON file.
    /// </summary>
    public class RootObject
    {
        // I list of all the data in the API response.
        public List<Datum> data { get; set; }
        // The pagination data in the API response.
        public Pagination pagination { get; set; }
        // The meta data from the response.
        public Meta meta { get; set; }
    }
}
```

### Requirement 2
*JavaScript is n a separate file in the Scripts folder and is included via ```@section```. The JavaScript file uses JQuery.*

Home/Index.cshtml
```html
@section PageScripts
{
    <script type="text/javascript" src="~/Scripts/JavaScript.js"></script>
}
```

_Layout.cshtml which contains the reference to PageScripts section.
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@ViewBag.Title - CS460 Homework 7</title>
    <link href="~/Content/Site.css" rel="stylesheet" type="text/css" />
    <link href="~/Content/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <script src="~/Scripts/modernizr-2.6.2.js"></script>
</head>
<body>
    <div class="container body-content">
        @RenderBody()
        <hr />
        <footer>
            <p>&copy; @DateTime.Now.Year | Devon Smith | Western Oregon University</p>
        </footer>
    </div>

    <script src="~/Scripts/jquery-3.2.1.min.js"></script>
    <script src="~/Scripts/bootstrap.min.js"></script>
    @RenderSection("PageScripts", required: false)
</body>
</html>

```

Here is the JavaScript.js file that does all the processing for the user requests and performs the AJAX operations.

```js
// Action for the search button being clicked.
$("#searchButton").click(function () {
    var urlString = ($("#nsfw").prop("checked") == true) ? "/Search/nsfw?q=" : "/Search?q=";
    if ($("#labelStickers").hasClass("label-success")) {
        urlString += "&s=stickers";
    }
    $.ajax(
        {
            type: "GET",
            dataType: "json",
            url: urlString + $("#searchGiphy").val(),
            success: function (data) { displayData(data); },
            error: function () { ajaxError(); }
        }
    );
});


// Actions for the NSFW check box to make your selection more obvious.
$("#nsfw").click(function () {
    if ($("#nsfw").prop("checked") == true) {
        $("#nsfwPanel").addClass("nsfw");
    }
    else {
        $("#nsfwPanel").removeClass("nsfw");
    }
});

// Actions for the NSFW check box to make your selection more obvious.
$("#video").click(function () {
    if ($("#video").prop("checked") == true) {
        $("#videoPanel").addClass("video");
    }
    else {
        $("#videoPanel").removeClass("video");
    }
});

// Display the data returned from the search.
function displayData(data) {
    $("#searchContainer").empty();
    if ($("#video").prop("checked") == true) {
        $.each(data, function (i, image) {
            $("#searchContainer").append(
                "<div class='img-box col-lg-4'>"
                + "<video loop autoplay>"
                + "<source src='"
                + image["mp4"]
                + "' type='video/mp4'>"
                + "<source src='"
                + image["webp"]
                + "' type='video/webp'>"
                + "</video>"
                + "</div>"
            );
        });
    }
    else {
        $.each(data, function (i, image) {
            $("#searchContainer").append(
                "<div class='img-box col-lg-4'><a href='"
                + image["url"]
                + "' target='_new'><img class='img-responsive' src='"
                + image["preview"]
                + "' /></a>"
                + "</div>"
            );
        });
    }
}

// if there is an error, return it.
function ajaxError() {
    alert("Warning: Unable to perform search. Please try again later.");
}
```

### Requirement 3
*Uses at least one custom routing rule in ```RouteConﬁg.cs``` that makes sense and routes to a new controller that isn’t Home* The custom route created for this allows the application to search using ```/Search?q=kitty``` or ```/Search/nsfw?q=kitty``` depending on if they want to get back NSFW content or would prefer a safe search.

```csharp
// Additional Route for Giphy Search
routes.MapRoute(
    name: "Search",
    url: "Search/{safeSearch}",
    defaults: new { controller = "Search", action = "Search", safeSearch = UrlParameter.Optional }
);
```

### Requirement 4
*Has custom CSS in Contents;  page looks nice* This page contains a number of custom CSS classes for the various page elements.

```css
#searchGiphy{
    width: 50vw;
    max-width: none;
}

#searchButton{
    position: relative;
    margin-top: 5px;
    left: 44vw;
}

#nsfwPanel {
    position: relative;
    top: -30px;
    padding: .2em .6em .3em;
    border-radius: .25em;
    width: 75px;
}

#videoPanel {
    position: relative;
    top: -60px;
    left: 80px;
    padding: .2em .6em .3em;
    border-radius: .25em;
    width: 75px;
}

.img-box{
    float: left;
    width: 250px;
    padding: 5px;
}

.nsfw {
    background-color: #e51c23;
    color: #fff;
}

.video {
    background-color: #2196f3;
    color: #fff;
}

.fancy-text {
    font-family: 'Lobster', cursive;
    color: #862197;
}

img{ 
    border-radius: 1rem;
}

video {
    border-radius: 1rem;
}
```


### Requirement 5
*Has a database for Logging; successfully logs every request; uses a script to create this database* This page has a database that is used to log user information.

Here is the script used to create the database table:
```sql
CREATE TABLE UserAccessLogs(
ID int IDENTITY(0,1) PRIMARY KEY,
SearchString NVARCHAR(255) NOT NULL,
AgentString NVARCHAR(1024) NOT NULL,
TimeStamp DATETIME NOT NULL,
IPAddress NVARCHAR(64) NOT NULL,
NSFW NVARCHAR(5) NOT NULL
);

-- create some sample data
INSERT INTO  UserAccessLogs(SearchString, AgentString, TimeStamp, IPAddress, NSFW)
VALUES ( 'Test Search', 
		 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
		 '2017-12-01 00:00:00',
		 '0.0.0.0', 
		 'False');

```

Here is the code from the search controller that logs the requests:
```csharp
 /********************* Logging of user search data ****************************/
            // create the log item.
            var log = database.UserAccessLogs.Create();
            // What did the user search for?
            log.SearchString = Request.QueryString["q"];
            // The user agent string.
            log.AgentString = Request.UserAgent;
            // The time of the transaction
            log.TimeStamp = DateTime.Now;
            // The IP address of the request.
            log.IPAddress = Request.UserHostAddress;
            // Was the user looking for nsfw content?
            log.NSFW = (nsfwSearch) ? "True" : "False";
            // Add the information to the database.
            database.UserAccessLogs.Add(log);
            // save the changes to the database.
            database.SaveChanges();
```

Here is the model for log:
```csharp
namespace CS460_Homework_7.DAL
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class UserAccessLog
    {
        public int ID { get; set; }

        [Required]
        [StringLength(255)]
        public string SearchString { get; set; }

        [Required]
        [StringLength(1024)]
        public string AgentString { get; set; }

        public DateTime TimeStamp { get; set; }

        [Required]
        [StringLength(64)]
        public string IPAddress { get; set; }

        [Required]
        [StringLength(5)]
        public string NSFW { get; set; }
    }
}

```

For fun I created a page that allows you to view the stored requests in the log.
![image of log](img/log.png)

### Requirement 6
*The page works, searches Giphy and shows results in a grid; is responsive*

This page creates a grid of images or videos based on the user query.
![preview of grid](img/grid.png)

### Requirement 7
*Uses JSON for AJAX calls; JSON object is used client-side to modify the DOM and build the search results*

Uses JavaScript to make an AJAX call to the server
```js
$("#searchButton").click(function () {
    var urlString = ($("#nsfw").prop("checked") == true) ? "/Search/nsfw?q=" : "/Search?q=";
    if ($("#labelStickers").hasClass("label-success")) {
        urlString += "&s=stickers";
    }
    $.ajax(
        {
            type: "GET",
            dataType: "json",
            url: urlString + $("#searchGiphy").val(),
            success: function (data) { displayData(data); },
            error: function () { ajaxError(); }
        }
    );
});
```


Gets the content back from the server as JSON and create the grid from it.

Here is a sample of the JSON response:
```js
[{"url":"https://giphy.com/gifs/kawaii-flowers-cat-6RuhlzSdhIAqk","preview":"https://media0.giphy.com/media/6RuhlzSdhIAqk/giphy.gif","mp4":"https://media0.giphy.com/media/6RuhlzSdhIAqk/200w.mp4","webp":"https://media0.giphy.com/media/6RuhlzSdhIAqk/200w.webp"},{"url":"https://giphy.com/gifs/cat-kitten-kitty-VxbvpfaTTo3le","preview":"https://media3.giphy.com/media/VxbvpfaTTo3le/giphy.gif","mp4":"https://media3.giphy.com/media/VxbvpfaTTo3le/200w.mp4","webp":"https://media3.giphy.com/media/VxbvpfaTTo3le/200w.webp"},{"url":"https://giphy.com/gifs/trippy-kitty-acid-cXaeWuJ1oKO4g","preview":"https://media1.giphy.com/media/cXaeWuJ1oKO4g/giphy.gif","mp4":"https://media1.giphy.com/media/cXaeWuJ1oKO4g/200w.mp4","webp":"https://media1.giphy.com/media/cXaeWuJ1oKO4g/200w.webp"},{"url":"https://giphy.com/gifs/hallmarkecards-cats-kitty-l0HlGRDhPTqVEvhCw","preview":"https://media2.giphy.com/media/l0HlGRDhPTqVEvhCw/giphy.gif","mp4":"https://media2.giphy.com/media/l0HlGRDhPTqVEvhCw/200w.mp4","webp":"https://media2.giphy.com/media/l0HlGRDhPTqVEvhCw/200w.webp"}, ... ]
```

From that JSON data creates the grid of the images for the user to view.
```js
$.each(data, function (i, image) {
    $("#searchContainer").append(
        "<div class='img-box col-lg-4'><a href='"
        + image["url"]
        + "' target='_new'><img class='img-responsive' src='"
        + image["preview"]
        + "' /></a>"
        + "</div>"
    );
});
```

### Requirement 8
*Has additional client side options/functionality, beyond simple search by topic.* There are a number of client-size user interface operations that happen using JavaScript. When a user checks a checkbox for either NSFW or Video the check box will highlight and let them know at a quick glance that they have the element checked. Additionally, if they check the video checkbox the JavaScript will create a grid using videos instead of gifs. In many situations video files can be smaller than actual gif images and this can save data on devices over metered connections.

Here the JS will deliver the video grid:
```js
// Display the data returned from the search.
function displayData(data) {
    $("#searchContainer").empty();
    if ($("#video").prop("checked") == true) {
        $.each(data, function (i, image) {
            $("#searchContainer").append(
                "<div class='img-box col-lg-4'>"
                + "<video loop autoplay>"
                + "<source src='"
                + image["mp4"]
                + "' type='video/mp4'>"
                + "<source src='"
                + image["webp"]
                + "' type='video/webp'>"
                + "</video>"
                + "</div>"
            );
        });
    }
```
Otherwise, the application will render a grid using gif images
```js
    else {
        $.each(data, function (i, image) {
            $("#searchContainer").append(
                "<div class='img-box col-lg-4'><a href='"
                + image["url"]
                + "' target='_new'><img class='img-responsive' src='"
                + image["preview"]
                + "' /></a>"
                + "</div>"
            );
        });
    }
}
```

### Requirement 9
*Has additional server side processing (beyond topic search).* This application allows the use to choose if they want to view "Not Safe For Work" or "NSFW" content. When the user checks a checkbox the will return a list of gifs that will also contain violent or sexually explicit content. This is performed using a custom route and the server will process the information and deliver a JSON object to the client.

This selection is handled in the search controller:
```csharp
 bool nsfwSearch = (safeSearch == "nsfw");
// set the rating of the search to get back from the Giphy API.
string rating = (nsfwSearch) ? "r" : "g";


/************ Things that are dynamically created ****************************************/
// The URL for the content
string uri = "https://api.giphy.com/v1/gifs/search?api_key="
            + System.Web.Configuration.WebConfigurationManager.AppSettings["giphyAPIKey"]
            // The user's query
            + "&q=" + Request.QueryString["q"]
            // The rating requested by the user.
            + "&rating=" + rating
            // Always use English.
            + "&lang=en";
```


### Video Demonstration

<iframe width="560" height="315" src="https://www.youtube.com/embed/5jp6wzQLVgI?rel=0&amp;showinfo=0&amp;playlist=5jp6wzQLVgI&amp;loop=1&autoplay=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>