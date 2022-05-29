import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_PLAYLIST_API = 'https://www.googleapis.com/youtube/v3/playlists';
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const getPlaylist = createAsyncThunk(
    'yt/getPlaylist', 
    async(link) => {
        const id = link.split('=')[1];
        
        // fetch public videos from playlist

        const response = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?key=${YOUTUBE_API_KEY}&playlistId=${id}&part=snippet,status,contentDetails&maxResults=50`);
        const data = await response.json();

        // fetch the playlist for the name
        const playlistResponse = await fetch(`${YOUTUBE_PLAYLIST_API}?key=${YOUTUBE_API_KEY}&id=${id}&part=snippet`);
        const playlistData = await playlistResponse.json();

        // gets the name from the playlist data
        const playlistName = playlistData.items[0].snippet.title;

        let nextPageData;

        while(data.nextPageToken) {
            const nextPageResponse = await fetch(`${YOUTUBE_PLAYLIST_ITEMS_API}?key=${YOUTUBE_API_KEY}&playlistId=${id}&part=snippet,status,contentDetails&maxResults=50&pageToken=${data.nextPageToken}`);
            nextPageData = await nextPageResponse.json();
            data.items = [...data.items, ...nextPageData.items];
            data.nextPageToken = nextPageData.nextPageToken;
        }

        // add playlistname to data
        data.playlistName = playlistName;

        //fitler out the videos that are unlisted
        data.items = data.items.filter(item => {
            return item.status.privacyStatus === 'public';
        });


        return await data;
    }
);

export const postPlaylist = createAsyncThunk(
    'yt/postPlaylist',
    async(data) => {
        const response = await fetch(`${SERVER_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        return await response.blob();
    }
);
export const resetZipState = createAsyncThunk(
    // set zipLoading to false and zipStatus to ''
    'yt/resetZipState',
    async(data) => {
        return data;
    }
);

export const ytSlice = createSlice({
    name: 'yt',
    initialState: { 
        playlist: [],
        playlistName: '',
        loading: false,
        status: '',
        zipLoading: false,
        zipStatus: '',
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
            state.playlistName = action.payload.playlistName;
            state.loading = false;
            state.status = 'success';
        },
        [getPlaylist.rejected.type]: (state) => {
            state.loading = false;
            state.status = 'error';
        },
        [postPlaylist.pending.type]: (state) => {
            state.zipLoading = true;
            state.zipStatus = 'loading';
        },
        [postPlaylist.fulfilled.type]: (state, action) => {
            state.zipLoading = false;
            state.zipStatus = 'success';
        },
        [postPlaylist.rejected.type]: (state) => {
            state.zipLoading = false;
            state.zipStatus = 'error';
        },
        [resetZipState.pending.type]: (state) => {
            state.zipLoading = false;
            state.zipStatus = '';
        }
    }
});

export const playlistState = (state: RootState) => state.youtube;

export default ytSlice.reducer;