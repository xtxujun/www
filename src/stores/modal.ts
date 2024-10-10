import { getCommonProps } from '@/utils'

export type ActionType = 'add' | 'update'
export type ActionTarget = 'cate' | 'group' | 'site'

const ACTION_NAME = {
  add: () => t('common.add'),
  update: () => t('common.edit'),
}
const TARGET_NAME = {
  cate: () => t('common.cate'),
  group: () => t('common.group'),
  site: () => t('common.site'),
}
export const useModalStore = defineStore('modal', () => {
  const modalVisible = ref(false)
  const action = ref<ActionType>('add')
  const target = ref<ActionTarget>('site')
  const title = computed(() => ACTION_NAME[action.value]() + TARGET_NAME[target.value]())

  const siteStore = useSiteStore()
  const inputValues = reactive({
    name: '',
    url: '',
    favicon: '',
    desc: '',
  })

  function showModal(actionType: ActionType, actionTarget: ActionTarget, groupIndex = -1, siteIndex = -1) {
    action.value = actionType
    target.value = actionTarget
    if (groupIndex !== -1)
      siteStore.setGroupIndex(groupIndex)
    if (siteIndex !== -1)
      siteStore.setSiteIndex(siteIndex)
    modalVisible.value = true
    // init inputs
    if (actionType === 'update') {
      const updateTarget = {
        site: () => getCommonProps(inputValues, siteStore.data[siteStore.cateIndex].groupList[groupIndex].siteList[siteIndex]),
        group: () => getCommonProps(inputValues, siteStore.data[siteStore.cateIndex].groupList[groupIndex]),
        cate: () => getCommonProps(inputValues, siteStore.data[siteStore.cateIndex]),
      }
      Object.assign(inputValues, updateTarget[actionTarget]())
    }
  }

  let now = 0
  const commitHandler = {
    add: {
      site: () => siteStore.addSite({ id: now, ...inputValues }),
      group: () => siteStore.addGroup({ id: now, name: inputValues.name, siteList: [] }),
      cate: () => siteStore.addCate({ id: now, name: inputValues.name, groupList: [] }),
    },
    update: {
      site: () => siteStore.updateSite({ ...inputValues }),
      group: () => siteStore.updateGroup({ name: inputValues.name }),
      cate: () => siteStore.updateCate({ name: inputValues.name }),
    },
  }
  const deleteHandler = {
    site: () => siteStore.deleteSite(),
    group: () => siteStore.deleteGroup(),
    cate: () => siteStore.deleteCate(),
  }
  function handleCancel() {
    modalVisible.value = false
  }
  let isCommit = false

  function handleCommit() {
    if (isCommit)
      return
    if (!handleCustomize())
      return

    isCommit = true
    nextTick(() => {
      now = Date.now()
      commitHandler[action.value][target.value]()
      modalVisible.value = false
      setTimeout(() => isCommit = false, 1000)
    })
  }
  function handleDelete() {
    if (!handleCustomize())
      return
    nextTick(() => {
      deleteHandler[target.value]()
      modalVisible.value = false
      // If delete a cate, cateIndex--
      if (target.value === 'cate' && siteStore.cateIndex > 0)
        siteStore.setCateIndex(siteStore.cateIndex - 1)
    })
  }

  function clearInput() {
    let key: keyof typeof inputValues
    for (key in inputValues) inputValues[key] = ''
  }

  return {
    modalVisible,
    action,
    target,
    title,
    inputValues,
    showModal,
    handleCancel,
    handleCommit,
    handleDelete,
    clearInput,
  }
})
