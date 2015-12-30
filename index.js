var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown');
    templates   = require('metalsmith-templates');
    Handlebars  = require('handlebars'),
    fs          = require('fs');
    collections = require('metalsmith-collections');
    permalinks  = require('metalsmith-permalinks');
    stylus      = require('metalsmith-stylus');
    nib         = require('nib');
    beautify    = require('metalsmith-beautify');
    browserSync = require('metalsmith-browser-sync');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());

// Adds the template name to the post //
var findTemplate = function(config) {
    var pattern = new RegExp(config.pattern);

    return function(files, metalsmith, done) {
        for (var file in files) {
            if (pattern.test(file)) {
                var _f = files[file];
                if (!_f.template) {
                    _f.template = config.templateName;
                }
            }
        }
        done();
    };
};

Metalsmith(__dirname)
    .use(stylus({
      // Set stylus output to compressed
      compress: true,
      // Use the 'nib' plug-in
      use: [nib()],
    }))
    .use(findTemplate({
        pattern: 'posts',
        templateName: 'post.hbt'
    }))
    .use(collections({
      pages: {
        pattern: 'content/pages/*.md'
      },
      posts: {
        patter: 'content/posts/*.md'
      }
    }))
    .use(permalinks({
      pattern: ':collection/:title'
    }))
    .use(markdown())
    .use(beautify({
      "js": false,
      "css": true,
      "html": {
          "wrap_line_length": 80
      }
    }))
    .use(templates('handlebars'))
        .use(browserSync({
      server : "./build",
      files  : ["src/**/*.md", "templates/**/*.hbs"]
    }))
    .destination('./build')
    .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
    })