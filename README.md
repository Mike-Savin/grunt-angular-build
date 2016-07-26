# angular-grunt-build

A Grunt plugin that allows to write code using modular structure without including dependency names.

This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

## Installation
To install plugin using npm run this command:

```shell
npm install angular-grunt-build
```

## Getting Started

### Gruntfile
Once the plugin has been installed, it may be enabled inside your Gruntfile:

```js
grunt.loadNpmTasks('angular-grunt-build');
```

Next, add a section named `build` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  build: {
    your_target: {
      source: 'source directory of a project, e.g. app or <%= app.src %>',
      destination: 'directory where result will be generated',
      appName: 'your application name, e.g. myApp'
    },
  },
});
```

So your Gruntfile should look like this:

```js
module.exports = function (grunt) {
  grunt.loadNpmTasks('angular-grunt-build');

  grunt.initConfig({
    app: appConfig,
    build: {
      dist: {
        appName: 'myApp',
        source: 'app',
        destination: 'public'
      }
    }
  });

  grunt.registerTask('default', ['build:dist']);
};
```

### Project structure
In the root of your app source folder you need to add the `app.js` file like this:

```js
angular.module('myApp', [/* list of used modules */]);
```

You can also add `bootstrap.js` file:

```js
angular.element(document).ready(function () {
    angular.bootstrap(document, ['myApp']);
});
```

Next, you have the following list of permitted folder names to get the MVC-like structure:

* configs
* constants
* controllers
* directives
* filters
* models
* runs
* services

All listed folders are able to place appropriate Angular files in it (`model` and `service` are just other names for `factory`).

Files in folders should look like this:

```js
var <controller/directive/etc name> = function (/* list of dependencies, e.g. $scope */) {
  /* your code below */
};
```
