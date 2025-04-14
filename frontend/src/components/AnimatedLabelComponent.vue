<script setup lang="ts">
import { CSSProperties, computed, onMounted, ref } from 'vue';

interface Word {
  text: string;
  textColor: string;
  backgroundColor: string;
}

const words: Word[] = [
  {
    text: 'умная',
    textColor: '#ea4335',
    backgroundColor: '#fce8e6'
  },
  {
    text: 'полезная',
    textColor: '#1967d2',
    backgroundColor: '#e8f0fe'
  },
  {
    text: 'быстрая',
    textColor: '#188038',
    backgroundColor: '#ceead6'
  }
];

const displayedText = ref('');
const currentWordIndex = ref(0);
const isDeleting = ref(false);
const typingSpeed = ref(150);

const currentWord = computed(() => words[currentWordIndex.value]);

const currentStyle = computed<CSSProperties>(() => ({
  color: currentWord.value.textColor,
  backgroundColor: currentWord.value.backgroundColor,
  padding: '20px 40px',
  paddingRight: '30px',
  borderRadius: '50px',
  display: 'inline-block',
  minWidth: '30px',
  lineHeight: '40px',
  textAlign: 'center' as CSSProperties['textAlign'],
  transition: 'background-color 0.5s ease'
}));

const type = () => {
  const fullText = currentWord.value.text;

  if (isDeleting.value) {
    displayedText.value = fullText.substring(0, displayedText.value.length - 1);
    typingSpeed.value = 75;
  } else {
    displayedText.value = fullText.substring(0, displayedText.value.length + 1);
    typingSpeed.value = 150;
  }

  if (!isDeleting.value && displayedText.value === fullText) {
    typingSpeed.value = 1500;
    isDeleting.value = true;
  } else if (isDeleting.value && displayedText.value === '') {
    isDeleting.value = false;
    currentWordIndex.value = (currentWordIndex.value + 1) % words.length;
    typingSpeed.value = 500;
  }

  setTimeout(type, typingSpeed.value);
};

onMounted(() => {
  type();
});
</script>

<template>
  <div class="text-container">
    <h1 class="top-h">По-настоящему</h1>
    <h1 class="bot-h">
      <span
        :style="currentStyle"
        class="word-container"
      >
        {{ displayedText }}
        <span class="cursor">&nbsp;</span>
      </span>
      аналитика
    </h1>
  </div>
</template>

<style scoped lang="scss">
.top-h {
  margin-bottom: 0px;
  margin-top: 80px;
}

.bot-h {
  margin-top: 10px;
}

h1 {
  font-size: 4.5rem;
  line-height: 5.25rem;
  letter-spacing: -0.21875rem;
  font-weight: bold;
  position: relative;
  white-space: normal;
  display: flex;
  justify-content: center;

  .word-container {
    margin: 0 5px;
    display: flex;
    align-items: center;

    .cursor {
      display: inline-block;
      position: relative;
      width: 7px;
      height: 50px;
      background-color: currentColor;
      animation: blink 1s infinite;
      left: -6px;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
