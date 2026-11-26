import React, { useEffect, useState } from 'react';
import { connectSocket, getSocket, api } from './socketClient';

interface User { id: number; username: string; email: string; }

interface MultiplayerLobbyProps {
  user: User;
  token: string;
  onMatchStart: (roomId: string, role: 'host' | 'guest', opponent: string, opponentId: number) => void;
  onBack: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ user, token, onMatchStart, onBack }) => {
  const [status, setStatus] = useState('idle'); // idle, queued, in_room
  const [roomId, setRoomId] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [opponent, setOpponent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = connectSocket(token);
    socket.on('queued', () => setStatus('queued'));
    socket.on('match_found', (data: any) => {
      setStatus('matched');
      onMatchStart(data.roomId, data.role, data.opponent, data.opponentId);
    });
    socket.on('room_created', (data: any) => {
      setRoomId(data.roomId);
      setStatus('in_room');
    });
    socket.on('room_joined', (data: any) => {
      setRoomId(data.roomId || joinCode);
      setStatus('in_room_guest');
    });
    socket.on('player_joined', (data: any) => {
      setOpponent(data.guest);
    });
    socket.on('match_start', (data: any) => {
      onMatchStart(data.roomId, data.role, data.opponent, data.opponentId);
    });
    socket.on('room_error', (data: any) => setError(data.error));
    socket.on('match_invite', (data: any) => {
      if (confirm(`${data.from} invited you to a match. Accept?`)) {
        socket.emit('accept_invite', { fromId: data.fromId });
      }
    });
    return () => {
      socket.off('queued');
      socket.off('match_found');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('match_start');
      socket.off('room_error');
      socket.off('match_invite');
    };
  }, [token, onMatchStart, joinCode]);

  const quickMatch = () => {
    setError('');
    const s = getSocket();
    s?.emit('quick_match');
    setStatus('searching');
  };

  const cancelQueue = () => {
    const s = getSocket();
    s?.emit('cancel_queue');
    setStatus('idle');
  };

  const createRoom = () => {
    setError('');
    const s = getSocket();
    s?.emit('create_room');
  };

  const joinRoom = () => {
    setError('');
    const s = getSocket();
    s?.emit('join_room', { roomId: joinCode });
  };

  const startRoomMatch = () => {
    const s = getSocket();
    s?.emit('start_match', { roomId });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/15 bg-slate-900 p-6 shadow-2xl">
        <h2 className="font-display text-3xl font-bold text-white">Online Multiplayer</h2>
        <p className="mt-1 text-xs text-slate-400">Logged in as {user.username}</p>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        {status === 'idle' && (
          <div className="mt-6 space-y-3">
            <button onClick={quickMatch} className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">
              Quick Match
            </button>
            <button onClick={createRoom} className="w-full rounded-md border border-white/15 bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              Create Private Room
            </button>
            <div className="flex gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Room code"
                className="flex-1 rounded-md border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white"
              />
              <button onClick={joinRoom} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                Join
              </button>
            </div>
            <button onClick={onBack} className="w-full rounded-md border border-white/15 bg-transparent px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800">
              Back
            </button>
          </div>
        )}

        {status === 'searching' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">Searching for opponent...</p>
            <button onClick={cancelQueue} className="mt-4 rounded-md border border-white/15 bg-slate-800 px-4 py-2 text-sm text-white">
              Cancel
            </button>
          </div>
        )}

        {status === 'in_room' && (
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-300">Room code: <span className="font-mono font-bold text-amber-400">{roomId}</span></p>
            <p className="text-xs text-slate-400">{opponent ? `Opponent joined: ${opponent}` : 'Waiting for opponent...'}</p>
            {opponent && (
              <button onClick={startRoomMatch} className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">
                Start Match
              </button>
            )}
            <button onClick={onBack} className="w-full rounded-md border border-white/15 bg-transparent px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800">
              Back
            </button>
          </div>
        )}

        {status === 'in_room_guest' && (
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-300">Joined room {roomId}</p>
            <p className="text-xs text-slate-400">Waiting for host to start...</p>
            <button onClick={onBack} className="w-full rounded-md border border-white/15 bg-transparent px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
