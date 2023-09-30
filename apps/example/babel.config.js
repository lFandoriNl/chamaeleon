// eslint-disable-next-line no-undef
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  plugins: [['@babel/plugin-proposal-class-properties']],
  assumptions: {
    setPublicClassFields: false,
  },
};
