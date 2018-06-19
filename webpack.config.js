/// <binding ProjectOpened='Run - Development, Run - Production' />
const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './dist';

function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler)
{
    compiler.plugin('done', function ()
    {
        var dts = require('dts-bundle');

        dts.bundle({
            name: 'collections',
            main: 'dts/index.d.ts',
            out: '../dist/index.d.ts',
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};


module.exports = () =>
{
    const env = process.env.NODE_ENV.trim();
    const isDevBuild = !(env && env === 'production');

    return [{
        mode: isDevBuild ? 'development' : 'production',
        target: 'node',
        entry: { 'index': "./src/index.ts" },
        resolve: { extensions: ['.ts'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: `[name]${isDevBuild ? ".debug" : ""}.js`,
            publicPath: 'dist/',
            library: 'collections',
            libraryTarget: 'umd'
        },
        externals: [
            /^tslib.*$/,
            /^@michaelcoxon\/utilities.*$/
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: ['awesome-typescript-loader']
                }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            }),

            ...(isDevBuild
                ?
                []
                :
                [
                    // Plugins that apply in production builds only
                    new DtsBundlePlugin(),
                ])
        ]
    }];
}