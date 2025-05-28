import { jsonDataHeader } from '@/lib/helper';
import axios from 'axios';

console.log(import.meta.env.VITE_SERVER_URI)


export const createGame = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_SERVER_URI}/register-game`, data)
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const getPlayerDetaills = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_SERVER_URI}/player-details`, {
          ...jsonDataHeader(), data
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const makeMove = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${import.meta.env.VITE_SERVER_URI}/player-move`,data, jsonDataHeader())
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};


export const getGameStatus = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_SERVER_URI}/game-status`, {
          ...jsonDataHeader(), params:data
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};


export const resetGame = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_SERVER_URI}/reset-game`,data, jsonDataHeader())
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};