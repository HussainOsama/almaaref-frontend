module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // "nativewind/babel", // enable later after confirming build
      "react-native-reanimated/plugin",
    ],
  };
};
