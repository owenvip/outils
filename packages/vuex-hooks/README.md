<!--
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-07-28 11:25:14
-->

# @otools/vuex-hooks

> vue mapper hooks, you can use mapper functions in vue SFC easily

## Install

```bash
npm install @otools/vuex-hooks
```

## Usage

```js
<script setup>
import { useState, useActions, useGetters } from '@otools/vuex-hooks'

const storeState = useState(nameSpace, [key1, key2])
const storeActions = useActions(nameSpace, [key1, key2])
const storeGetters = useGetters(nameSpace, [key1, key2])

// ...
</script>
```
