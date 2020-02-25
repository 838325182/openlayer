<template>
  <div class="block" style="float: left; ">
    <el-select v-model="freq" clearable placeholder="选择频率" 
      style="width:120px"
      @change="toParentFreq">
      <el-option
        v-for="item in optionsFreq"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="indoor" clearable placeholder="室内外" 
      style="width:120px"
      @change="toParentIndoor">
      <el-option
        v-for="item in optionsIndoor"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionsFreq: [{
          value: '800M',
          label: '800M'
        }, {
          value: '1.8G',
          label: '1.8G'
        }, {
          value: '2.1G',
          label: '2.1G'
        }
      ],
      freq: '',
      optionsIndoor: [{
          value: '1',
          label: '室内'
        }, {
          value: '0',
          label: '室外'
        }
      ],
      indoor: '',
    };
  },
  methods: {
    toParentIndoor(){
      // console.log(timeValue);
      this.$emit('changeValue',this.indoor)
    },
    toParentFreq(){
      // console.log(timeValue);
      this.$emit('changeValue',this.freq)
    }
  }
};
</script>

<style scoped></style>
