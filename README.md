# Vanilla ES6 • [TodoMVC](http://todomvc.com)

> TodoMVC implementation in Vanilla ES6.

**Demo**: http://klikstermkd.github.io/todomvc-es6

The app uses Babel to transpile the ES6 code to ES5, and Webpack to bundle all files into one.

To install it locally on your machine do the following:

* Run `npm install -g webpack`
* Run `npm install`

If you want to make some changes in the code, run `webpack -w` so that the code will automatically be transpiled to ES5 and bundled in a file called `bundle.js`, everytime you save any of the files in the `js` directory.

Webpack also creates a `bundle.js.map` file so that if an error occurs you can know in which file and line number the error occured.

List of ES6 features used in this app:

* Modules
* Classes
* Promises
* Arrow functions
* Template literals with interpolation
* Destructuring
* Default parameters
* Rest parameters
* Object literal shorthands
* Let, const
* for..of

To learn more about ES6 I highly recommend the book ["Exploring ES6"](http://exploringjs.com) by [Dr. Axel Rauschmayer](https://twitter.com/rauschma). It's very in-depth and with great examples. And it's also free to read it online!
