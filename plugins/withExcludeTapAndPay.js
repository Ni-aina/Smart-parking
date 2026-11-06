const { withProjectBuildGradle } = require("expo/config-plugins");

const block = `
allprojects {
  configurations.all {
    exclude group: "com.google.android.gms", module: "play-services-tapandpay"
  }
}
`

const withExcludeTapAndPay = (config) =>
  withProjectBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes("play-services-tapandpay")) {
      cfg.modResults.contents += block
    }
    return cfg
  })

module.exports = withExcludeTapAndPay;