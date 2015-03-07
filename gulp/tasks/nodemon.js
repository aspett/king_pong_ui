var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'server.js',

    // watch core server file(s) that require server restart on change
    watch: ['server.js','views/','lib/','controllers/','client/src/'],

    // html json etc.
    ext: "js html css json scss"
  })
});
