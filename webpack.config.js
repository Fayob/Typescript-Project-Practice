const path = require("path");

module.exports = {
  mode: "development",
  entry: "./09-project-practice/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "javascript"),
    publicPath: "javascript",
  },

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
