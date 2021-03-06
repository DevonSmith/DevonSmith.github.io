---
title: Devon Smith
layout: default
---

## Homework 6
This homework assignment is about learning to work with a relational database using C# and the Entity Framework. We will use git to upload our content to the our project repository. We will create a simple store website using the AdventureWorks2014 database.

* The assignment page can be found [here](http://www.wou.edu/~morses/classes/cs46x/assignments/HW6.html).
* The repository that contains this code can be found [here](https://bitbucket.org/devonsmith/cs460-project-repository)
* Live Demo Unavialable

### Step 1:
Downloading and extracting the full backup of the Adventure Works 2014 Database.
Adventure Works is an example database from Microsoft the represents business database for a fictional company **Adventure Works Cycles** which is a company that manufactures metal and composite bicycles.

```sql
RESTORE FILELISTONLY  
FROM DISK = 
'C:\Users\Devon Smith\Desktop\AdventureWorks2014.bak'
GO 

RESTORE DATABASE AdventureWorks2014
FROM DISK = 
	'C:\Users\Devon Smith\Desktop\AdventureWorks2014.bak'
WITH MOVE 'AdventureWorks2014_Data' 
    TO 'C:\Users\Devon Smith\Documents\Visual Studio 2017\Projects\CS460 Homework 6\CS460 Homework 6\App_Data\AdventureWorks2014.mdf',
MOVE 'AdventureWorks2014_Log' 
    TO 'C:\Users\Devon Smith\Documents\Visual Studio 2017\Projects\CS460 Homework 6\CS460 Homework 6\App_Data\AdventureWorks2014.ldf'
GO
```
### Step 2:
I followed the instruction located [here](https://msdn.microsoft.com/en-us/library/jj200620(v=vs.113).aspx) and used the model shown there to create the model. I knew going into this that I was going to need to work with the product review from the project description so I knew I would need to make some changes to the model that was automatically generated. I edited the files to meet the project requirements.

```csharp
namespace CS460_Homework_6.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Production.ProductReview")]
    public partial class ProductReview
    {
        [Required]
        [Display(Name = "Review ID")]
        public int ProductReviewID { get; set; }

        [Required]
        [Display(Name = "Product ID")]
        public int ProductID { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string ReviewerName { get; set; }

        public DateTime ReviewDate { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Email Address")]
        public string EmailAddress { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        [Display(Name = "Rating (1-5)")]
        public int Rating { get; set; }

        [StringLength(3850)]
        [Display(Name ="Comments")]
        public string Comments { get; set; }

        public DateTime ModifiedDate { get; set; }

        public virtual Product Product { get; set; }
    }
}
```
The rest of the models that were autogenerated 

### Step 3:

Allowing users to browse products. The first this I did was inspect the database and figure out what kind of products are going to be in the database and creted the menu system for the website in a _Navigation.cshtml which contained a partial view that would be inserted into views to provide navigation.

```html
<div class="navbar navbar-inverse ">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class='@(ViewContext.RouteData.Values["Action"].ToString() == "Index" ? "active" : "")'>
                    @Html.ActionLink("Home", "Index", "Home", new { area = "" })
                </li>
                <li class="dropdown @(ViewContext.RouteData.Values["Action"].ToString() == "Bicycles" ? "active" : "")">
                    <a class="dropdown-toggle" role="button" aria-expanded="false" href="#" data-toggle="dropdown">Bicycles<span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li>@Html.ActionLink("All Bicycles", "Bicycles", "Home", new { id = "All" }, null)</li>
                        <li>@Html.ActionLink("Mountain", "Bicycles", "Home", new { id = "Mountain" }, null)</li>
                        <li>@Html.ActionLink("Road", "Bicycles", "Home", new { id = "Road" }, null)</li>
                        <li>@Html.ActionLink("Touring", "Bicycles", "Home", new { id = "Touring" }, null)</li>
                        <li></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">Accessories<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li>@Html.ActionLink("All", "Accessories", "Home", new { id = "All" }, null)</li>
                        <li>@Html.ActionLink("Bike Racks", "Accessories", "Home", new { id = "Bike Racks" }, null)</li>
                        <li>@Html.ActionLink("Bike Stands", "Accessories", "Home", new { id = "Bike Stands" }, null)</li>
                        <li>@Html.ActionLink("Bottles and Cages", "Accessories", "Home", new { id = "Bottles and Cages" }, null)</li>
                        <li>@Html.ActionLink("Cleaners", "Accessories", "Home", new { id = "Cleaners" }, null)</li>
                        <li>@Html.ActionLink("Fenders", "Accessories", "Home", new { id = "Fenders" }, null)</li>
                        <li>@Html.ActionLink("Helmets", "Accessories", "Home", new { id = "Helmets" }, null)</li>
                        <li>@Html.ActionLink("Hydration Packs", "Accessories", "Home", new { id = "Hydration Packs" }, null)</li>
                        <li>@Html.ActionLink("Lights", "Accessories", "Home", new { id = "Lights" }, null)</li>
                        <li>@Html.ActionLink("Locks", "Accessories", "Home", new { id = "Locks" }, null)</li>
                        <li>@Html.ActionLink("Panniers", "Accessories", "Home", new { id = "Panniers" }, null)</li>
                        <li>@Html.ActionLink("Pumps", "Accessories", "Home", new { id = "Pumps" }, null)</li>
                        <li>@Html.ActionLink("Tires and Tubes", "Accessories", "Home", new { id = "Tires and Tubes" }, null)</li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">Clothing<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li>@Html.ActionLink("All", "Clothing", "Home", new { id = "All" }, null)</li>
                        <li>@Html.ActionLink("Bib-Shorts", "Clothing", "Home", new { id = "Bib-Shorts" }, null)</li>
                        <li>@Html.ActionLink("Caps", "Clothing", "Home", new { id = "Caps" }, null)</li>
                        <li>@Html.ActionLink("Gloves", "Clothing", "Home", new { id = "Gloves" }, null)</li>
                        <li>@Html.ActionLink("Jerseys", "Clothing", "Home", new { id = "Jerseys" }, null)</li>
                        <li>@Html.ActionLink("Shorts", "Clothing", "Home", new { id = "Shorts" }, null)</li>
                        <li>@Html.ActionLink("Socks", "Clothing", "Home", new { id = "Socks" }, null)</li>
                        <li>@Html.ActionLink("Tights", "Clothing", "Home", new { id = "Tights" }, null)</li>
                        <li>@Html.ActionLink("Vests", "Clothing", "Home", new { id = "Vests" }, null)</li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">Components<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li>@Html.ActionLink("All", "Components", "Home", new { id = "All" }, null)</li>
                        <li>@Html.ActionLink("Handlebars", "Components", "Home", new { id = "Handlebars" }, null)</li>
                        <li>@Html.ActionLink("Bottom Brackets", "Components", "Home", new { id = "Bottom Brackets" }, null)</li>
                        <li>@Html.ActionLink("Brakes", "Components", "Home", new { id = "Brakes" }, null)</li>
                        <li>@Html.ActionLink("Chains", "Components", "Home", new { id = "Chains" }, null)</li>
                        <li>@Html.ActionLink("Cranksets", "Components", "Home", new { id = "Cranksets" }, null)</li>
                        <li>@Html.ActionLink("Deraillers", "Components", "Home", new { id = "Derailleurs" }, null)</li>
                        <li>@Html.ActionLink("Forks", "Components", "Home", new { id = "Forks" }, null)</li>
                        <li>@Html.ActionLink("Headsets", "Components", "Home", new { id = "Headsets" }, null)</li>
                        <li>@Html.ActionLink("Mountain Frames", "Components", "Home", new { id = "Mountain Frames" }, null)</li>
                        <li>@Html.ActionLink("Road Frames", "Components", "Home", new { id = "Road Frames" }, null)</li>
                        <li>@Html.ActionLink("Touring Frames", "Components", "Home", new { id = "Touring Frames" }, null)</li>
                        <li>@Html.ActionLink("Pedals", "Components", "Home", new { id = "Pedals" }, null)</li>
                        <li>@Html.ActionLink("Saddles", "Components", "Home", new { id = "Saddles" }, null)</li>
                        <li>@Html.ActionLink("Wheels", "Components", "Home", new { id = "Wheels" }, null)</li>
                    </ul>
                </li>
                
            </ul>
        </div>
    </div>
</div>
```

Once I had the code created for the menu i created the views most of them were the same minus some simple changes. Here is the code for the Components Section

```html
@using System.Text.RegularExpressions;
@model IEnumerable<CS460_Homework_6.Models.Product>
@{

    ViewBag.Title = "Components";
}

<h2>Components</h2>
<div class="row">
    <div class="col-sm-1"></div>
    <div class="col-sm-10">
        <h4>@ViewBag.Category</h4>
        @foreach (var product in Model)
        {
            if ((product.DiscontinuedDate == null) ? true : (product.DiscontinuedDate >= DateTime.Today))
            {
                <div class="product well well-sm">
                    @{
                        byte[] image = product.ProductProductPhotoes.FirstOrDefault().ProductPhoto.LargePhoto;
                        ViewBag.Image = "data:image/png;base64," + Convert.ToBase64String(image, 0, image.Length);
                        ViewBag.ComponentName = new Regex(@"\-").Replace(product.Name, " ");

                    }
                    <strong>@ViewBag.ComponentName</strong>
                    <p class="text-center"><img class="img-responsive" src="@ViewBag.Image" alt="@Html.DisplayFor(item => product.Name) " /></p>
                    <p>
                        <strong>Color:</strong> @((product.Color == null)? "None" : product.Color)
                        <br /><strong>Size:</strong> @((product.Size == null)? "Universal": product.Size)
                    </p>
                    <p><strong>Price:</strong> $@Html.DisplayFor(item => product.ListPrice)</p>
                    <p class="text-right">@Html.ActionLink("Details", "Product", new { id = product.ProductID })</p>
                </div>
           }
        }
     </div>
    <div class="col-sm-1"></div>
</div>

```

The product view page will view any product by its id. Here is the code for that page. 

```html
@using System.Text.RegularExpressions
@model IEnumerable<CS460_Homework_6.Models.Product>
@{

    var product = Model.First();
    // Get the name of the bicyle without extraneous formatting
    string[] name = new Regex(@"\s+").Split(product.Name);
    // Get the image for the bicycle
    byte[] image = product.ProductProductPhotoes.FirstOrDefault().ProductPhoto.LargePhoto;
    //Place the product name in the title
    ViewBag.Image = "data:image/png;base64," + Convert.ToBase64String(image, 0, image.Length);
    ViewBag.Title = new Regex(@"\-").Replace(name[0], " ");

}


<h2>@ViewBag.Title</h2>
<div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-8">
        <div class="row">
            @if (TempData["Success"] != null)
            {
                <!-- Present the user with confirmation that they completed their form correctly -->
                <div class="alert alert-success">
                    <strong>Success:</strong> @TempData["Success"].ToString()
                </div>
            }
            @{
                <p class="text-center"><img class="img-responsive" src="@ViewBag.Image" alt="@Model.First().Name) " /></p>
                <h3>Product Details</h3>
                <p>
                    <strong>Color:</strong> @((product.Color == null) ? "None" : product.Color)
                    <br /><strong>Size:</strong> @((product.Size == null) ? "Single Size/Universal" : product.Size)
                </p>
                <h5>Price: $@Html.DisplayFor(p => product.ListPrice)</h5>
            }
        </div>
        <div class="row">
            <h4>Product Reviews</h4>
            <hr />
            @{ 
                if (Model.First().ProductReviews.Count > 0)
                {
                    foreach (var review in Model.First().ProductReviews)
                    {
                        <p class="text-capitalize"><strong>@review.ReviewerName</strong><br />
                            <small>@Html.DisplayFor(r => review.ReviewDate)</small></p>
                        <p>Rating: 
                            @for (int i = 0; i < review.Rating; ++i) { <span class="glyphicon glyphicon-star"></span>}
                            @for (int i=0; i < 5 - review.Rating; ++i) { <span class="glyphicon glyphicon-star-empty"></span>}
                        </p>
                        <p><strong>Comments:</strong><br />@Html.DisplayFor(r => review.Comments)</p>
                        <hr />
                    }
                    <p>Want to review this product? Click @Html.ActionLink("here", "ReviewProduct", "Home", new { id = product.ProductID }, null) to add a review.</p>
                }
                else
                {
                    <p>Oh no! There are no reviews for this product.<br/> Be the first person to add a review for this product by clicking @Html.ActionLink("here", "ReviewProduct", "Home", new { id = product.ProductID }, null)</p>
                }
            }
        </div>
    </div>
    <div class="col-sm-2"></div>
</div>
```


### Step 4:
I added review functionality using the ProductReview model and a razor form helper.

Code in the HomeController view controller:
```csharp
// GET: ReviewProduct
[HttpGet]
public ActionResult ReviewProduct(int id)
{
    var product = database.Products.Where(p => p.ProductID == id).FirstOrDefault();
    byte[] image = product.ProductProductPhotoes.FirstOrDefault().ProductPhoto.LargePhoto;
    ViewBag.Image = "data:image/png;base64," + Convert.ToBase64String(image, 0, image.Length);
    ViewBag.Product = product.Name;
    ProductReview review = new ProductReview();
    review.ProductID = product.ProductID;
    return View(review);
}

// POST: ReviewProduct
[HttpPost]
[ValidateAntiForgeryToken]
public ActionResult ReviewProduct([Bind(Include = "ProductReviewID, ProductID, ReviewerName, ReviewDate, EmailAddress, Rating, Comments, CommentsModifiedDate, Product")] ProductReview review, int id)
{
    var product = database.Products.Where(p => p.ProductID == id).FirstOrDefault();
    byte[] image = product.ProductProductPhotoes.FirstOrDefault().ProductPhoto.LargePhoto;
    ViewBag.Image = "data:image/png;base64," + Convert.ToBase64String(image, 0, image.Length);
    ViewBag.Product = product.Name;
    review.ProductID = id;
    review.ReviewDate = DateTime.Now;
    review.ModifiedDate = review.ReviewDate;

    if (ModelState.IsValid)
    {
        database.ProductReviews.Add(review);
        database.SaveChanges();
        TempData["Success"] = "Your review has been submitted!";
        return Redirect("/Home/Product/" + id.ToString());
    }
    return View(review);
}
```

Razorform Helper in View:
```html
@model CS460_Homework_6.Models.ProductReview
@{
    ViewBag.Title = "Review Product";
}

<h2>@ViewBag.Title</h2>
<div class="row">
    <div class="col-sm-2"></div>
    <div class="col-sm-8">
        <div class="row">
            <h4>Post New Review for @ViewBag.Product</h4>
            <p class="text-center"><img class="img-responsive" src="@ViewBag.Image" alt="@ViewBag.Product" /></p>
            <div class="well well-lg">
                @using (Html.BeginForm())
                {
                    @Html.AntiForgeryToken()
                    <div class="form-horizontal">
                        <div class="form-group">
                            @Html.LabelFor(model => model.ReviewerName)<br />
                            @Html.EditorFor(model => model.ReviewerName)<br />
                            @Html.ValidationMessageFor(model => model.ReviewerName, "", new { @class = "text-danger" })
                        </div>
                        <div class="form-group">
                            @Html.LabelFor(model => model.Rating)<br />
                            @Html.EditorFor(model => model.Rating)<br />
                            @Html.ValidationMessageFor(model => model.Rating, "", new { @class = "text-danger" })
                        </div>
                        <div class="form-group">
                            @Html.LabelFor(model => model.EmailAddress)<br />
                            @Html.EditorFor(model => model.EmailAddress)<br />
                            @Html.ValidationMessageFor(model => model.EmailAddress, "", new { @class = "text-danger" })
                        </div>
                        <div class="form-group">
                            @Html.LabelFor(model => model.Comments)<br />
                            @Html.EditorFor(model => model.Comments)<br />
                            @Html.ValidationMessageFor(model => model.Comments, "", new { @class = "text-danger" })
                        </div>
                        <div class="form-group">
                            <input class="btn btn-primary" type="submit" value="Submit" formmethod="post" />
                            <input class="btn btn-default" type="reset" value="Reset">
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
    <div class="col-sm-2"></div>
</div>
```

### Video Demonstration

<iframe width="560" height="315" src="https://www.youtube.com/embed/oatXOHLPI7E?rel=0&amp;showinfo=0&amp;playlist=oatXOHLPI7E&amp;loop=1&autoplay=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>