var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var baseConfig = require('./base.config.js');

var replaceThis = '<div id="root"></div>';
var withThis = '<div id="root"></div>' +
    '<script src="app.bundle.js" defer></script>';

var cnt = fs.readFileSync(path.join(__dirname, 'index-template.html'));
fs.writeFileSync('index.html', cnt.toString().replace(replaceThis, withThis).replace(/\<title.*title\>/, '<title>social image viewer example</title>'));

var host = 'http://localhost:8000'
var publicPath = '/'

const baseDirName = path.join(__dirname, '../')

module.exports = {
    ...baseConfig,
    devtool: 'inline-source-map',
    debug: true,
    entry: {
        app: [
            './src/index',
            'webpack/hot/dev-server',
            'webpack-dev-server/client?' + host + publicPath
        ]
    },
    output: {
        path: path.join(baseDirName, 'dist'),
        filename: '[name].bundle.js',
        publicPath: publicPath
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('development') }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
}

