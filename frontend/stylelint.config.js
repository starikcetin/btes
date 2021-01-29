module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-config-recess-order',
  ],
  plugins: [],
  rules: {
    'order/properties-alphabetical-order': null, // conflicts with recess-order
    'max-nesting-depth': null, // nesting is not a bad thing
    'selector-max-id': null, // too intrusive
  },
};
