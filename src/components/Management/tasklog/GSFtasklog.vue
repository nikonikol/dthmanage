
<template>

    <div>
        <iframe src="http://101.37.83.223:7007/job-console/" id="mobsf" scrolling="yes" frameborder="0" style="position:absolute;top:63px;left: 249px;right:0px;bottom:100px;"></iframe>
    </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  created() {},
  mounted() {
                function changeMobsfIframe(){
                const mobsf = document.getElementById('mobsf');
                const deviceWidth = document.body.clientWidth;
                const deviceHeight = document.body.clientHeight;
                mobsf.style.width = (Number(deviceWidth)-250) + 'px'; //数字是页面布局宽度差值
                mobsf.style.height = (Number(deviceHeight)-64) + 'px'; //数字是页面布局高度差
            }

            changeMobsfIframe()

            window.onresize = function(){
                changeMobsfIframe()
            }
  },
  methods: {
  
  }
};
</script>

<style scoped>

</style>

