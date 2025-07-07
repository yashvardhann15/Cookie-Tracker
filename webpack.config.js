const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: false, // ✅ Add this line to stop Webpack from using eval()
  entry: {
    background: "./src/background.js",
    popup: "./src/popup.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "." },
        { from: "popup.html", to: "." },
        { from: "assets", to: "assets" },
      ],
    }),
  ],
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
  },
};
