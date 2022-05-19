import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
 
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    getPlaylist,
    playlistState,
} from './youtubeSlice';


export function Playlist() {
  const playlist = useAppSelector(playlistState);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(getPlaylist())
  }, [dispatch]);



  return (
    <div>
        {console.log(playlist)}
    </div>
  );
}