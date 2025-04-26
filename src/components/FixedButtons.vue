<template>
    <div class="fixed-buttons" :style="fixedButtonsStyle">
        <transition name="fade">
            <button v-show="showScrollToTopButton" class="button" @click="scrollToTop"><img src="/to-top.svg"
                    alt="To-top Icon" class="icon" /></button>
        </transition>
        <button v-if="filteredCards.length > 0" class="button" @click="toggleMenu">
            <img src="/map.svg" alt="Map Icon" class="icon" />
        </button>
        <transition name="fade">
            <div v-if="showMenu" class="dropdown-menu">
                <button v-for="(card, index) in filteredCards" :key="index" class="dropdown-item"
                    @click="scrollToCard(index)">
                    {{ getFirstEmoji(card.content) }}
                </button>
            </div>
        </transition>
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';

export default {
    props: {
        mainPlaceRef: {
            type: Object,
            required: true,
        },
        cards: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const showMenu = ref(false);
        const fixedButtonsStyle = ref({});
        const showScrollToTopButton = ref(false);

        const toggleMenu = () => {
            showMenu.value = !showMenu.value;
        };

        const scrollToCard = (index) => {
            const cardElements = document.querySelectorAll('.card');
            const filteredCardIndices = filteredCards.value.map(card => props.cards.indexOf(card));
            const targetIndex = filteredCardIndices[index];
            if (cardElements.length > targetIndex) {
                cardElements[targetIndex].scrollIntoView({ behavior: 'smooth' });
                showMenu.value = false;
            }
        };

        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const updatePosition = () => {
            if (props.mainPlaceRef) {
                const mainPlaceRect = props.mainPlaceRef.getBoundingClientRect();
                fixedButtonsStyle.value = {
                    right: `${window.innerWidth - mainPlaceRect.right - 60}px`,
                    bottom: `85px`,
                };
            }
        };

        const handleScroll = () => {
            showScrollToTopButton.value = window.scrollY > 300; 
        };

        const getFirstEmoji = (content) => {
            const firstLine = content.split('\n')[0];
            const emojiRegex = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/;
            const match = firstLine.match(emojiRegex);
            return match ? match[0] : null;
        };

        const filteredCards = computed(() => {
            return props.cards.filter(card => getFirstEmoji(card.content) !== null);
        });

        onMounted(() => {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', handleScroll);
            handleScroll(); 
        });

        watch(
            () => props.mainPlaceRef,
            () => {
                updatePosition();
            }
        );

        return {
            showMenu,
            fixedButtonsStyle,
            showScrollToTopButton,
            toggleMenu,
            scrollToCard,
            scrollToTop,
            getFirstEmoji,
            filteredCards,
        };
    },
};
</script>

<style scoped>
.fixed-buttons {
    position: fixed; 
    bottom: 20px;
    right: 20px; 
    display: flex;
    flex-direction: column;
    z-index: 1000;
   
}

.button {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background-image: linear-gradient(0deg, #eedde0 0%, #d7e6fc 95%, #d3e2f8 100%);
    color: rgb(0, 0, 0);
    border: 2px solid #ffffff;
    
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.20);
    break-inside: avoid;
    margin-bottom: 20px;
    opacity: 1;
    
}

.button.fade-enter-active,
.button.fade-leave-active {
    transition: opacity 0.3s ease;
}

.button.fade-enter-from,
.button.fade-leave-to {
    opacity: 0;
   
}

.button:hover {
    background-image: linear-gradient(0deg, #f4d5da 0%, #c3d8f7 99%, #b6d2f8 100%);
    border-color: #0199ff;
    
}

.dropdown-menu {
    position: absolute;
    width: 58px;
    bottom: 80px;
    left: -5px;
    background-color: rgba(255, 255, 255, 0.6);
    border: 2px solid rgba(137, 137, 137, 0.6);
    box-shadow: none;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1001;
    padding: 2px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(7.5px);
}

.dropdown-menu::-webkit-scrollbar {
    display: none;
}

.dropdown-item {
    width: 100%;
    height: 50px;
    border-radius: 12px;
    background-image: linear-gradient(0deg, #e2e2e2 0%, #d1d1d1 99%, #ababab 100%);
    color: rgb(0, 0, 0);
    border: 2px solid #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;

    margin-bottom: 10px;
    opacity: 1;
    font-size: 24px;
}

.dropdown-item:hover {
    background-image: linear-gradient(0deg, #eeeeee 0%, #dfdfdf 99%, #a7a7a7 100%);
    border-color: #909090;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.icon {
    width: 75%;
    height: 75%;
    filter: brightness(2.5) invert(1);
    object-fit: contain; 
}
</style>