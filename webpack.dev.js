/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import { stylePaths } from './stylePaths.js';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '9000';

export default merge(common('development'), {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: HOST,
    port: PORT,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
    open: true,
    static: {
      directory: path.resolve('./dist'),
    },
    client: {
      overlay: true,
      webSocketTransport: 'ws',
    },
    webSocketServer: 'ws',
    watchFiles: {
      paths: ['src/**/*'],
      options: { usePolling: true, interval: 1000 },
    },
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 300,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [...stylePaths],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});
