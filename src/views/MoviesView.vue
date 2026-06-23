<script setup>
import { onMounted } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import SortBar from '@/components/SortBar.vue';
import MovieCard from '@/components/MovieCard.vue';

const store = useMovieStore();

onMounted(() => {
    store.fetchMovies();
    store.fetchAllMoviesForSearch();
    document.title = '🍿 국내 극장 화제작 (인기순)';
});
</script>

<template>
    <main class="page">
        <div class="header-section">
            <h1>🍿 국내 극장 화제작 (인기순)</h1>
            <p class="sub-title">2025년 이후 국내 정식 개봉한 실시간 인기 상영작</p>
        </div>
        <SortBar :sort-key="store.sortKey" @update:sort-key="store.sortKey = $event" />
        <div v-if="store.isLoading" class="status-message loading">
            ⌛ 실시간 국내 개봉작 데이터를 싣고 오는 중입니다...
        </div>
        <div v-else-if="store.errorMessage" class="status-message error">
            🚨 {{ store.errorMessage }}
        </div>
        <div v-else class="movie-list">
            <MovieCard
                v-for="movie in store.sortedMovies"
                :key="movie.id"
                :movie="movie"
                :show-detail="true"
                :is-favorite="store.favorites.some(f => f.id === movie.id)"
                @toggle-favorite="store.toggleFavorite"
            />
        </div>
        <div class="pagination">
            <button @click="store.goPage(store.currentPage - 1)" :disabled="store.currentPage <= 1">< 이전</button>
            <span class="page-text">{{ store.currentPage }} / {{ store.totalPages }}</span>
            <button @click="store.goPage(store.currentPage + 1)" :disabled="store.currentPage >= store.totalPages">다음 ></button>
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
    .loading {
        color: #3498db;
        background-color: #e3f2fd;
    }
    .error {
        color: #e74c3c;
        background-color: #fdeaea;
    }

    .movie-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 30px;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        margin-top: 30px;
    }
    .pagination button {
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 20px;
        background: white;
        color: #555;
        font-weight: bold;
        cursor: pointer;
    }
    .pagination button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .page-text {
        font-weight: bold;
        color: #2c3e50;
    }
</style>