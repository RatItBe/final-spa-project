<script setup>
import { onMounted } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import SortBar from '@/components/SortBar.vue';
import MovieCard from '@/components/MovieCard.vue';

const store = useMovieStore();

onMounted(() => {
    if (store.allMovies.length === 0) {
        store.fetchAllMoviesForSearch();
    }
});
</script>

<template>
    <main class="page">
        <div class="header-section">
            <h1>🔍 검색 결과</h1>
            <p class="sub-title" v-if="store.searchKeyword !== ''">'{{ store.searchKeyword }}'에 대한 검색 결과입니다</p>
        </div>
        <SortBar
            v-if="store.searchResults.length > 0"
            :sort-key="store.sortKey"
            @update:sort-key="store.sortKey = $event"
        />
        <div v-if="store.searchKeyword === ''" class="status-message empty">
            검색어를 입력해 원하는 영화를 찾아보세요. 🔍
        </div>
        <div v-else-if="store.searchResults.length === 0" class="status-message empty">
            일치하는 영화가 없습니다.
        </div>
        <div v-else class="movie-list">
            <MovieCard
                v-for="movie in store.searchResults"
                :key="movie.id"
                :movie="movie"
                :is-favorite="store.favorites.some(f => f.id === movie.id)"
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