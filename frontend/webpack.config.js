const webpack = require('webpack');

module.exports = {
    // 다른 설정들...
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
};