module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!axios).+\.js$"
  ],
  moduleNameMapper: {
    "^axios$": "<rootDir>/node_modules/axios/dist/axios.js"
  }
};