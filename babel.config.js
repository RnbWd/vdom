// babel.config.js
module.exports = {
  presets: [
    // Our default preset
    'poi/babel',
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h', // default pragma is React.createElement
        pragmaFrag: 'hFrag', // default is React.Fragment
        throwIfNamespace: false, // defaults to true
      },
    ],
  ],
}
