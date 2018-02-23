/// <binding ProjectOpened='Run - Development, Run - Production' />
const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './dist';
const nodeExternals = require('webpack-node-externals');

module.exports = () =>
{
    const env = process.env.NODE_ENV.trim();
    const isDevBuild = !(env && env === 'production');

    return [{
        target: 'node',
        externals: [nodeExternals()],
        entry: { 'index': "./lib/index.ts" },
        resolve: { extensions: ['.ts'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: `[name]${isDevBuild ? ".debug" : ""}.js`,
            publicPath: 'dist/'
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /lib/,
                    use: 'awesome-typescript-loader'
                }
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