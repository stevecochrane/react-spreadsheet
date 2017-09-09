const path = require("path");

module.exports = {
	entry: "./js/index.js",
	output: {
		filename: "bundle.js",
		path: path.join(__dirname, "/public/js")
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					"babel-loader"
				]
			}
		]
	},
	resolve: {
		alias: {
			"react": "preact-compat",
			"react-dom": "preact-compat"
		}
	}
};
