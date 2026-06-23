<script setup>
defineProps({
    movie: { type: Object, required: true },
    showDetail: { type: Boolean, default: false }
});

defineEmits(['toggle-favorite']);
</script>

<template>
    <div class="movie-card">
        <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="poster"
        />
        <div v-else class="poster-placeholder">이미지 준비 중</div>
        <div class="card-content">
            <h3 class="title">{{ movie.title }}</h3>
            <p class="release-date" v-if="showDetail && movie.release_date">개봉일: {{ movie.release_date }}</p>
            <p class="rating">⭐ {{ movie.vote_average.toFixed(1) }} / 10</p>
            <p class="overview" v-if="showDetail">
                {{ movie.overview ? movie.overview.substring(0, 60) + '...' : '국내에 등록된 줄거리 요약 정보가 없습니다.' }}
            </p>
            <button
                @click="$emit('toggle-favorite', movie.id)"
                :class="{ active: movie.isFavorite }"
                class="fav-btn"
            > {{ movie.isFavorite ? '♥️ 찜 해제' : '🤍 찜하기' }}
            </button>
        </div>
        <RouterLink
         :to="`/movies/${movie.id}`"
         class="stretched-link"
         :aria-label="`${movie.title} 상세 정보 보기`"
        ></RouterLink>
    </div>
</template>

<style scoped>
    .movie-card {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        background: white;
        text-align: left;
        box-shadow: 0 4px 15px rgba(0,0.05);
        transition: transform 0.2s ease;
        display: flex;
        flex-direction: column;
    }
    .movie-card:hover {
        transform: translateY(-5px);
    }
    .poster {
        width: 100%;
        height: 380px;
        object-fit: cover;
    }
    .poster-placeholder {
        width: 100%;
        height: 380px;
        background-color: #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #7f8c8d;
        font-weight: bold;
    }
    .card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .title {
        font-size: 18px;
        color: #333;
        margin: 0 0 6px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
    }
    .release-date {
        font-size: 13px;
        color: #7f8c8d;
        margin-bottom: 10px;
        font-weight: 500;
    }
    .rating {
        font-weight: bold;
        color: #f39c12;
        margin-bottom: 10px;
        font-size: 16px;
    }
    .overview {
        font-size: 13px;
        color: #555;
        line-height: 1.4;
        margin-bottom: 20px;
        flex-grow: 1;
    }
    .fav-btn {
        position: relative;
        z-index: 2;
        width: 100%;
        padding: 12px;
        cursor: pointer;
        border: none;
        background: #ecf0f1;
        color: #333;
        border-radius: 8px;
        font-weight: bold;
        font-size: 14px;
        transition: 0.3s;
        margin-top: auto;
    }
    .fav-btn.active {
        background: #ff4757;
        color: white;
    }
    .stretched-link {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
    }
</style>