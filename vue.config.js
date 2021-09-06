// const path = require("path");
module.exports = {
  css: {
    loaderOptions: {
      // 注意这里写sass可以同时对sass，scss生效
      sass: {
        // additionalData 是sass-loader v9及以后的写法,  v8的写法是prependData，v7及以前是data
        additionalData: `@import "~@/styles/variables.scss";`
      }
    }
  }
};
