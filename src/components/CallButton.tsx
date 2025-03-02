import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper'; // Add IconButton and useTheme
import { MediaStreamTrack, RTCIceCandidate, RTCPeerConnection, mediaDevices } from 'react-native-webrtc';
import useSocket from '../hooks/useSocket';

interface CallButtonProps {
  chatId: string;
}

export default function CallButton({ chatId }: CallButtonProps) {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [pc, setPc] = useState<any>(null);
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  const socket = useSocket();
  const { colors } = useTheme(); // Use colors from the theme

  useEffect(() => {
    const newPc: any = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    newPc.onicecandidate = (event: any) => {
      if (event.candidate && socket) {
        socket.emit('iceCandidate', {
          candidate: event.candidate,
          chatId
        });
      }
    };

    newPc.ontrack = (event: any) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    const handleAnswer = async (answer: any) => {
      await newPc.setRemoteDescription(answer);
    };

    const handleIceCandidate = (candidate: any) => {
      newPc.addIceCandidate(new (RTCIceCandidate as any)(candidate));
    };

    socket?.on('callAnswer', handleAnswer);
    socket?.on('iceCandidate', handleIceCandidate);

    setPc(newPc);

    return () => {
      socket?.off('callAnswer', handleAnswer);
      socket?.off('iceCandidate', handleIceCandidate);
      newPc.close();
      localStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    };
  }, []);

  const startCall = async () => {
    const timeout = setTimeout(endCall, 30000);
    if (!pc) return;
    try {
      const stream = await mediaDevices.getUserMedia({ video: false, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((track: MediaStreamTrack) => pc.addTrack(track, stream));

      const offer = await pc.createOffer({});
      await pc.setLocalDescription(offer);

      socket?.emit('callRequest', { offer, chatId });
      setInCall(true);
    } catch (error) {
      console.error('Error starting call:', error);
    } finally {
      clearTimeout(timeout);
    }
  };

  const endCall = () => {
    pc?.close();
    setInCall(false);
    setLocalStream(null);
    setRemoteStream(null);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track: any) => {
        track.enabled = !track.enabled;
      });
      setMuted(!muted);
    }
  };

  const toggleSpeaker = () => {
    // For actual speaker toggling, you'd handle audio routing. 
    // This is a placeholder:
    setSpeakerOn(!speakerOn);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {inCall ? (
        <View style={styles.callControls}>
          <IconButton
            icon="phone-hangup"
            onPress={endCall}
            iconColor="#E74C3C"
            size={24}
          />
          <IconButton
            icon={muted ? "microphone-off" : "microphone"}
            onPress={toggleMute}
            iconColor="#666"
            size={24}
          />
          <IconButton
            icon={speakerOn ? "volume-high" : "volume-off"}
            onPress={toggleSpeaker}
            iconColor="#666"
            size={24}
          />
        </View>
      ) : (
        <IconButton
          icon="phone"
          onPress={startCall}
          iconColor="#4A90E2"
          size={24}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
});