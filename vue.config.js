const { defineConfig } = require("@vue/cli-service");
const WebpackAssetsManifest = require("webpack-assets-manifest");

module.exports = defineConfig({
  transpileDependencies: ["quasar"],
  outputDir: "./dist/spa/",
  pluginOptions: {
    quasar: {
      importStrategy: "kebab",
      rtlSupport: false,
    },
  },
  configureWebpack: (config) => {
    config.plugins = config.plugins.concat(
      new WebpackAssetsManifest({
        output: "asset-manifest.json",
      })
    );
  },
});
