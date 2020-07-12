let path = require("path");

module.exports = {
    plugins: {
      "cssnano": {}
    },
    module: {
        rules: [
            {
                test: /\.css?$/,
                exclude: [
                path.resolve(__dirname,"assets/css/materialize")
             ],
                use: [
                    'to-string-loader',
                    'css-loader',

                ],
                loader: "babel-loader"

            },
        ]
    }
}
