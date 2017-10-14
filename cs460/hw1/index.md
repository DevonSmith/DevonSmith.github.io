---
title: Devon Smith
layout: default
---

## Homework 1
This homework assignment is about learning the basics of HTML and CSS. We will use git to upload our content to the our project repository. Rather than create our own framework, we will use Boostrap, a popular CSS and Javascript framework can be used to create websites quickly and easily. However, it is a rather large framework at 240KB. 

* The assignment page can be found [here](http://www.wou.edu/~morses/classes/cs46x/assignments/HW1.html).
* The repository that contains this code can be found [here](https://bitbucket.org/devonsmith7696/cs460-project-repository)
* Demo located [here](https://devonsmith.github.io/cs460/hw1/demo).
* https://bitbucket.org/devonsmith7696/cs460-project-repository.git

### Step 1: Download Git, Create an account on Bitbucket or Git, and use Git to create your initial repository for the class.

For this step I did not have to install Git. I have the Windows Subsystem for Linux installed on my PCs and used Git that was part of the Ubuntu system installed on that subsystem.

First I needed to create the directory for the class and initialize git.
Note: I have not included my real email address in this page's instructions.

```bash
cd /mnt/c/Users/Devon\ Smith/Documents
mkdir CS460
cd CS460
git init
git confic --global user.name "DevonSmith"
git config --global user.email "email@place.com"
git remote add origin https://devonsmith7696@bitbucket.org/devonsmith7696/cs460-project-repository.git
echo "This is the repo for CS460" >> README.md
git add README.md
git commit -m "Initial commit."
git push origin master
```

Technically speaking, some of this is out of order because I actually started working on HW3 first. Nonetheless it illustrates the skills that I used during this project.

After I had my made my initial push to my repo I was good to go.

### Step 2: Creating a page using HTML
For this part of the assignment I needed at least two pages. Because I anticipated the pages themselves would be complex, I limited myself to two pages in order to constrain the project's scope. According to instructions, I needed to use a single column and multi-column web page layout, so I decided to create an index.html and a columns.html file. I  created the directory structure for my files and empty HTML files for my pages.

```bash
mkdir HW1
cd HW1
mkdir css
mkdir js
touch index.html
touch columns.html
```

I then opened up my trusty text editor (Notepad++) and began creating my HTML documents, starting with <!DOCTYPE html>. Once I had the initial framework of the files I wanted, I pushed it to the git.

```bash
cd ..
git add *
git commit -m "Staging of Bootstrap 4 files"
git push origin master
```

From there I added references to the Bootstrap CDN. I started with the "new hotness" Bootstrap 4, but found that the documentation was lacking and it had significant differences from Bootstrap 3. Therefore I went back to the Bootstrap 3 CDN and used [https://www.w3schools.com/bootstrap](https://www.w3schools.com/bootstrap) to help me with some of the more complex concepts with Bootstrap. Using a pre-existing framework was different from my usual process, as I generally create everything from scratch.

#### Using Bootstrap

Bootstrap provides many different kinds of classes that can be used for everything from tables to navigation. I used the default Bootstrap dark theme for my navigation bar; in this case, the navbar-inverse class.

```html
<!-- Navigation section -->
<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="navbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>                        
        </button>
        <a class="navbar-brand" href="#">Devon Smith</a>
        </div>
        <div class="collapse navbar-collapse" id="navbar">
        <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="columns.html">Inktober</a></li>
        </ul>
        </div>
    </div>
    </nav>
<!-- end of the navigation section -->
```

There were, of course, things about the code that I wanted to change. The color was too light and I didn't want a rounded border, so I adjusted these using a custom CSS file. 

```css
.navbar {
    border-radius: 0;
    border: none;
    background-color: #080808;
}
```

#### Creating Code Content

The assignment description for this project said that we could make a page about anything, that the content didn't matter and the important component was the code. So for this assignment I created two pages. The first page contains information about the project requirements. The second page contains information about the Inktober event.

**The Home Page**

For this page I used a single row to meet the class requirements for a single column page layout. I created a row and a single column using the Bootstrap grid.

```html
<!-- main body container -->
<div class="container">
    <div class="main-page-content">
        <div class="row">
            <div class="col-sm-12">
            <!-- content is added here -->
            </div>
        </div>
    </div>
</div>
```

The homepage is a description of the assignment, formatted in an ordered list, the text of which is copied directly from the assignment page. It also contains a description list that details how and where I met all the requirements for the assignment.

**The Inktober Page**

This page includes the official Inktober logo, aligned using the Bootstrap grid. I created a row using the bootstrap CSS and created a single column that contained the logo centered on the page.

```html
<div class="row">
    <div class="col-sm-12">
        <p class="text-center">
            <img src="http://..../78315df6f0f901f4-weblogo.png" 
            alt="Inktober!">
        </p>
    </div>
</div>
```

Below the header image I wanted to create a hero text that would explain what Inktober is. To do this, I used the Bootstrap grid to create a space for the hero text, and specified a new class for this text element.

```html
<div class="row">
    <div class="col-sm-12">
        <p class="text-center hero-text">
            <strong>Inktober</strong> is an annual event that started in 2009. Every 
            year artists all over the world participate in this event and create 
            one ink drawing a day for the entire month.
        </p>
    </div>
</div>
```

I then went to Google Fonts and found a webfont that I wanted to use in the hero text and added it to my stylesheet.

```css
/* google fond used for hero text */
@import url('https://fonts.googleapis.com/css?family=Arvo');
```

I then created the class for this hero text introduction. I used the webfont I had selected and set the size relative to the root em size.

```css
.hero-text{
    font-family: 'Arvo', Georgia, "Times New Roman", serif;
    font-size: 3rem;
}
```

Then I added a carousel to the page and added some images from this year's Inktober. These images all link back to the original twitter posts that contained the images.

```html
 <!-- Carousel -->
<div id="Carousel" class="carousel slide" 
    data-ride="carousel">
    <!-- Indicators -->
    <ol class="carousel-indicators">
        <li data-target="#Carousel" data-slide-to="0" 
            class="active"></li>
        <li data-target="#Carousel" data-slide-to="1"></li>
        <li data-target="#Carousel" data-slide-to="2"></li>
    </ol>

    <!-- Wrapper for slides -->
    <div class="carousel-inner">
        <!-- first slider item -->
        <div class="item active">
            <a href="http://.../AlectorFencer/status/914892466096140288">
                <img src="img/alectorfencer.jpg" 
                    alt="@AlectorFencer" style="width:100%;">
            </a>
        </div>
        <!-- second slider item -->
        <div class="item">
            <a href="http://.../heyshannuckles/status/915041488882384896">
                <img src="img/heyshannuckles.jpg" 
                    alt="@heyshannuckles" style="width:100%;">
            </a>
        </div>
        <!-- third slider item -->
        <div class="item">
            <a href="https://.../PerroneLia/status/914934278227582976">
                <img src="img/PerroneLia.jpg" 
                    alt="@PerroneLia" style="width:100%;">
            </a>
        </div>
    </div>

    <!-- Left and right controls -->
    <a class="left carousel-control" href="#Carousel" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left"></span>
        <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#Carousel" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right"></span>
        <span class="sr-only">Next</span>
    </a>
    </div>
</div>
<!-- Carousel end -->

```

There was no spacing below the carousel, which caused it to be directly adjoin the next row in the page. To correct this, I added some spacing on the bottom of the carousel using CSS.

```css
.carousel {
    margin-bottom: 3rem;
}
```

#### Meeting the Class Requirements

You must use Bootstrap for all pages and demonstrate a single column layout and two or more column formatting.<br>
*I used mixed formatting, but for the most part used a two column layout in the columns.html file.*

You must have a separate CSS file in which you write some of your own classes and that you use somewhere.<br>
*I created a custom.css file in which I created the .hero-text class, .container, and .main-page-container classes.*

You'll need a navigation bar or menu that contains links to your pages.<br>
*I created a navigation bar using Bootstrap that contains links to all of my pages.*

You must have one of each kind of list.<br>
*The navbar contains an unordered list for the links, the assignment requirements contains an ordered list, and the implementation section on the main page includes a description list that defines how each element was used.*

All main elements need to be styles consistently.<br>
*I used Bootstrap for most of the styling but did create some custom classes that are used in both of the pages.*

You must write all code yourself, no Dreamweaver.<br>
*I used Notepad++ for coding and VSCode with a plugin for spellchecking.*


### Step 3: Creating a page using Github Pages
Github Pages use Jekyll to create a web page or blog using Markdown. I was already familiar with Markdown from Open Source Software Development and some contributions I've made to Wikis. I created the beginnings of my files in a directory and then created an empty repo on Github. From there I added an index.html file as a filler file, and then created an index.md file and began building the directory structure for this portfolio.

```
mkdir devonsmith.github.io
cd devonsmith.github.io
touch index.md
mkdir cs460
mkdir cs460/hw1
touch cs360/hw1/index.md
git init
git remote add origin https://github.com/DevonSmith/DevonSmith.github.io.git
git add *
git commit -m "Initial commit"
git push origin master
```

I then created the files using Markdown. I changed the theme using the settings in Github, which autogenerated a README.md file which I had to sync back down before I could push my new files up.

#### Markdown
Here is a brief rundown of the functions in Markdown. These are the majority of the elements I used on a regular basis. There are more elements than I've listed here, but this partial list is enough to get anyone started with Markdown.

```markdown
# H1
## H2
##### H4

* bullet 1
* bullet 2
* bullet 3

1. item 1
2. item 2
3. item 3

> blockquote
>> nested blockquote level

*Italic*
**strong**

Horizontal rule
*****

triple backtick (`) for code blocks.

```




