import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
 
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    getPlaylist,
    playlistState,
} from './youtubeSlice';

// mui components
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import Box from '@mui/material/Box';

import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import { green } from '@mui/material/colors';

import CircularProgress from '@mui/material/CircularProgress';

export function Playlist() {
    const dispatch = useAppDispatch();
    const playlist = useAppSelector(playlistState);

    const { register, handleSubmit } = useForm();
  
    // useEffect(() => {
    // // dispatch(getPlaylist("https://www.youtube.com/playlist?list=PLrIbvYfRNoqXKmAe7EFLWaH2Gi22-GSwg"))
    // }, [dispatch]);

    const submitSx = {
        ...(playlist.status === "success" && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
      };

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
            <Stack spacing={2} direction="row" my={2}>
                <TextField 
                    id="link" 
                    label="Playlist" 
                    variant="standard"
                    fullWidth
                    {...register('link')} 
                />
                <Box sx={{ position: 'relative' }}>
                    <Fab
                        color="primary"
                        type="submit"
                        sx={submitSx}
                    >
                        {playlist.status === "success" ? <CheckIcon /> : <SearchIcon />}
                    </Fab>
                    {playlist.status === "loading" && 
                        <CircularProgress
                            size={68}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                zIndex: 1,
                            }}
                        />
                    }
                </Box>
                {/* <Button 
                    variant="text" 
                    type="submit"
                >
                    Submit
                </Button> */}
            </Stack>
        </form>

        {/* TODO: maak hier een component van */}
        {console.log(playlist.playlist)}
        {playlist.playlist.length === 0 
            ? (
                <Stack my={2}>
                    No playlist imported yet.
                </Stack>
            ) : (
                <Stack my={2}>
                    <h1>Playlist found</h1>
                </Stack>
            )
        }
    </div>
    );
}