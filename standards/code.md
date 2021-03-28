# Code Standards BTES <h1> :clipboard:

# BTES 
is a Monorepo for Blockchain Technology Education Software project.

# Folder Structure
|`Backend`| `Common` | `Frontend` |
|:-:|-|-|
| Sockets and network| Blockhain | Pages |

# Common 
Both backend and frontend use `common` package. However; Common package cannot import from other packages. 

# Src 
All three package are inside `Src` folder.
Other folders can not part in build.


The codes that control the **rest end points** are in the ``restController`` folder.
1. Example: "hello word" route + controller 
2. @route ('simulation Insance Broker') ../simulationInstanceBroker/create/


We add it to the end.
>The name of the folder is the name of the route.
>The name of the file is route + controller

# Public
We don't prefer to put something in the `public` folder unless it's possible. Because when we build it clones each one.

# Frontend Folder 
Component and pages folder are in the src folder of `frontend`.
Pages are related with its name. 
`F.e:`
```diff 
+ Home page is inside the  Home folder. 
+ Sandbox page is inside the Sandbox folder. 
```

# Components
Component names start with a **capital letter**.
However, there are components that do not fall directly on the page.

# Styles
Style files start with a `capital letter`.
.Scss, which is more innovative, was preferred as style files.
We added the style files to the same place next to the components.
Also, the names of the style files have the same name as the pages they are linked to.

   # Css naming structure 
.page-home {
  // ...

  &--sub-class {
    //...

    &--3rd-level-class { [css-formats] (https://github.com/ctisbtes/btes/pull/18)

# Functions
Functions always start with a lowercase letter. [camelCase Format](https://eslint.org/docs/rules/camelcase)
Also, The first letter must be lowercase, adjacent, and the next word starts with capital.

# Classes
In class names, the first letter of the words starts with a capital. [`PascalCase Format`](https://palantir.github.io/tslint/rules/class-name/)

# Interfaces and Types
Also, the Pascal case convention is usually used to signify that an identifier is a type, or interface.

# Singleton 
CamelCase are used for Singleton naming however; typed same name for Singleton.

# Variables and Constants
CamelCase are used for variables and constants.

# Global Style
There is only global styles available in the style folder in root.

# Utilities
In utils, there are stateless utilities that can be reusable.

# Functions Typing
We write our functions as arrow functions assigned to variables. `(->)`

# Variables 
We define variables as const or read only (inside the class) as much as possible.

# Tests
We add the extension of the test files as `.spec`.

# Exports
As much as possible, only one export is kept in a single file. However, there are some exceptions.

# Running yarn and nvm
nvm use 12.0.0
yarn
yarn start (both frontend and backend starts)
yarn frontend start
yarn backend start

# Git commands 
[Git cheetsheet education](https://education.github.com/git-cheat-sheet-education.pdf)














