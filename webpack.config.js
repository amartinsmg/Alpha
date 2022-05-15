const path = require("path"),
  CopyPlugin = require("copy-webpack-plugin"),
  CssMinimizerWebpack = require("css-minimizer-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/frontend/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 8000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerWebpack()],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "**/*.html", context: "src/frontend/" }],
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
  ],
};
