<template>
  <div class="footer">
    <div class="flex-row items-center section_7 pos_7" id="footer-logo">
      <div class="shrink-0 section_9"></div>
      <div>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>
      <span class="text ml-31">AI早报</span>
    </div>
    <div class="flex-col justify-start items-center text-wrapper" id="footer-edit-button">
      <span class="text_2">编辑模块</span>
    </div>
    <div class="flex-row items-center pos_8" id="footer-right">
      <img
        class="image_4"
        src="https://ide.code.fun/api/image?token=6801b58c4ae84d00122d6e36&name=b9f875e28fc4109de403e9051be74f89.png"
        id="footer-downline-icon"
      />
      <img
        class="ml-30 image_5"
        src="https://ide.code.fun/api/image?token=6801b58c4ae84d00122d6e36&name=776e058c68516c5d43cf8005ad87a918.png"
        id="footer-history-icon"
      />
      <img
        class="ml-30 image_3"
        src="https://ide.code.fun/api/image?token=6801b58c4ae84d00122d6e36&name=5250b1f98977f402158c028d1795c517.png"
        id="footer-setting-icon"
      />
      <div class="ml-30 section_8" id="footer-profile"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.footer {
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 50px;
  opacity: 1;
  background: rgba(255, 255, 255, 0.6); /* 半透明背景 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px); /* 毛玻璃效果 */
  z-index: 10; /* 确保 footer 在页面最上层 */
}

/* logo */
.section_7 {
  padding: 0.5rem 0.88rem;
  background-color: #53535300;
  border-radius: 0.94rem;
}

.pos_7 {
  position: absolute;
  left: 1.13rem;
  top: 50%;
  transform: translateY(-50%);
}

.section_9 {
  background-color: #dedede;
  border-radius: 0.5rem;
  width: 1.94rem;
  height: 1.94rem;
}

.text {
  margin-right: 0.38rem;
  color: #000000;
  font-size: 0.95rem;
  font-family: SourceHanSansCN;
  line-height: 0.92rem;
  letter-spacing: 0.13rem;
}

/* 右侧 */
.pos_8 {
  position: absolute;
  right: 1.42rem;
  top: 50%;
  transform: translateY(-50%);
}

.image_4 {
  width: 0.75rem;
  height: 0.75rem;
}

.image_5 {
  width: 0.81rem;
  height: 0.81rem;
}

.image_3 {
  width: 0.88rem;
  height: 0.94rem;
}

.section_8 {
  background-color: #e3e3e3;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.22rem;
}

/* 编辑模块 */
.text-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 0.5rem 0;
  background-image: linear-gradient(0deg, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  border-radius: 0.75rem;
  width: 8.88rem;
  height: 1.94rem;
  border-left: solid 0.063rem #ffffff;
  border-right: solid 0.063rem #ffffff;
  border-top: solid 0.063rem #ffffff;
  border-bottom: solid 0.063rem #ffffff;
}

.text_2 {
  color: #636262;
  font-size: 0.75rem;
  font-family: SourceHanSansCN;
  line-height: 0.7rem;
  letter-spacing: 0.13rem;
}
</style>