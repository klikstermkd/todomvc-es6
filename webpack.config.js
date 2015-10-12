var path = require('path');

module.exports = {
	entry: './js/app.js',
	output: {
		filename: './dist/bundle.js'
	},
	module: {
		loaders: [
			{ test: path.join(__dirname, 'js'), loader: 'babel-loader' }
		]
	},
	devtool: 'source-map'
};
