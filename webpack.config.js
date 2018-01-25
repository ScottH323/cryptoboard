const webpack = require('webpack');
const path    = require('path');
const glob    = require('glob');

const UglifyJSPlugin          = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin       = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin      = require('clean-webpack-plugin');
const CopyWebpackPlugin       = require('copy-webpack-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const autoprefixer            = require('autoprefixer');


// Production flat
let inProduction = (process.env.NODE_ENV === 'production');

// Load in the config file
let config = require(`./${((inProduction) ? 'prod' : 'dev')}.config`);

function packageSort(packages) {
    return function sort(left, right) {
        var leftIndex  = packages.indexOf(left.names[0]);
        var rightindex = packages.indexOf(right.names[0]);

        if (leftIndex < 0 || rightindex < 0) {
            throw "unknown package";
        }

        if (leftIndex > rightindex) {
            return 1;
        }

        return -1;
    }
};

/**
 * Module
 */
module.exports = {
    resolve: {
        alias: {
            vue: 'vue/dist/vue',
        },
    },
    entry: {
        app: './src/app.js',
        vendor: ['vue', 'vue-router', 'axios', 'bootstrap-vue', 'moment',
            'vee-validate', 'vue-sweetalert', 'vue-toasted'],
    },
    output: {
        path: path.join(__dirname, '/public'),
        filename: ((inProduction) ? '[name].[chunkhash].js' : '[name].js'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-0']
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                // exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "node_modules/bootstrap")
                ],
                options: {
                    postcss: [
                        autoprefixer({
                            cascade: false,
                            browsers: ['> 0%']
                        })
                    ],
                    loaders: {
                        stylus: ExtractTextPlugin.extract({
                            loader: ['css-loader', 'stylus-loader'],
                            fallbackLoader: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
            },
            {
                test: /\.worker\.js$/,
                use: {loader: 'worker-loader', options: {inline: true}}
            }
        ]
    },
    plugins: [

        /**
         * Put vue into prod mode
         */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        }),

        /**
         * Chunk
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: ((inProduction) ? 'vendor-[chunkhash].js' : 'vendor.js'),
        }),

        /**
         * Clean out Dist dir
         */
        new CleanWebpackPlugin(['public'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),

        /**
         * Move project stuff
         */
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/assets/img', to: __dirname + '/public/img'
            }
        ]),

        /**
         * Extract all of the stylus out into this CSS file
         */
        new ExtractTextPlugin(((inProduction) ? '[name].[chunkhash].css' : '[name].css')),

        /**
         * Inject files into HTML
         */
        new HtmlWebpackPlugin({
            filename: __dirname + '/public/index.html',
            template: __dirname + '/src/index.html',
            chunksSortMode: packageSort(['vendor', 'app'])
        }),

    ],
    devServer: {
        contentBase: ('./public'),
        historyApiFallback: true
    },
};

/**
 * NON Producton mode
 */
if (!inProduction) {
    module.exports.devtool = 'source-map'
}

/**
 * Producton mode
 */
if (inProduction) {

    // Uglify
    module.exports.plugins.push(
        new UglifyJSPlugin(),
        new OptimizeCssAssetsPlugin()
    );

    // Use prod version of vue
    module.exports.resolve.alias.vue = 'vue/dist/vue.min';

}
