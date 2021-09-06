# 前端脚手架

## 一些坑：

-   views 文件夹内的组件不要在 template 内第一行写注释, 其他地方都可以写 (不知道为什么会有这种问题)
    以下是错误示范:

```vue
<template>
    <!-- 不要在第一行写注释 -->
    <div><h1>test</h1></div>
</template>
```

-   views 文件夹的组件 template 内只能有一个 root 标签
