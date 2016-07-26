'use strict';

module.exports = function (grunt) {

  grunt.registerMultiTask('angular_build', '', function () {
    var source = this.data.source;
    var destination = this.data.destination;
    var appName = this.data.appName;

    if (!source || !destination || !appName) {
      throw grunt.util.error('You should specify "source", "destination" and "appName" properties in your Gruntfile.');
    }

    var contents = [], content, name, args, module, modelOrService;

    //scripts concatenation order
    var dirsOrder = ['constants', 'configs', 'runs', 'models', 'services', 'directives', 'filters', 'controllers'];

    //var strip_comments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var functionName = /var ([a-zA-Z_]+)/;

    var argsExpression = /\(\s*([^)]+?)\s*\)/;

    appName += 'App';

    //process app.js first
    content = 'var ' + appName + ' = ';
    content += grunt.template.process(grunt.file.read(source + '/js/app.js'), {data: {appName: appName}});
    contents.push(content);

    dirsOrder.forEach(function (dir) {
      grunt.file.expand({}, source + '/js/' + dir + '/**/*.js').forEach(function (path) {
        //TODO: strip comments normally
        content = grunt.file.read(path);//.replace(strip_comments, '');
        contents.push(content);

        //get name of component
        name = content.match(functionName)[1];

        //get the argument list
        args = argsExpression.exec(content);

        if (args && args[1]) {
          args = "'" + args[1].split(/\s*,\s*/).join("', '") + "', ";
        } else {
          args = '';
        }

        //if model or service define factory
        modelOrService = ['models', 'services'].indexOf(dir) > -1;
        module = modelOrService ? 'factory' : dir.slice(0, -1);

        //define component
        if (['configs', 'runs'].indexOf(dir) > -1) {
          contents.push(appName + '.' + module + '([' + args + name + ']);');
        } else if (dir === 'services') {
          contents.push(appName + '.' + module + "('" + name + "', [" + args + name + "]);");
        } else {
          contents.push(appName + '.' + module + "('" + name + "', " + name + ");");
        }
      });
    });

    //process bootstrap.js last if it exists
    if (grunt.file.exists(source + '/js/bootstrap.js')) {
      contents.push(grunt.template.process(grunt.file.read(source + '/js/bootstrap.js'), {
        data: {appName: appName}
      }));
    }

    //write the result to distribution dir
    var destinationFile = destination + '/js/app.js';
    grunt.file.write(destinationFile, contents.join('\n'));

    grunt.log.writeln('File "' + destinationFile + '" created.');
  });

};
