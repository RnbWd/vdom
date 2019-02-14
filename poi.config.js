module.exports = {
  entry: 'src/index',
  plugins: [
    {
      resolve: '@poi/plugin-karma'
    },
    {
      resolve: '@poi/plugin-typescript'
    }
  ]
}