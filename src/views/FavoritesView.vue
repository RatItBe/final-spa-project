<script setup>
import { useMovieStore } from '@/stores/movieStore';
import MovieCard from '@/components/MovieCard.vue';

const store = useMovieStore();
</script>

<template>
    <main class="page">
        <div class="header-section">
            <h1>❤️ 찜한 영화</h1>
            <p class="sub-title">내가 찜한 작품 모아보기</p>
        </div>
        <div v-if="store.favorites.length === 0" class="status-message empty">
            아직 찜한 영화가 없습니다. 🍿
        </div>
        <div v-else class="movie-list">
            <MovieCard
                v-for="movie in store.sortedFavorites"
                :key="movie.id"
                :movie="movie"
                @toggle-favorite="store.toggleFavorite"
            />
        </div>
    </main>
</template>

<style scoped>
    .page {
        padding: 40px;
        background-color: #f8f9fa;
        min-height: 100vh;
    }
    .header-section {
        margin-bottom: 30px;
        text-align: center;
        color: #2c3e50;
    }
    .sub-title {
        font-size: 14px;
        color: #7f8c8d;
        margin-top: 5px;
    }
    .status-message {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        padding: 50px;
        border-radius: 12px;
    }
    .empty {
        color: #7f8c8d;
        background-color: #ecf0f1;
    }

    .movie-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 30px;
    }
</style>