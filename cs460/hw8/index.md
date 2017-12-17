---
title: Devon Smith
layout: default
---

## Homework 8
This homework assignment is about learning how to create a web application that uses a relational database we created and AJAX. We will use C# 7.0, MVC 5,and JavaScript to create a web application that uses AJAX to show some information to the user. We need to provide dynamically generated buttons for each Genre in that when clicked will get a JsonResult from our web application which will contain all the artwork in the database that is in that genre.

* The assignment page can be found [here](http://www.wou.edu/~morses/classes/cs46x/assignments/HW8.html).
* The repository that contains this code can be found [here](https://bitbucket.org/devonsmith7696/cs460-project-repository)
* ~~Live Demo on Microsoft Azure~~ *No longer available*

Note for this log I decided to write the log as a series of requirements instead of a sequence of steps. This should make the journal easier to read and find the content that matches the project requirements.

### Requirement 1
*Has script(s) to create, populate and delete the database.* As is the normal pattern for creating projects for this class I created a database up script and a database down script.

The contents of the up script:
```sql
CREATE TABLE Artist(
	ID INT IDENTITY(0,1) PRIMARY KEY,
	ArtistName NVARCHAR(255),
	BirthDate DATETIME2,
	BirthCity NVARCHAR(255)
);


CREATE TABLE Artwork(
	ID INT IDENTITY(0,1) PRIMARY KEY,
	Title NVARCHAR(255),
	ArtistID INT FOREIGN KEY REFERENCES Artist

);

CREATE TABLE Genre(
	ID INT IDENTITY(0,1) PRIMARY KEY,
	GenreName NVARCHAR(255) UNIQUE
);

CREATE TABLE Classification(
	ID INT IDENTITY(0,1) NOT NULL,
	ArtworkID INT FOREIGN KEY REFERENCES Artwork,
	GenreID INT FOREIGN KEY REFERENCES Genre,
	--PRIMARY KEY (ArtworkID, GenreID)
	CONSTRAINT [pk_dbo.Classifications] PRIMARY KEY CLUSTERED (ID ASC)
);



-- Artist
--0
INSERT INTO Artist(ArtistName, BirthDate, BirthCity) VALUES('M.C. Escher', '1898-6-17', 'Leeuwarden, Netherlands');
--1
INSERT INTO Artist(ArtistName, BirthDate, BirthCity) VALUES('Leonardo Da Vinci','1519-5-2','Vinci, Italy');
--2
INSERT INTO Artist(ArtistName, BirthDate, BirthCity) VALUES('Hatip Mehmed Efendi', '1680-11-18', 'Unknown');
--3
INSERT INTO Artist(ArtistName, BirthDate, BirthCity) VALUES('Salvador Dali', '1904-5-11', 'Figueres, Spain');

-- Artwork
--0
INSERT INTO Artwork (Title, ArtistID) VALUES('Circle Limit III', 0);
--1
INSERT INTO Artwork (Title, ArtistID) VALUES('Twon Tree', 0);
--2
INSERT INTO Artwork (Title, ArtistID) VALUES('Mona Lisa', 1);
--3
INSERT INTO Artwork (Title, ArtistID) VALUES('The Vitruvian Man', 1);
--4
INSERT INTO Artwork (Title, ArtistID) VALUES('Ebru', 2);
--5
INSERT INTO Artwork (Title, ArtistID) VALUES('Honey Is Sweeter Than Blood', 3);

-- Genre

--0
INSERT INTO Genre(GenreName) VALUES('Tesselation'); 
--1
INSERT INTO Genre(GenreName) VALUES('Surrealism');
--2
INSERT INTO Genre(GenreName) VALUES('Portrait');
--3
INSERT INTO Genre(GenreName) VALUES('Renaissance');


-- Classification
--0
INSERT INTO Classification (ArtworkID, GenreID) VALUES (0, 0);
--1
INSERT INTO Classification (ArtworkID, GenreID) VALUES (1, 0);
--2
INSERT INTO Classification (ArtworkID, GenreID) VALUES (1, 1);
--3
INSERT INTO Classification (ArtworkID, GenreID) VALUES (2, 2);
--4
INSERT INTO Classification (ArtworkID, GenreID) VALUES (2, 3);
--5
INSERT INTO Classification (ArtworkID, GenreID) VALUES (3, 3);
--6
INSERT INTO Classification (ArtworkID, GenreID) VALUES (4, 0);
--7
INSERT INTO Classification (ArtworkID, GenreID) VALUES (5, 1);
```
After testing the up script I added some additional lines that check the database and make sure queries perform as expected.

```sql
-- Testing Queries
SELECT * FROM Artist;
SELECT Title, ArtistName FROM Artwork JOIN Artist ON Artwork.ArtistID=Artist.ID;
SELECT * FROM Genre;
SELECT Title, GenreName 
	   FROM (Classification JOIN Artwork ON Classification.ArtworkID=Artwork.ID)
	   JOIN Genre ON Classification.GenreID=Genre.ID;

```


the contents of the down script:
```sql
DROP TABLE Classification;
DROP TABLE Genre;
DROP TABLE Artwork;
DROP Table Artist;
```

The down script takes down the database tables in reverse order. This makes sure there are no foreign key conflicts. I could also have added a constraint to the tables that would delete items that contained the foreign key.

### Requirement 2
*Tables for Artists, ArtWorks, Genres and Classifications are correct; have appropriate names, types, relations/constraints.*

Here is an entity diagram of the database tables that were created:
![Database Entity Model Diagram](img/diagram.png)

### Requirement 3
*Db is populated with given seed data.*
I compared my database to the data that was specified using the images that has a basic entity model diagram and added all of the items that were specified.

### Requirement 4
*Main page has a menu or links to entities list pages; list pages show all entities* I created a custom menu that contained links to all of the CRUDV pages that were available in my project.

Here is the code for that menu system:
```html
<div class="navbar navbar-inverse navbar-fixed-top">
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
                    <li class="@(ViewContext.RouteData.Values["Controller"].ToString() == "Home" ? "active" : "")">@Html.ActionLink("Home", "Index", "Home", null, null)</li>
                    <li class="dropdown @(ViewContext.RouteData.Values["Controller"].ToString() == "Artists" ? "active" : "")">
                        <a class="dropdown-toggle" role="button" aria-expanded="false" href="#" data-toggle="dropdown">Artists <span class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>@Html.ActionLink("View", "Index", "Artists")</li>
                            <li>@Html.ActionLink("Create", "Create", "Artists")</li>
                            <li>@Html.ActionLink("Delete", "Delete", "Artists")</li>
                            <li>@Html.ActionLink("Details", "Details", "Artists")</li>
                            <li>@Html.ActionLink("Edit", "Edit", "Artists")</li>
                        </ul>
                    </li>
                    <li class="dropdown @(ViewContext.RouteData.Values["Controller"].ToString() == "Artworks" ? "active" : "")">
                        <a class="dropdown-toggle" role="button" aria-expanded="false" href="#" data-toggle="dropdown">Artworks <span class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>@Html.ActionLink("View", "Index", "Artworks")</li>
                            <li>@Html.ActionLink("Create", "Create", "Artworks")</li>
                            <li>@Html.ActionLink("Delete", "Delete", "Artworks")</li>
                            <li>@Html.ActionLink("Details", "Details", "Artworks")</li>
                            <li>@Html.ActionLink("Edit", "Edit", "Artworks")</li>
                        </ul>
                    </li>
                    <li class="dropdown @(ViewContext.RouteData.Values["Controller"].ToString() == "Classifications" ? "active" : "")">
                        <a class="dropdown-toggle" role="button" aria-expanded="false" href="#" data-toggle="dropdown">Classifications <span class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>@Html.ActionLink("View", "Index", "Classifications")</li>
                            <li>@Html.ActionLink("Create", "Create", "Classifications")</li>
                            <li>@Html.ActionLink("Delete", "Delete", "Classifications")</li>
                            <li>@Html.ActionLink("Details", "Details", "Classifications")</li>
                            <li>@Html.ActionLink("Edit", "Edit", "Classifications")</li>
                        </ul>
                    </li>
                    <li class="dropdown @(ViewContext.RouteData.Values["Controller"].ToString() == "Genres" ? "active" : "")">
                        <a class="dropdown-toggle" role="button" aria-expanded="false" href="#" data-toggle="dropdown">Genres <span class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>@Html.ActionLink("View", "Index", "Genres")</li>
                            <li>@Html.ActionLink("Create", "Create", "Genres")</li>
                            <li>@Html.ActionLink("Delete", "Delete", "Genres")</li>
                            <li>@Html.ActionLink("Details", "Details", "Genres")</li>
                            <li>@Html.ActionLink("Edit", "Edit", "Genres")</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
```

### Requirement 5
*Has CRUD functionality for Artists; all parts work as expected.*
This project includes working CRUD for all of the data tables in the project. Please see the demonstration video to see the editing and creation in action.

### Requirement 6
*Artist Edit page does not allow long names, all attributes are required and no future birthdates Has Genres buttons that work, shows works and artists, sorted correctly.*

I created constraints that prevent the names of the Artists from exceeding 50 characters. The database has a limit off 255 characters because I had a Polynesian friend growing up who had a last name that was 63 characters long.

```csharp
public partial class Artist
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
    public Artist()
    {
        Artworks = new HashSet<Artwork>();
    }

    public int ID { get; set; }

    [Required]
    [StringLength(50)]
    public string ArtistName { get; set; }

    [Required]
    [Column(TypeName = "datetime2")]
    [DateValidation] // Custom date validation
    public DateTime BirthDate { get; set; }

    [Required]
    [StringLength(255)]
    public string BirthCity { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
    public virtual ICollection<Artwork> Artworks { get; set; }
}
``` 

I created a custom validation constraint for the Artist's Date of Birth

```csharp
[Required]
[Column(TypeName = "datetime2")]
[DateValidation] // Custom date validation
public DateTime BirthDate { get; set; }
/// <summary>
/// Custom date validation attribute to be used to validate the user birth date.
/// </summary>
public class DateValidationAttribute : ValidationAttribute
{
    /// <summary>
    /// Takes the value in from the validation and returns true of false.
    /// </summary>
    /// <param name="value">The date entered by the user.</param>
    /// <returns></returns>
    public override bool IsValid(object value)
    {
        return (DateTime)value < DateTime.Now;
    }
}
```

### Requirement 7
*Genres feature uses AJAX* I created a JsonResult action inside the HomeController. This will return a custom JSON object that is used by the Home/Index page to show the content in the Genres.

Code from the HomeController:
```csharp
// GET: Genre
public JsonResult Genre(int id)
{
    // A list of ArtworkResuls objects we want to return to the index.
    List<ArtworkResult> list = new List<ArtworkResult>();
    // A query against the database context that will get the Artist Name and
    // the title of any piece that meets the GenreID requested.
    var artList = database.Genres.Where(g => g.ID == id)
        .Select(s => s.Classifications)
        .FirstOrDefault()
        .Select(x => new { x.Artwork.Title, x.Artwork.Artist.ArtistName })
        .OrderBy(o => o.Title)
        .ToList();
    // Go through the list of items we got from the database.
    foreach (var v in artList)
    {
        // create a new ArtworkResult that can be put in the Json result
        ArtworkResult piece = new ArtworkResult();
        // set the Properties of the piece to the values we want to pass to the Json result.
        piece.artist = v.ArtistName;
        piece.artwork = v.Title;
        // add the new piece to the list of artworks for the index.
        list.Add(piece);
    }

    return Json(list, JsonRequestBehavior.AllowGet);
}
```

Javascript code that performs the AJAX request ot the server and draws the page content from the JSON object recieved.

```js
function getGenre(id) {
    $.ajax({
        type: "GET",
        url: "/Home/Genre/" + id,
        dataType: "json",
        success: function (data) { display(data); },
        error: function (data) { alert("There was an error. Try again please!"); }
    });
}

function display(data) {
    $("#genreOutput").empty();
    $("#genreOutput").append("<dl>");
    $.each(data, function (i, item) {
        $("#genreOutput").append(
            "<dt>"
            + item["artwork"]
            + "</dt>"
            + "<dd> by "
            + item["artist"]
            + "</dd>"
        );
    });
    $("#genreOutput").append("</dl>");
}
```

### Requirement 8
*Uses Git; all work done in a feature branch and merged into master when finished.*

I created the code edits in a feature branch called "hw8" and then merged that with the master branch when complete.

### Requirement 9
*Code and screenshots are nicely arranged into the Portfolio; Portfolio is organized and easy to read.* Hopefully this portfolio page is easy enough to read and conveys all the required information.

### Video Demonstration

<iframe width="560" height="315" src="https://www.youtube.com/embed/j-lOfQgdtBI?rel=0&amp;showinfo=0&amp;playlist=j-lOfQgdtBI&amp;loop=1&autoplay=1" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>