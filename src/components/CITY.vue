<template>
  <el-form>
    <el-form-item label="城市目录">
      <el-cascader
        :options="options"
        change-on-select
        v-model="form.workarea"
        expand-trigger="hover"
        @change="handleChange"
        class="wd400"
      >
      </el-cascader>
    </el-form-item>
  </el-form>
</template>

<script>
import areajson from '@/config/select_area.js';

export default {
  data() {
    return {
      options: areajson, //调用外部js文件的json数据
      workarea: ['510000', '510100', '510101'], //自定义默认值 填写对应的value值
      options5:[
        {label: '@qq.com',value: '@qq.com'},
        {label: '@sina.com',value: '@sina.com',disabled: true},
        {label: '@136.com',value: '@136.com'},
        {label: '@189.com',value: '@189.com'}
      ]
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>
