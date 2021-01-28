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

/*
 * TODO: maybe integrate with prettier in the future. options:
 * https://github.com/prettier/stylelint-prettier     -->  conflicts with the the ordering plugin
 * https://github.com/hugomrdias/prettier-stylelint   -->  is the entry point, has a different ignore schema and cli
 */
