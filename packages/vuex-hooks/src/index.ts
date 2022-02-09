/*
 * @Description:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2022-02-09 16:56:48
 */
import { computed } from 'vue'
import {
  useStore,
  mapState,
  mapActions,
  mapGetters,
  createNamespacedHelpers,
} from 'vuex'

enum MAPPER_TYPE {
  STATE = 'mapState',
  ACTION = 'mapActions',
  GETTER = 'mapGetters',
}

export type MapperKeys = Array<string>
export type MapperHandler = typeof mapState &
  typeof mapGetters &
  typeof mapActions
export type UseMapper = (
  mapper: MapperKeys,
  mapperHandler: MapperHandler
) => MapperHandler

const useStateMapper: UseMapper = (mapper, mapperHandler) => {
  const store = useStore()
  const targetState = mapperHandler(mapper)
  const storeState: any = {}
  Object.keys(targetState).forEach((key) => {
    const fn = targetState[key].bind({ $store: store })
    storeState[key] = computed(fn)
  })
  return storeState
}

const useActionMapper: UseMapper = (mapper, mapperHandler) => {
  const store = useStore()
  const targetAction = mapperHandler(mapper)
  const storeAction: any = {}
  Object.keys(targetAction).forEach((key) => {
    storeAction[key] = targetAction[key].bind({ $store: store })
  })
  return storeAction
}

function checkType(data: string) {
  return Object.prototype.toString.call(data)
}

function useMapper(moduleName: string, mapper: MapperKeys, type: MAPPER_TYPE) {
  let mapperHandler =
    type === MAPPER_TYPE.GETTER
      ? mapGetters
      : type === MAPPER_TYPE.ACTION
      ? mapActions
      : mapState
  if (checkType(moduleName) === '[object String]' && moduleName.length > 0) {
    mapperHandler = createNamespacedHelpers(moduleName)[type]
  }
  const typeHandler =
    type === MAPPER_TYPE.ACTION ? useActionMapper : useStateMapper
  return typeHandler(mapper, mapperHandler)
}

export function useState(moduleName: string, mapper: MapperKeys) {
  return useMapper(moduleName, mapper, MAPPER_TYPE.STATE)
}
export function useGetters(moduleName: string, mapper: MapperKeys) {
  return useMapper(moduleName, mapper, MAPPER_TYPE.GETTER)
}
export function useActions(moduleName: string, mapper: MapperKeys) {
  return useMapper(moduleName, mapper, MAPPER_TYPE.ACTION)
}
