## Homework 2
This homework assignment was about learning the basics of javascript application development. Building off the skills from homework 2 we will be writing a web application in javascript while still using HTML, CSS, and Bootstrap for the page layout.

* You can find a description of this project [here]()
* Demo located [here](https://devonsmith.github.io/cs460/hw2/demo).
* The repository that contains this code can be found [here](https://bitbucket.org/devonsmith7696/cs460-project-repository)
* https://bitbucket.org/devonsmith7696/cs460-project-repository.git

### Step 1: Setup the environment

The first step for creating this project was to add additional directories to the assignment repository for this class.

```bash
mkdir HW2
cd HW2
mkdir js
mkdir css
```

Then I needed to create a new feature branch on the git repository for this homework assignment. I also need to checkout that branch so I can edit the code separate from my homework 1 work.

```bash
git checkout -b hw2
```

This command created a new branch and checked it out all in one step. Now that I have the new branch created I can start making the files for this code branch.

```bash
touch index.html
touch css/style.css
git add *
git commit -m "Initial code for HW2."
git push origin hw2
```

That should be a good start. I'm going to initially start by placing my javascript code at the end of my body tag in the HTML and eventually move it to a specific .js file.

### Step 2: Think of a project and design it

I've been working on all of the assignments more or less at the same time. I get the initial bit of code roughly created for all of the projects and have been slowly refining the projects and homework assignments over time. In Homework 3 we're implementing a project from CS260: Data Structures in C# instead of in Java. For this project I decided to do the same thing. I'm going to implement Homework 3 in JavaScript.

The project for Homework 3 is to implement a stack-based calculator that uses postfix a.k.a. reverse polish notation. This is a pretty typical project you find in a data structures class and should allow me to learn some of the ins and outs of the JavaScript type system. I will of course create an application with a user interface written in java and will use the web page to provide feedback to the user and help with the usage of the calculator.

### Step 3: Wireframe Creation

As the first part of the application design phase I am creating a wireframe that will act as the basic layout for my application and will guide my development. I know that I'm going to use HTML, CSS, Bootstrap, Javascript, JQuery, and Popper.js as they are all in my toolkit for this class. So I'm going to try and design something that can be done with those libraries and frameworks.

For my design I used the free software Pencil Project by Evolus Co. Ltd. This tool allows you to create great application wire frames and is open source. You can get it [here](http://pencil.evolus.vn/). Here is the design I came up with:

Here are the wireframes:

#### Normal Operation

![Normal](img/normal.png)

#### Without "Show stack" checked

![No Stack](img/nostack.png)

#### Input Error

![Error](img/error.png)


### Step 4: Creating the Working Page

The first step after the design phase was to create a basic web page that would act as the user interface for the application. So I started by creating the HTML and CSS layout of the page.

```html
<!DOCTYPE html>
```

After the main parts of the page were created I started writing the JavaScript code that would run the application.

```js
function calculate(){ return a + b;}
```
#### The Fully Functional Page

![Working Application](img/final.gif)

### Step 5: Merging Back to Master
