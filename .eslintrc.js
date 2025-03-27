// module.exports = {
//   root: true,
//   extends: '@react-native',

// };

// module.exports = {
//   root: true,
//   extends: '@react-native',
//   rules: {
//     '@typescript-eslint/no-unused-vars': [
//       'warn',
//       {vars: 'all', args: 'after-used', ignoreRestSiblings: true},
//     ],
//   },
// };


module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {vars: 'all', args: 'after-used', ignoreRestSiblings: true},
    ],
    'react-native/no-inline-styles': 'off', // Disable inline styles warning
  },
};
