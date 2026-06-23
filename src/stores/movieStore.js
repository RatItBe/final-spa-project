import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import axios from "axios";

export const useMovieStore = defineStore('movie', () => {
    const movies = ref([]);
    const allMovies = ref([]);

    const favorites = ref(JSON.parse(sessionStorage.getItem('favorites')) || []);
    const searchKeyword = ref('');

    const isLoading = ref(false);
    const errorMessage = ref('');

    const selectedMovie = ref(null);

    const currentPage = ref(1);
    const totalPages = ref(1);

    const fetchMovies = async (page = 1) => {
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const API_KEY = '35f704e263e8d21a74ca56b802094634';
            
            const movieParams = {
                api_key: API_KEY,
                language: 'ko-KR',
                region: 'KR',
                sort_by: 'popularity.desc',
                include_adult: false,
                'release_date.gte': '2025-01-01',
                with_release_type: '2|3',
                page: page
            };

            const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                params: movieParams
            });

            const fetchedMovies = response.data.results;

            fetchedMovies.forEach(movie => {
                const isAlreadyFavorite = favorites.value.some(fav => fav.id === movie.id);
                movie.isFavorite = isAlreadyFavorite;
            });
            movies.value = fetchedMovies;
            totalPages.value = response.data.total_pages;
            currentPage.value = page;
        } catch (error) {
            console.error('API 통신 에러 상세 내역:', error);
            errorMessage.value = '영화 데이터를 불러오는 데 실패했습니다. 통신 상태나 API key를 확인해 주세요.';
        } finally {
            isLoading.value = false;
        }
    };

    const fetchAllMoviesForSearch = async () => {
        try {
            const API_KEY = '35f704e263e8d21a74ca56b802094634';
            const baseParams = {
                api_key: API_KEY,
                language: 'ko-KR',
                region: 'KR',
                sort_by: 'popularity.desc',
                include_adult: false,
                'release_date.gte': '2025-01-01',
                with_release_type: '2|3'
            };

            const collected = [];

            const firstResponse = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                params: { ...baseParams, page: 1 }
            });
            const totalPagesCount = firstResponse.data.total_pages;

            for (let page = 1; page <= totalPagesCount; page++) {
                const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
                    params: { ...baseParams, page }
                });
                collected.push(...response.data.results);
            }

            allMovies.value = collected;
        } catch (error) {
            console.error('전체 검색용 데이터 로딩 실패:', error);
        }
    };

    const fetchedMovieDetail = async (movieId) => {
        isLoading.value = true;
        errorMessage.value = '';
        selectedMovie.value = null;

        try {
            const API_KEY = '35f704e263e8d21a74ca56b802094634';
            const url = `https://api.themoviedb.org/3/movie/${movieId}`;

            const response = await axios.get(url, {
                params: {
                    api_key: API_KEY,
                    language: 'ko-KR'
                }
            });
            selectedMovie.value = response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                errorMessage.value = '존재하지 않거나 삭제된 영화 정보입니다.';
            } else {
                errorMessage.value = '서버 통신 중 에러가 발생했습니다.';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const toggleFavorite = (movieId) => {
        const movie = movies.value.find(m => m.id === movieId);
        if (movie) {
            movie.isFavorite = !movie.isFavorite;

            if (movie.isFavorite) {
                favorites.value.push(movie);
            } else {
                favorites.value = favorites.value.filter(m => m.id !== movieId);
            }
            sessionStorage.setItem('favorites', JSON.stringify(favorites.value));
        }
    };

    const sortKey = ref('popularity');

    const applySort = (list) => {
        const sorted = list.slice();
        if (sortKey.value === 'title') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortKey.value === 'release_date') {
            sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        } else if (sortKey.value === 'vote_average') {
            sorted.sort((a, b) => b.vote_average - a.vote_average);
        }
        return sorted;
    };

    const sortedMovies = computed(() => applySort(movies.value));
    const sortedFavorites = computed(() => applySort(favorites.value));

    const searchResults = computed(() => {
        if (searchKeyword.value === '') {
            return [];
        }
        const filtered = allMovies.value.filter(m => m.title.includes(searchKeyword.value));
        return applySort(filtered);
    });

    const goPage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        fetchMovies(page);
    };

    return {
        movies,
        allMovies,
        favorites,
        isLoading,
        errorMessage,
        fetchMovies,
        fetchAllMoviesForSearch,
        toggleFavorite,
        selectedMovie,
        fetchedMovieDetail,
        searchKeyword,
        searchResults,
        sortKey,
        sortedMovies,
        sortedFavorites,
        currentPage,
        totalPages,
        goPage
    };
});