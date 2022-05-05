const path = require("path");
const CleanPlugins = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "javascript"),
    publicPath: "javascript",
  },

  //   devtool: "none",

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
  plugins: [new CleanPlugins.CleanWebpackPlugin()],
};
