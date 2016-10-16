# Javascript Challenge Framework

## Description
This application serves to parse and analyze given Javascript code for supported 
functionality and structure. The application provides an interface for the user
to input Javascript code and receive feedback on whether the code has met 
certain criteria (whether it includes certain functionality, excludes other kinds
of functionality, and whether it has a certain kind of structure).

In order to parse the given Javascript input, the fully built Javascript parsers
Acorn and Esprima were considered. 

* __Performance:__ Both parsers are relatively fast and perform comparably well
without considering location data. However, Acorn performs better when location 
data is also considered.
* __Browser Compatability:__ Both parsers are compatable with modern browsers IE10+
* __File-Size:__ Both Esprima and Acorn both seem to be lightweight solutions, 
however Acorn appears to be more lightweight. 
* __API-Quality:__ The API-Quality for both Esprima and Acorn appear to be rather
comparable.
* __Documentation:__ The documentation for Esprima appears to be better organized,
and there appears to be more tutorials from other developers out there.

While Acorn has a slight edge when it comes to performance and file size, given 
the time constraints of the project, this edge is not enough to overlook its
lesser documentation and support the project has. Thus Esprima was chosen as the
parser for this application.

## How to Use

In the test_api folder, there are three json files and a test.js file. These three
json files are used for users to specify javascript code functionality and
structure to check for:

* __whiteList.json:__ a json array of functionality the code MUST have
* __blackList.json:__ a json array of functionality the code MUST NOT have
* __structure.json:__ an ordered json array of nested objects and arrays which 
expresss the tree-like structure of the code

The json files have been pre-filled with examples of how the criteria should be
provided. The test.js file runs the appropriate code which checks the user input 
javascript code for the criteria listed in these files. 

### Terminology

To specify _overall_ functionality and structure to check for, use the following 
terminology:

* function declaration: use 'FunctionDeclaration'
* variable declaration: use 'VariableDeclaration'
* expression statement (expressing a value or functionality without declaring a 
variable): use 'ExpressionStatement'
* block statement: use 'BlockStatement'
* break statement: use 'BreakStatement'
* for statement: use 'ForStatement'
* while statement: use 'WhileStatement'
* return statement: use 'ReturnStatement'
* if statement: use 'IfStatement'

Currently the application does not support being _specific_ about checking the 
following functionality:

* anonymous function expression
* 'new' expression to create object instances
* function call expression
* algebraic expression
* array expression
* object expression
* logical expression
* ++ or -- (update expression)

However, the above functionality often falls under the same categories of 
expression statements and variable declarations, which can be checked for.



