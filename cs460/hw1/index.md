## Homework 1
This homework assignment is about learning the basics of HTML and CSS. We will use git to upload our content to the our project repository. For this assignment rather than create our own framework we are required to use Boostrap. This popular CSS and Javascript framework can be used to create websites quickly and easity. However, this is a rather large framework at 240KB. 

The assignment page can be found [here](http://www.wou.edu/~morses/classes/cs46x/assignments/HW1.html).

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

Tecnically speaking, some of this is out of order because I actually started working on HW3 first but in this case it illustrates the skills that I used during this project.

After I had my made my initial push to my repo I was good to go.

### Step 2: Creating a page using HTML
For this part of the assignment I needed at least two pages, and considering I wasn't planning on keeping things simple for this project I decided to stick with 2 pages to limit the scope of this project. From the page instructions I needed to use a single column and multi-column web page layout. So I decided to have an index.html and a columns.html file (real original file names I know). So I created the directory structure for my files and created empty HTML files for creating my pages.

```bash
mkdir HW1
cd HW1
mkdir css
mkdir js
touch index.html
touch columns.html
```
From here i opened up my trusty text editor (Notepad++) and begain creating my HTML documents. starting with <!DOCTYPE html>. Once I had the initial framework of the files I wanted to have pushed to the git I did just that.

```bash
cd ..
git add *
git commit -m "Staging of Bootstrap 4 files"
git push origin master
```

From there I added references to the Bootstrap CDN. I initially started with the "new hotness" Bootstrap 4 but found that the documentation was lacking and it had some significant differences from Bootstrap 3 so I went back to the Bootstrap 3 CDN and used [https://www.w3schools.com/bootstrap](https://www.w3schools.com/bootstrap) to help me with some of the more complex concepts with Bootstrap. It was a different process using this pre-existing framework because I don't tend to work that way, I usually create everything from scratch.

#### Using Bootstrap

Bootstrap provides you with many different kinds of classes that can be used for everything from tables to navigation. I used the
default Bootstrap dark theme for my navigation bar. In this case the navbar-inverse class.

```html
<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <span class="navbar-brand">Devon Smith</span>
        </div>
        <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="columns.html">Inktober</a></li>
        </ul>
    </div>
</nav>
```
There of course were some things about the code that I wanted to change, I thought the navigation was a bit too tall and the color was too light so I adjusted these using a custom CSS file.

```css
.navbar {
    border-radius: 0;
    border: none;
    background-color: #080808;
    margin-top: -2rem;
}
```

#### Creating Code Content

The assignment description for this project said that we could make a page about anything, the content did not matter but important component was the code. So for this assignment I created two pages. The first page contains information about the project requirements and describes for the instructor where the requirements were met.The second page contains a description of the Inktober event and how to participate.

###### The Home Page

###### The Inktober Page

For this page I included the official Inktober logo and aligned it using the Bootstrap grid. I created a row using the bootstrap CSS and created a single column that contained the logo centered on the page.

```html
<div class="row">
    <div class="col-sm-12">
        <p class="text-center">
            <img src="http://media.virbcdn.com/cdn_images/resize_1024x1365/c4/78315df6f0f901f4-weblogo.png" 
            alt="Inktober!">
        </p>
    </div>
</div>
```

Below the header image I wanted to create a hero text that would explain what Inktober was before the reader jumped into the page. To do this I needed to create a space for my hero text. So I used the Bootstrap grid to create a space for the hero text, and spcified a new class for this text elemement.

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

I then went to Google Fonts and found a webfont that I wanted to use in the hero text and added it to my stylesheet

```css
/* google fond used for hero text */
@import url('https://fonts.googleapis.com/css?family=Arvo');
```

I then created the class for this hero text introduction. I used the webfont I chose and set the size relative to the root em size.

```css
.hero-text{
    font-family: 'Arvo', Georgia, "Times New Roman", serif;
    font-size: 3rem;
}
```

#### Meeting the Class Requirements


### Step 3: Creating a page using Github Pages
Github Pages uses Jekyll to create a web page or blog using Markdown. I was already familiar with markdown from Open Source Software Development and some contribution I did to Wikis. So I created the beginnings of my files in a directory and then created and empty repo on Github. From there I added an index.html file as a filler file. I then just created an index.md file and began creating the directory structure for this portfolio.

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

I then created the files using Markdown. I changed the theme using the settings in Github which then autogenerated a README.md file. Which I had to sync back down and then I could push my new files up.




