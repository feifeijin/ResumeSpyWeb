import { defineComponent } from 'vue'

export const VBtnStub = defineComponent({
  name: 'VBtn',
  emits: ['click'],
  template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
})

export const VListItemStub = defineComponent({
  name: 'VListItem',
  emits: ['click'],
  template: '<div role="button" @click="$emit(\'click\')"><slot /><slot name="prepend" /></div>',
})

export const VSnackbarStub = defineComponent({
  name: 'VSnackbar',
  props: {
    modelValue: { type: Boolean, default: true },
    color: { type: String, default: '' },
    timeout: { type: Number, default: 5000 },
    multiLine: { type: Boolean, default: false },
    vertical: { type: Boolean, default: false },
  },
  emits: ['update:model-value'],
  template:
    '<div class="v-snackbar-stub">' +
    '<slot />' +
    '<slot name="actions" />' +
    '<button class="close-snackbar" type="button" @click="$emit(\'update:model-value\', false)">close</button>' +
    '</div>',
})

export const commonVuetifyStubs = {
  VOverlay: defineComponent({ name: 'VOverlay', template: '<div><slot /></div>' }),
  VCard: defineComponent({ name: 'VCard', template: '<div><slot /></div>' }),
  VProgressCircular: defineComponent({
    name: 'VProgressCircular',
    template: '<div><slot /></div>',
  }),
  VIcon: defineComponent({ name: 'VIcon', template: '<i><slot /></i>' }),
  VMenu: defineComponent({
    name: 'VMenu',
    template: '<div><slot name="activator" :props="{}" /><slot /></div>',
  }),
  VList: defineComponent({ name: 'VList', template: '<div><slot /></div>' }),
  VListItem: VListItemStub,
  VListItemTitle: defineComponent({ name: 'VListItemTitle', template: '<span><slot /></span>' }),
  VBtn: VBtnStub,
  VDialog: defineComponent({ name: 'VDialog', template: '<div><slot /></div>' }),
  VCardTitle: defineComponent({ name: 'VCardTitle', template: '<div><slot /></div>' }),
  VCardText: defineComponent({ name: 'VCardText', template: '<div><slot /></div>' }),
  VCardActions: defineComponent({ name: 'VCardActions', template: '<div><slot /></div>' }),
  VNavigationDrawer: defineComponent({
    name: 'VNavigationDrawer',
    template: '<aside><slot /></aside>',
  }),
  VDivider: defineComponent({ name: 'VDivider', template: '<hr />' }),
  VAppBar: defineComponent({
    name: 'VAppBar',
    template: '<header><slot name="title" /><slot name="append" /><slot /></header>',
  }),
  VFooter: defineComponent({ name: 'VFooter', template: '<footer><slot /></footer>' }),
  VSheet: defineComponent({ name: 'VSheet', template: '<section><slot /></section>' }),
  VContainer: defineComponent({ name: 'VContainer', template: '<div><slot /></div>' }),
  VRow: defineComponent({ name: 'VRow', template: '<div><slot /></div>' }),
  VCol: defineComponent({ name: 'VCol', template: '<div><slot /></div>' }),
  VImg: defineComponent({ name: 'VImg', template: '<img alt="stub-image" />' }),
  VSnackbar: VSnackbarStub,
}
