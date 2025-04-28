<template>
    <div class="main-place">
        <div class="no-cards">
            <img src="/public/neko01.png" alt="404 Not Found" class="no-cards-image">
            <div class="no-cards-text card-description">
                <p>抱歉，您访问的页面不存在</p>
                <p>您可以点击侧边栏 “<img src="/waterfalls.svg" alt="Edit Icon" class="icon1" />主页” 按钮返回主页, 或检查URL是否正确</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style scoped>
.main-place {
    width: 1200px;
    padding: 50px;
    background-color: rgba(180, 180, 180, 0);
    position: absolute;
    top: 6%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1;
}

.no-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

.no-cards-image {
    width: 150px;
    height: auto;
    margin-bottom: 20px;
    filter: grayscale(30%);
    opacity: 0.5;
}

.no-cards-text p {
    font-size: 16px;
    color: #636363;
    opacity: 0.5;
    font-weight: bold;
    user-select: none;
}

.icon1 {
    width: 20px;
    height: 20px;
    margin-bottom: -4px;
    filter: brightness(3) invert(1);
}
</style>