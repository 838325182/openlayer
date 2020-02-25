<template>
<div class="block" style="float: left; ">
    <el-date-picker
      v-model="timeValue"
      type="date"
      value-format="yyyyMMdd"
      placeholder="选择日期"
      :picker-options="pickerOptions"
      @change="toParent"
    >
    </el-date-picker>
</div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timeValue: ""
    };
  },
  methods: {
    toParent(){
      // console.log(timeValue);
      this.$emit('changeDate',this.timeValue)
    }
  }
};
</script>

<style scoped></style>
