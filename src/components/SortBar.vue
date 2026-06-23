<script setup>
defineProps({
    sortKey: { type: String, required: true }
});

defineEmits(['update:sortKey']);

const options = [
    { value: 'popularity', label: '인기순' },
    { value: 'title', label: '제목순' },
    { value: 'release_date', label: '개봉일순' },
    { value: 'vote_average', label: '평점순' }
];
</script>

<template>
    <div class="sort-bar">
        <button
            v-for="opt in options"
            :key="opt.value"
            @click="$emit('update:sortKey', opt.value)"
            :class="{ active: sortKey === opt.value }"
        >{{ opt.label }}</button>
    </div>
</template>

<style scoped>
    .sort-bar {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    .sort-bar button {
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 20px;
        background: white;
        color: #555;
        font-weight: bold;
        cursor: pointer;
        transition: 0.2s;
    }
    .sort-bar button.active {
        background: #ff4757;
        color: white;
        border-color: #ff4757;
    }
</style>