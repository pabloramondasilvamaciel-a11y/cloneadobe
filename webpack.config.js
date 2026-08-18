const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './electron/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    target: 'electron-main'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@types': path.resolve(__dirname, 'src/types/'),
      '@store': path.resolve(__dirname, 'src/store/')
    }
  },
  externals: {
    electron: 'commonjs electron'
  },
  node: {
    __dirname: false,
    __filename: false
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined
};
