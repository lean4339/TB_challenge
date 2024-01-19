const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    mode: 'development',
    watchOptions: {
      ignored: /node_modules/
    },
    watchOptions: {
      poll: true
    },
    devServer: {
      port: 3000,
    },
    module: {
        rules: [
          {
            test: /\.(?:js|mjs|cjs)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  "@babel/preset-env", "@babel/preset-react"
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
        ]
    }
}