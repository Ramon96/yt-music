import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
 
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    getPlaylist,
    playlistState,
} from './youtubeSlice';

// mui components
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export function Playlist() {
    const dispatch = useAppDispatch();
    const playlist = useAppSelector(playlistState);

    const { register, handleSubmit } = useForm();
  
    // useEffect(() => {
    // // dispatch(getPlaylist("https://www.youtube.com/playlist?list=PLrIbvYfRNoqXKmAe7EFLWaH2Gi22-GSwg"))
    // }, [dispatch]);

    const onSubmit = (data) => {
        //check if we got a valid link
        if(!data.link.includes('https://www.youtube.com/playlist?list=')) { 
            alert('Please enter a valid youtube playlist link');
            return;
        }


      dispatch(getPlaylist(data.link))
    };

    return (
    <div>
        {/* {console.log(playlist)} */}
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} direction="row">
                <TextField 
                    id="link" 
                    label="Playlist" 
                    variant="standard"
                    fullWidth
                    {...register('link')} 
                />
                <Button 
                    variant="text" 
                    type="submit"
                >
                    Text
                </Button>
            </Stack>
        </form>

        {/* TODO: maak hier een component van */}
    </div>
    );
}