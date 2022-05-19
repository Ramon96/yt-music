import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = "PLrIbvYfRNoqVA3QyLvBRkYjYlg9rvKb7Z";

export const getPlaylist = createAsyncThunk(
    'yt/getPlaylist', 
    async() => {
        const response = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&part=snippet,contentDetails&maxResults=50`);
        return await response.json();
    }
);

export const ytSlice = createSlice({
    name: 'yt',
    initialState: { 
        playlist: [],
        loading: false,
        status: '',
        pageInfo: {
            totalResults: 0,
            resultsPerPage: 0,
        },
    },
    reducers: { },
    extraReducers: { 
        [getPlaylist.pending.type]: (state) => {
            state.loading = true;
            state.status = 'loading';
        },
        [getPlaylist.fulfilled.type]: (state, action) => {
            state.playlist = action.payload.items;
            state.pageInfo = action.payload.pageInfo;
            state.loading = false;
            state.status = 'success';
        },
        [getPlaylist.rejected.type]: (state) => {
            state.loading = false;
            state.status = 'error';
        },
    }
});

export const playlistState = (state: RootState) => state.youtube;

export default ytSlice.reducer;