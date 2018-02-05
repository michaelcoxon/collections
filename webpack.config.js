/// <binding ProjectOpened='Run - Development, Run - Production' />
const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './dist';

module.exports = () =>
{
    const env = process.env.NODE_ENV.trim();
    const isDevBuild = !(env && env === 'production');

    return [{
        entry: { 'index': "./src/index.ts" },
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: `[name]${isDevBuild ? ".debug" : ""}.js`,
            publicPath: 'dist/'
        },
        module: {
            rules: [
                { test: /\.ts$/, include: /src/, use: 'awesome-typescript-loader?silent=true' }
            ]
        },
        plugins: [
            new CheckerPlugin()
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new webpack.optimize.UglifyJsPlugin(),
            ])
    }];
}