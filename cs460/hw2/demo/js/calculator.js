// will validate the user's input field.
function validate(referenceElement){
    if (referenceElement.value.search(/[a-zA-Z,]/) > -1){
        var instructions = "<p>You appear to have made a mistake!</p>" 
                         + "<p>Please remember the following:</p>"
                         + "<ol><li>You cannot use letters</li>"
                         + "<li>You must use <a href='https://en.wikipedia.org/wiki/Reverse_Polish_notation'>RPN</a></li>"
                         + "<li>Do not include commas in large numbers</li></ol>";
        document.getElementById("instructions").innerHTML = instructions;
        document.getElementById("instructions").style.visibility = "visible";
    }
    else {
        document.getElementById("instructions").innerHTML = "";
        document.getElementById("instructions").style.visibility = "hidden";
    }
}

// checks the status of the show stack checkbox
function checkState(){
    if(document.getElementById("showStack").checked == false){
        document.getElementById("trace").innerHTML = "";
        $("#outputbox").removeClass("output");
        
    }
}

// process the expression
function calculate(){
    // input for the calculator
    // good input for testing: 15 7 1 1 + - / 3 * 2 1 1 + + -
    var string = document.getElementById("user-input").value;
    // trim the white space off the ends of the string then create 
    // an array split on the spaces.
    var expression = string.trim().split(" ");
    var stack = [];

    // a string for outputting error messages
    var errorMessage = "";
    // start by making the output box for the stack trace styled.
    var trace = document.getElementById("trace");
    
    if(document.getElementById("showStack").checked == true){
        trace.innerHTML = "<p><strong>Contents of the stack:</strong></p>";
        $('#outputbox').addClass('output');
    }
    else {
        trace.innerHTML = "";
        $("#outputbox").removeClass("output");
    }

    // loop through the items in the input and process them.
    for (var i in expression){
        // if the item is a valid number push it onto the stack.
        // Checks for and operand and validates it as a number.
        if (/(?:\d*\.)?\d+/.test(expression[i]) && isNaN(expression[i]) == false){
            var stackElements = "";
            stack.push(expression[i]);
            if(document.getElementById("showStack").checked == true){
                for (var i in stack){
                    stackElements += stack[i] + ' ';
                }
                trace.innerHTML += "<div class='tabbed'><p>After push operation: " 
                                + stackElements
                                + "</p></div>";
            }

        }
        // otherwise it's an operator and needs to be processed.
        // An operation can only be performed if there are two or more items on the stack.
        else if (stack.length > 1 && /[-+*\/]{1}/.test(expression[i])) {
            // variables for non-comutative operations.
            var a = 0;
            var b = 0;
            // select a case based on the operator
            switch(expression[i]){
                // Explicitly convert items to numbers to prevent string operations.
                // Addition is commutative
                case '+':
                    stack.push(Number(stack.pop()) + Number(stack.pop()));
                    break;
                // Subtraction is not commutative
                case '-':
                    b = Number(stack.pop());
                    a = Number(stack.pop());
                    stack.push(a-b);
                    break;
                // Multiplication is commutative
                case '*':
                    stack.push(Number(stack.pop())*Number(stack.pop()));
                    break;
                // division is not commutative
                case '/':
                    b = Number(stack.pop());
                    a = Number(stack.pop());
                    // check for divide by zero
                    if (b == 0){
                        errorMessage = "<span class='red-text'>" 
                                        + "<span class='glyphicon glyphicon-exclamation-sign'></span> " 
                                        + "Input error: Cannot divide by zero!"
                                        + "</span>";
                        document.getElementById("output").innerHTML = errorMessage;       
                        return;
                    }
                    stack.push(a / b);
                    break;
                default:
                    break;    
            }
            if(document.getElementById("showStack").checked == true){
                // create an ouput string for the stack elements.
                var outputString = "";
                for (var j in stack){
                    
                    outputString += stack[j] + ' ';
                }
                // place the stack information into the trace.
                trace.innerHTML += "<div class='tabbed'><p>After " 
                                + expression[i] 
                                + " operation:    " 
                                + outputString;
            }
        }
        // the input from the user created an invalid state.
        // not enough items in the stack to perform an operation.
        else {
            errorMessage = "<span class='red-text'>" 
                            + "<span class='glyphicon glyphicon-exclamation-sign'></span> "
                            + "An error has occurred: Please check your expression."
                            + "</span>";
            document.getElementById("output").innerHTML = errorMessage;
            return;
        } 
    } 
    document.getElementById("output").innerHTML = "Answer: " + stack.pop();  
}