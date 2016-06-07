'use strict';
var glob = require('glob');

var GulpConfig = (function () {
    function gulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.source = './src/';

        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [glob(this.source + '/js/**/*.js')];
        this.allTypeScript = [glob(this.source + '/ts/*.ts')];
        this.publicPath =__dirname + '/dist';
        this.app = {
            path: __dirname + '/src',
            main: '/ts/game.ts',
            result: 'game.js'
        };
        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = [glob('./typings/main/**/*.d.ts'), glob(this.source + '/ts.d/*.d.ts')];
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
