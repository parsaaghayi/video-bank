import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const VideoBank = () => {
  const [videoToken, setVideoToken] = useState<string | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };
    const videoTokenCookie = getCookie("videoToken");
    if (videoTokenCookie) {
      // استفاده از کوکی
      setVideoToken(videoTokenCookie);
    }
    const roomUrlCookie = getCookie("roomUrl");
    if (roomUrlCookie) {
      // استفاده از کوکی
      setRoomUrl(roomUrlCookie);
    }
  }, []);

  return (
    <div className="w-full h-[calc(100vh-20px)] overflow-hidden flex flex-col justify-between">
      <div className="topbar flex justify-between items-center m-2">
        <div className="p-2 w-[40px] h-[40px] rounded-2xl bg-white">
          <Image
            src={"/images/profile.svg"}
            alt="profile"
            width={40}
            height={40}
            className="cursor-pointer"
            onClick={() => {
              window.location.href = "/logout";
            }}
          />
        </div>
        <h1 className="text-xl font-bold">ویدئو بانک</h1>
        <Image
          src={"/images/notification.svg"}
          alt="notification"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </div>
      <div className="h-full pt-5 pb-2 flex flex-col items-center gap-5 px-5">
        {videoToken !== null && roomUrl !== null ? (
          <LiveKitRoom
            video={true}
            audio={true}
            token={videoToken}
            serverUrl={roomUrl}
            // serverUrl={process.env.LIVEKIT_URL}
            // Use the default LiveKit theme for nice styles.
            data-lk-theme="default"
            style={{ height: "calc(100vh/2)", maxWidth: "100%" }}
          >
            {/* Your custom component with basic video conferencing functionality. */}
            <MyVideoConference />
            {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
            <RoomAudioRenderer />
            {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
            <ControlBar />
          </LiveKitRoom>
        ) : null}
      </div>
    </div>
  );
};

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout tracks={tracks} style={{ height: "calc(100vh/2)" }}>
      {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
export default VideoBank;
