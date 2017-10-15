---
title: Devon Smith
layout: default
---
## Homework 3
For this project I will be creating a C# implementation of a previously writeen Java application. The goal of this project is to write a simple example C# application that will demonstrate my knowledge and understanding of the C# language and development tools.

The purpose of this project is refamiliarize myself with C# and Visual Studio so I can be ready to work on the ASP.NET MVC applications in our next set of assignments.

* You can find a description of this assignment [here]().
* The repository that contains this code can be found [here](https://bitbucket.org/devonsmith7696/cs460-project-repository)
* https://bitbucket.org/devonsmith7696/cs460-project-repository.git


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

```
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

>
```

**Testing a valid expression on the calculator:**

```
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 5 5 +
    >>> 5 5 + = 10.0
Please enter q to quit

>
```

**Testing and expression that divides by zero:**

```
Postfix Calculator. Recognizes these operators: + - * /
Please enter q to quit

> 10 0 /
    >>> 10 0 / = Can't divide by zero
Please enter q to quit

>
```

**Testing an invalid statement that produces a stack exception:**

```
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

```
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

As a personal design preference I decided that all communication with the user would be done in the main class in the new application. The individual functions that were used to do calculations would not be used to communicate with the user or process user input. They would not include any printline or readline statements. I use exceptions to pass information to the parent process. This could be done differently but since it will only happen on a critical failure using an exception made sense.


### Step 4: Implementation

#### Working with Other Students

Since I was already familiar with C# I volunteered to work with other students. Working as a group provides goot teaching and learning opportunities for everyone in the group. Everyone looks as a problem differently and the more people you have looking at a problem the more complete the solution.

While working with other students we did not share code directly with one another. We __did not__ copy and paste eachother's code. We did discuss patterns and possible solutions to problems or bugs we found in our code. Our code may look similar but each of us coded our project independently. During the intial creation of this project I worked alone but did collaborate with @skoliver89 during the creation of this project.

If any part of my code was collaborative I will mention who I collaborated with during the creation of the code in this journal.

#### Creating the Base Classes

When working on code I prefer to work in a bottom up pattern. I will start with the interfaces and foundational classes before altering code in the main class. For this assignment I did write a basic implementation of the logic for the calculator with C#'s pre-existing ```Stack<T>``` class before writing my own ```LinkedStack<T>``` class.

Starting at the bottom I wrote the interface for my ```LinkedStack<T>``` class. This interface was named ```ILinkedStack<T>```. For this I implemented the base class methods that needed to be part of the LinkedStack<T> class. I did not include the ```isEmpty()``` method because I would be using properties instead.

**Code for ILinkedStack&lt;T&gt;**

Creating this interface was straight forward. I implemented the abstract classes that were used in the *StackADT.java* file. The primary difference between this and the C# code is that C# uses PascalCase for the method names and java uses camelCase. I also defined this interface using generics rather than using a boxing technique, and omitted the ```isEmpty()``` method from the java application in favor of a Count property. In the code I'll need to check ```stack.Count == 0``` instead of ```stack.isEmpty()```
```csharp
namespace CS460_Postfix_Calculator
{
    interface ILinkedStack<T>
    {
        // the methods that the ILinkedStack classes must implement
        // Push items onto the stack.
        void Push(T obj);

        // Pop items off the stack
        T Pop();

        // Look at the top item on the stack.
        T Peek();

        // clear the contents of the stack.
        void Clear();

        // I excluded the isEmpty method that was included in the Java version of this project.
        // This method is not needed since C# uses properties. So I'm going to use a property, 
        // Count, for checking if the stack is empty.

    }
}
``` 

**Code for Node&lt;T&gt;**
The basic code of this class should be similar to the code used in the Java version of this application. I did use properties instead of having public variables as part of the class. In the Java application ```data``` and ```node``` were both public variables. The Java verstion of this application also does not use generics, this C# version does to avoid object boxing.

```csharp
namespace CS460_Postfix_Calculator
{
    class Node<T>
    {
        T data;
        Node<T> next;
        /// <summary>
        /// Node code constructor, creates a new node with the items created.
        /// </summary>
        /// <param name="item">The item of type T that will be stored in the node.></param>
        /// <param name="nextNode">A pointer to the next node in the chain.</param>
        public Node(T item, Node<T> nextNode)
        {
            // The item we want to store
            data = item;
            // the next node in the linked list.
            next = nextNode;
        }
        // Properties for the node. In the Java version of this project they used 
        // public values. Since C# has properties we don't need to do that.
        public T Data
        {
            get { return data; }
            set { data = value; }
        }
        public Node<T> Next
        {
            get { return next; }
            set { next = value; }
        }

    }
}
```

**Code for LinkedStack&lt;T&gt;**
This ```LinkedStack<T>``` class implements the ```ILinkedStack<T>``` interface and all of its methods. The logic for these methods is similar to the code used for the Java application but provides a property, ```Count``` that will allow the application to check for and empty stack or handle a stack with too few or too many elements.

```csharp
using System;

namespace CS460_Postfix_Calculator
{

    class LinkedStack<T> : ILinkedStack<T>
    {
        // The top item on the stack
        Node<T> top;
        // The number of items on the stack.
        int count;
        /// <summary>
        /// Constructor for an empty stack.
        /// </summary>
        public LinkedStack()
        {
            top = null;
            count = 0;
        }

        /// <summary>
        /// Constructor that creates the first node in the stack.
        /// </summary>
        /// <param name="item">The item to be stored on the stack.</param>
        public LinkedStack(T item) {
            top = new Node<T>(item, null);
            count = 1;
        }

        /// <summary>
        /// Returns the top item from the stack. Removes the item from the stack.
        /// </summary>
        /// <returns></returns>
        public T Pop()
        {
            // If there is nothing on the stack, throw exception
            if (count == 0)
                throw new Exception("Empty Stack");
            T topItem =  top.Data;
            top = top.Next;
            --count;
            return topItem;
        }

        /// <summary>
        /// Returns the top item of the stack, does not remove it from the stack.
        /// </summary>
        public T Peek()
        {
            // If there is nothing on the stack, throw exception
            if (count == 0)
                throw new Exception("Empty Stack");
            return top.Data;
        }

        /// <summary>
        /// Push a new item onto the stack.
        /// </summary>
        public void Push(T newItem)
        {
            Node<T> node = new Node<T>(newItem, top);
            top = node;
            ++count;
        }

        /// <summary>
        /// Clears the stack of all elements.
        /// </summary>
        public void Clear()
        {
            top = null;
        }

        /// <summary>
        /// The number of elements in the stack.
        /// </summary>
        public int Count{
            get { return count; }
        }
    }
}
```

**The Program Code**

The start of the code added a using statment for ```System.Text.RegularExpression``` for checking for valid operators and operands.
```csharp
using System;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;



/******************************************************************************\
 * Postfix Calculator                                                          *
 * Author: Devon Smith                                                         *
 * CS360 Fall 2017                                                             *
 * Western Oregon University                                                   *
 \*****************************************************************************/

namespace CS460_Postfix_Calculator
{
    // ... Code here ...
}
```

The first bit of code I wrote was to check for operands and operators. This would allow me to differentiate between operators, operands, and invalid inputs.

```csharp
/// <summary>
/// Returns true if the supplied string is a valid decimal number.
/// </summary>
/// <param name="num">The string to assess.</param>
/// <returns>True if the string is a valid number.</returns>
static bool IsNumeric(string num)
{
    return new Regex(@"(?:\d*.)?\d+").Match(num).Success;
}

/// <summary>
/// Returns if the supplied string is an operator for the calculator.
/// </summary>
/// <param name="input">the string to assess.</param>
/// <returns>True if the value is +,-,*, or /</returns>
static bool IsOperator(string input)
{
    return new Regex(@"[-+*/]{1}").Match(input).Success;
}
```

The next code I wrote was the ```Calculate(string[] arr)``` which will take an array of operators and operand and process them. If the calculator encounters an error it will throw and exception that can be caught in ```Main()```. If there is an invalid operand or input it will throw an ```ArgumentException```. If the stack has inadequate elements for an operation or has too many elements at the end it will throw a generic ```Exception``` with a message. If there is an attempt to divide by zero the method will throw a ```DivideByZeroException```.

```csharp
       /// <summary>
        ///     Calculates the value of a reverse polish/postfix expression.
        /// </summary>
        /// <param name="arr">
        ///     An array that represents the tokenized expression to be
        ///     assessed.
        /// </param>
        /// <returns>
        ///     The double value solution of the provided expression.
        /// </returns>
        static double Calculate(string [] arr)
        {
            LinkedStack<double> calculatorStack = new LinkedStack<double>();
            foreach (string s in arr)
            {
                // if the value of the string is numeric.
                if (IsNumeric(s))
                    // push it onto the stack as a double.
                    calculatorStack.Push(Convert.ToDouble(s));
                // if the value of the string is an operator
                else if (IsOperator(s) && calculatorStack.Count > 1)
                {
                    // operands 1 and 2 for non-commutative operations.
                    double op1, op2;
                    // which operator is it?
                    switch (s)
                    {
                        // add
                        case "+":
                            calculatorStack.Push(calculatorStack.Pop() + calculatorStack.Pop());
                            break;
                        // subtract
                        case "-":
                            // non-commutative operation
                            op2 = calculatorStack.Pop();
                            op1 = calculatorStack.Pop();
                            calculatorStack.Push(op1 - op2);
                            break;
                        // multiply
                        case "*":
                            calculatorStack.Push(calculatorStack.Pop() * calculatorStack.Pop());
                            break;
                        // divide
                        case "/":
                            // non-commutative operation
                            op2 = calculatorStack.Pop();
                            op1 = calculatorStack.Pop();
                            // cannot divide by zero
                            if (op2 == 0)
                                throw new DivideByZeroException();
                            calculatorStack.Push(op1 / op2);
                            break;
                        // default, do nothing
                        default:
                            break;
                    }
                }
                // what if the value is something else?
                // die.
                else
                    // if the stack didn't have two or more items.
                    if (calculatorStack.Count <= 1)
                        throw new Exception("Improper input format. Stack became empty when expecting first operand");
                    // otherwise we encountered and invalid argument.
                    else
                        throw new ArgumentException();
            }
            // Return the value on the stack
            if (calculatorStack.Count > 1)
                // Throw an exception if the stack is not in a valid state at the end
                // of processing the expression.
                throw new Exception("Improper input format. Stack contains multiple elements.");
            return calculatorStack.Pop();
        }
```

The ```Main``` application code starts by telling the user what is going on and how to use the application. Then it takes a postfix expression from the user and breaks it into an array before passing that on the the ```Calculate()``` method. The application also has a main loop that will run until the user enters "q" to quit the application. Once the execution is complete it will output the result to the end user. The goal of this application was to have it look as much like the original Java application as possible. So it outputs information to the user in the same way.

```csharp
/// <summary>
///     Application calculates expressions in reverse polish notation.
///     Expressions are strings of operators and operands separated by
///     spaces.
/// </summary>
/// <param name="args">System arguments will be ignored.</param>

// test value:
//    infix: ((15 / (7 − (1 + 1))) * 3) − (2 + (1 + 1))
//    postfix: 15 7 1 1 + − / 3 * 2 1 1 + + −
//    Expected result: 5
static void Main(string[] args)
{
    // An indicator for application exit.
    bool calculateMore = true;
    //Provide instructions for the user
    Console.WriteLine("Postfix Calculator. Recognizes these operators: + - * / ");

    // If the user wants to do more calculations continue.
    while (calculateMore)
    {
        Console.Write("Please enter q to quit\n\n> ");
        string rawInput = Console.ReadLine();
        // split the input on a regular expression.
        string[] input = new rawInput.Split(' ');
        // If the first character is not 
        if (input[0].FirstOrDefault() != 'q')
        {
            // return the calculated value.
            try
            {
                double result = Calculate(input);
                Console.WriteLine("\t>>> " + result);
            }
            // If the calculation throws an exception.
            catch (Exception e)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append("\t>>> " + rawInput + " = ");
                // If the user tried to divide by zero.
                if (e is DivideByZeroException)
                {
                    sb.Append("Can't divide by zero.");

                }
                // If the user provided an argument that was not recognized
                else if (e is ArgumentException)
                {
                    sb.Append("Improper input format. ");
                }
                // If the application could not convert one of the input values into a double.
                else if (e is FormatException)
                {
                    sb.Append("Improper input format. One or more values were invalid.");
                }
                // for all other exceptions.
                // This is used when a user has an invalid stack state at expression end.
                else
                {
                    sb.Append(e.Message);
                }
                Console.WriteLine(sb.ToString());
            }
        }
        else
        {
            // Stop calculating.
            calculateMore = false;
        }
        
    }
}
```

### Step 5: Testing

For the testing of this code we used a group testing method. I worked with @skoliver89 and @Aearl16 in the group study area in ITC at WOU and we tested our code while in the same environment. If we encountered a problem with our code we could bring it up and see if the code for our code was suseptible to the same bugs/errors. 

#### Refining Regular Expressions
As I worked with @skoliver89 we began testing our code and refining it. We wanted to support input strings that contains positive or negetive indicators in front of the number explicitly and only if the pattern was matched once. We came up with ```[-|+]?(?:\d*.)?\d+``` which got us close but would accept values that contained more than one valid expressions. @skoliver89 added anchors to the end of his expression and resulted in ```^[-|+]?(?:\d*.)?\d+$``` which would only accept a valid expression once. I used this same RegEx in my code.

#### Death by Multiple Spaces
During testing @skoliver89 found a flaw in his code which would break if someone accidentially put multiple spaces between the operators or operands. This would result in an empty value in the array used for the calculation. I found that my code was suseptible to the same flaw. Stephen began looking for a way to refine the regular expression used to validate intput and I said, "I wonder if there is a way to split a string with a regular expression." I found ```RegEx.Split()``` which we used to improve the way we split the user intput into arrays. 

This code:
```csharp
Console.Write("Please enter q to quit\n\n> ");
string rawInput = Console.ReadLine();
// split the input on a regular expression.
string[] input = new rawInput.Split(' ');
```
was updated to this code:
```csharp
Console.Write("Please enter q to quit\n\n> ");
string rawInput = Console.ReadLine();
// split the input on a regular expression.
string[] input = new Regex(@"\s+").Split(rawInput);
```
Once this code was updated the application passed all of my test cases and was complete:

![Calcualtor](img/calc.gif)

### Step 6: Git Merge 