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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import { green } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
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
            </Stack>
        </form>

        {/* TODO: maak hier een component van */}
        {playlist.playlist.length === 0 
            ? (
                <Stack my={2}>
                    No playlist found.
                </Stack>
            ) : (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography pb={2} variant="body2" color="textSecondary" component="p">
                            Total songs: {playlist.playlist.length}
                        </Typography>
                        <Button variant="contained" startIcon={<SaveIcon/>}>
                            Save playlist
                        </Button>
                    </Box>
                    <Stack my={2} spacing={4}>
                        {playlist.playlist.filter(song => (song.snippet.title !== "Deleted video")).map((song, index) => (
                            <Card 
                                key={index} 
                                sx={{ display: 'flex' }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        sx={{ width: 185 }}
                                        component="img"
                                        image={song.snippet.thumbnails.high.url}
                                        alt={song.snippet.title}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography variant="h5" component="h2">
                                            {song.snippet.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {song.snippet.videoOwnerChannelTitle}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Card>
                        ))}
                    </Stack>
                </>
            )
        }
    </div>
    );
}