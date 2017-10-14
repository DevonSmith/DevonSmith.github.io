---
title: Devon Smith
layout: default
---
## Homework 3
Project description.

### Step 1: Environment Setup

#### Setting up Visual Studio
I had Visual Studio 2017 already installed, because I use it for programming in C, C++, and C#. I have the Git tools installed but will not be using them for this assignment I will be using the command-line version of Git for familiarity's sake.

#### Syncing My Respository and Creating Directories

This was actually the first project I started working on for this class because it sounded like the most fun. So there was some starter code that I wrote for this program at the start of the term. So all I needed to do was get the code from the Git repository.

```bash
cd /Documents/CS460
git pull

```
*Note: I did the following during my initial coding but this illustrates the process of setting up a git ignore file.*

For this project I setup a ```.gitignore``` file that allows me to exclude binaries and other content that visual studio and the Microsoft Build system creates during debugging. This way I can keep only the code and file essential for my application in the git repository.

After starting my own ```.gitignore``` file I decided that I would rather just use one that was pre-created and remove anything that I didn't want instead of write something from scratch that might not ignore all of the files that were neccessary. Fortunately, github has a collection of ```.gitignore``` files that you can use for your projects. I downloaded the file for Visual Studio and put it in the base of my homework 3 folder. Once that was complete I would create a branch for working on this project.

```bash
git checkout -b hw3
```

Once this was setup I could open my project and start writing notes for the project (in the form of comments) and start analyzing the application I was going to reimplement.

### Step 2: Analyzing the Java Application

Initially I started writing this application before looking at the code. It had been my intension to recreate the Java application without looking at the code directly and create a white-box implementation of the application. After the discussion we had in class we were encouraged to look at the code and reimplement the java code in C# instead of just re-writing the application.

This meant changing the approach I took for the development of this project. I orifinally had intended to use the built-in C# stack, but since we were to implement all of the classes that were in the Java application I implmented my classes and code based on the Java code sample.

#### Code inspection

After downloading the code from the class website I opened the zip and inspected the files. There were the following files:

* Calculator.java
* Node.java
* StackADT.java
* LinkedStack.Java

I started by looking at the object classes and interface before looking at the actual code for the "driver class" in *Calculator.java*. 

I started with the StackADT.java file. This file I suspected would contain either an abstract data type or an interface. In this case it contained a Java interface with abstract methods. The methods were typical of the types of methods that you would find for a stack data type, push, pop, peek, and clear. There was an additional method, isEmpty. 

The LinkedStack.java file contained the code for the actual stack. It used a linked stack which uses a single-linked linked list as the data type for the stack. It implemented all of the functions described in the StackADT interface.

The Node.js file contained the code for a node that was used in the linked list for the stack.

Looking over the driver class, Calculator.java, I found some interesting code that was the actual implmentation of the calculator. The calculator had a main loop that would run until it recieved a sentinel value from the user to exit the loop. In this case, when the user enters 'q' the application would exit. Otherwise, the application would continue to prompt for intput to calculate.

Most of the logic for the application was done inside a function called *doCalculation()* which took no arguments and prompted the user for inputs. There were two helper functions, one that would evaluate the expression being put into the calculator and a second that would actually do the calculations.


#### State Tests from CS460 HW3 Java Code

Before moving on to creating and designing my version of the application I would need to test the code. This allows me to see exactly what I user will see when they use the application and what states cause messages to be displayed to the user. I wanted my application's user interface to work fundamentally the same way. That way you could replace the application with the new C# application and not disrupt a user that had been using this application.

**Testing the default output when starting the application:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

>
```

**Testing a valid expression on the calculator:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 5 5 +
    >>> 5 5 + = 10.0
Please enter q to quit

>
```

**Testing and expression that divides by zero:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 10 0 /
    >>> 10 0 / = Cant divide by zero
Please enter q to quit

>
```

**Testing an invalid statement that produces a stack exception:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 15 +
    >>> 15 + = Improper input format. Stack became empty when expecting first operand.
Please enter q to quit

> 15 7 3 + + -
    >>> 15 7 3 + + - = Improper input format. Stack became empty when expecting first operand.
```

This causes the calculator to produce a message telling the user what happened during the calculation.

**Testing an incomplete expression:**

```bash
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 15 7 1 1 + - / 3 * 2 1 1 + +
    >>> 15 7 1 1 + - / 3 * 2 1 1 + + = 4.0
```

__This is a bug__: When the calculator has a stack in an invalid end state containing multiple numbers the calculator pushes the top value from the stack. This causes the calculator to produce an invalid answer. I am going to change this behavior from the original so it will produce a warning for the user.


### Step 3: Application Design Descisions

After collecting inforamtion onf the application Iw as to implement in a new language I went through and wrote down some of the code changes I would make and hwo I would want my application to be built.

I was going to create the same classes and interface that were used in this Java version of the calculator. However, the name conventions used in Java are not the same as the ones used in C#. To keep the code as CSharp-y as possible I would change the name of the interface class. By convention, all interfaces in C# have a capital I prefix and are followed by a descriptive name of the class. I decided to name the interface ILinkedStack.

The Java application used object boxing for the stack. It would store everything in a node that would take an object. This would require boxing and unboxing before information could be stored and used. I could do the same thing in C# however, I prefer to use generics. So I decided that all of the classes (other than the main class) were going to be generic classes. The interface would also use generics. So I created the new class files and named them ```ILinkedStack<T>```, ```LinkedStack<T>```, and ```Node<T>```.

The java interface ```StackADT``` contained a method ```isEmpty()``` which I am going to replace with a property that returns a count of the number of elements in the stack. 

In the main class I decided to use a switch statement for the operators. While according to the Java application comments, Java cannot switch on strings, C# can. So I am going to use a switch statment instead of if-else statements to determine which operation to perform.

As a personal design preference I decided that all communication with the user would be done in the main class in the new application. The individual functions that were used to do calculations would not be used to communicate with the user or process user input. They would not include any printline or readline statements. I use exceptions to pass information to the parent process.


### Step 4: Implementation

For the implementation of my version of this project I started with the base classes and worked my way up.


### Step 5: Testing

### Step 6: Git Merge 