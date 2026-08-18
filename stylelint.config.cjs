module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  ignoreFiles: ['src/grindurus-frontend/src/typechain-types/**/*.ts'],
  rules: {
    'media-feature-name-no-unknown': [true, {
      ignoreMediaFeatureNames: ['max-width', 'min-width']
    }],
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-range-notation': null,
  },
}
