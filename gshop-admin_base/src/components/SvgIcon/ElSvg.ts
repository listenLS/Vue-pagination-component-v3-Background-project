import type { App} from 'vue'
import * as svg from '@element-plus/icons-vue';
import SvgIcon from '@/components/SvgIcon/index.vue'

export default function (app: App) {
  app.component('svg-icon', SvgIcon)

  // import.meta.glob('./svg/*.svg')
  // import.meta.globEager('./svg/*.svg')

  const icons = svg as any;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
	app.component('SvgIcon', SvgIcon);
}



