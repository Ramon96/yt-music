import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
 
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    getPlaylist,
    postPlaylist,
    resetZipState,
    playlistState,
} from './youtubeSlice';

import loading from '../../loading.gif';
import error from '../../error.gif';
import success from '../../success.gif';

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

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export function Playlist() {
    const dispatch = useAppDispatch();
    const playlist = useAppSelector(playlistState);
    const { register, unregister, handleSubmit } = useForm();
    const [open, setOpen] = useState(false);

    // Styling
    const submitSx = {
        ...(playlist.status === "success" && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
      };


    //Handlers
    const onSubmit = (data) => {
        if(!data.link.includes('https://www.youtube.com/playlist?list=')) { 
            alert('Please enter a valid youtube playlist link');
            return;
        }

        dispatch(getPlaylist(data.link))
        .then(() => {
            unregister('link');
        });
    };

    const onSubmitSave = (data) => {
        const songs = data.songs;

        const downloadList = Object.entries(songs).filter(song => {
            return song[1] === true;
        }).map(song => {
            return song[0];
        });

        const requestData = {
            songs: downloadList,
            name: playlist.playlistName
        }

        dispatch(postPlaylist(requestData))
        .then((res) => {
            const blob = new Blob([res.payload], { type: 'application/zip' });

            if(!res.error)
            {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download =  playlist.playlistName + '.zip';
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
                a.click();    
                a.remove();  //afterwards we remove the element again   
            }
            else {
                alert(res.error.message);
            }
        });
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        dispatch(resetZipState());
        setOpen(false);
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

        <Dialog open={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmitSave)}>
                <DialogTitle>Save Playlist - {playlist.playlistName}</DialogTitle>
                <DialogContent>
                    {playlist.zipStatus === "loading" && 
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box 
                                component="img"
                                src={loading}
                                alt="Loading"
                            />
                            Downloading and compressing playlist...
                        </Box>
                    }
                    {playlist.zipStatus === "success" &&
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box 
                            component="img"
                            src={success}
                            alt="Success"
                            sx={{
                                width: '100%',
                            }}
                        />
                        Enjoy the bangers!
                    </Box>
                    }
                    {playlist.zipStatus === "error" &&
                        <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box 
                            component="img"
                            src={error}
                            alt="Error"
                            sx={{
                                width: '100%',
                            }}
                        />
                        Error occured, try again later or contact developer
                    </Box>
                    }
                    {playlist.zipStatus === '' &&
                        <>
                            <DialogContentText>
                                Select the songs you wish to save
                            </DialogContentText>
                            <FormGroup>
                                {playlist.playlist.filter(song => (song.snippet.title !== "Deleted video")).map((song, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox defaultChecked />
                                        }
                                        label={song.snippet.title}
                                        {...register(`songs.${song.contentDetails.videoId}`)}
                                    />
                                    ))}
                            </FormGroup>
                        </>
                    }
                </DialogContent>
                {playlist.zipStatus === '' ?
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                    :
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                }
            </form>
        </Dialog>
        {/* TODO: maak hier een component van */}
        {playlist.playlist.length === 0 
            ? (
                <Stack my={2}>
                    No playlist found.
                </Stack>
            ) : (
                <>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography pb={2} variant="body1" color="textPrimary" component="p">
                            {playlist.playlistName}
                        </Typography>
                        <Typography pb={2} variant="body2" color="textSecondary" component="p">
                            Total songs: {playlist.playlist.length}
                        </Typography>
                        <Button variant="contained" startIcon={<SaveIcon/>} onClick={handleClickOpen}>
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