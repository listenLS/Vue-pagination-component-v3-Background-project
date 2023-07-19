import {defineComponent} from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default defineComponent({
  name: 'Item',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    // console.log('---', context.slots)
    // console.log('---', <span slot="title">{props.title}</span>)
    return ()=> (
      <>
        {props.icon && <SvgIcon name={props.icon}></SvgIcon>}

        {props.title && <span v-slots={{title: (data: any) => {
          console.log('--------', data)
        }}}>{props.title}</span>}
      </>
    )
  }
})
