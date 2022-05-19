import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = "PLrIbvYfRNoqXKmAe7EFLWaH2Gi22-GSwg";

export const getPlaylist = createAsyncThunk(
    'yt/getPlaylist', 
    async() => {
        const response = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&part=snippet,contentDetails&maxResults=50`);

        const data = await response.json();
        let nextPageData;

        while(data.nextPageToken) {
            const nextPageResponse = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&part=snippet,contentDetails&maxResults=50&pageToken=${data.nextPageToken}`);
            nextPageData = await nextPageResponse.json();
            data.items = [...data.items, ...nextPageData.items];
            data.nextPageToken = nextPageData.nextPageToken;
        }

        return await data;
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