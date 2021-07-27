<!--
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-07-19 17:11:12
-->

# @otools/el-description

> el-description

## Install

```bash
npm i @otools/el-description
```

## Usage

```js
import { ElDescription, ElDescriptionItem } from '@otools/el-description'

Vue.use(ElDescription)
Vue.use(ElDescriptionItem)
```

## Attributes

### Description

| 参数       | 说明                                                   | 类型          | 默认值  | 可选值 | 示例        |
| ---------- | ------------------------------------------------------ | ------------- | ------- | ------ | ----------- |
| data       | 数据源(动态数据必传,为了监听数据重绘,非动态数据可不传) | object        | {}      | -      | -           |
| title      | 描述列表的标题,显示在最顶部                            | string/vnode  | -       | -      | -           |
| margin     | 组件边距                                               | string        | -       | -      | '10px 20px' |
| column     | 显示行数                                               | number/string | 3       | -      | 2           |
| size       | 设置列表的大小,可以设置为 small                        | string        | default | small  | -           |
| labelWidth | Descltem 的 label 宽度                                 | string        | 120px   | -      | -           |

### Description Item

| 参数  | 说明             | 类型         | 默认值 | 可选值 | 示例 |
| ----- | ---------------- | ------------ | ------ | ------ | ---- |
| label | 内容的描述(必传) | string/vnode | -      | -      | -    |
| span  | 所占的格数       | number       | 1      | -      | 2    |

### Description Item Slot

| 参数    | 说明                 | 类型         | 默认值 | 可选值 | 示例 |
| ------- | -------------------- | ------------ | ------ | ------ | ---- |
| default | 仅支持纯文本的插槽   | string       | -      | -      | -    |
| content | 支持纯文本、dom 插槽 | string/vnode | -      | -      | -    |
