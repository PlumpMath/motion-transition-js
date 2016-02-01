module.exports = {
  devtool: 'source-map',
  entry: `${__dirname}/src/app.js`,
  output: {
    path: `${__dirname}/__build__`,
    filename: 'bundle.js',
    publicPath: '/__build__/'
  },
  resolve: {
    modulesDirectories: ['web_modules', 'node_modules', 'src', `${__dirname}/../..`]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      }
    ]
  }
};

