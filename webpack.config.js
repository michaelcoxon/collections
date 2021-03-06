﻿/// <binding ProjectOpened='Run - Production' />
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './dist';
const libDir = 'lib';
const srcDir = 'src';
const libraryName = 'collections';

function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler)
{
    compiler.plugin('done', function ()
    {
        var dts = require('dts-bundle');

        dts.bundle({
            name: libraryName,
            main: `${libDir}/index.d.ts`,
            out: `.${bundleOutputDir}/index.d.ts`,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};


module.exports = () =>
{
    const env = process.env.NODE_ENV && process.env.NODE_ENV.trim();
    const isDevBuild = !(env && env === 'production');

    return [{
        mode: isDevBuild ? 'development' : 'production',
        entry: { 'index': `./${srcDir}/index.ts` },
        resolve: { extensions: ['.ts'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: `[name].js`,
            publicPath: 'dist/',
            library: libraryName,
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        externals: [
            /^tslib.*$/,
            /^@michaelcoxon\/.*$/
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                                //plugins: ['@babel/plugin-transform-runtime']
                            }
                        },
                        'awesome-typescript-loader?configFileName=./src/config/esnext/tsconfig.json'
                    ]
                }
            ]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    sourceMap: true,
                    uglifyOptions: {
                        ecma: 5,
                        output: {
                            beautify: false,
                            comments: /^!/
                        },
                        /*mangle: {
                            properties: {
                                regex: /^_/
                            }
                        }*/
                    }
                })
            ]
        },
        plugins: [
            new CheckerPlugin(),

            ...(isDevBuild
                ?
                [
                    // Plugins that apply in development builds only
                ]
                :
                [
                    // Plugins that apply in production builds only
                    new DtsBundlePlugin(),
                ])
        ]
    }];
}