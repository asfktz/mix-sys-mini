import { useSelector } from "@xstate/react";
import { Toggle } from "./Buttons";
import { ActorRefFrom } from "xstate";
import { trackMachine } from "@/machines/trackMachine";
import { globalActor } from "../machines/mixerMachine";

type Props = {
  trackActor: ActorRefFrom<typeof trackMachine>;
};

function SoloMute({ trackActor }: Props) {
  const { context } = useSelector(trackActor, (state) => state);
  const currentTrackId = context.track.id;

  const isSoloing = useSelector(trackActor, (state) =>
    state.matches("soloing"),
  );

  const isMuted = useSelector(trackActor, (state) => state.matches("muted"));

  return (
    <div className="flex gap8">
      <Toggle
        id={`trackSolo${currentTrackId}`}
        checked={isSoloing}
        onChange={(event) => {
          globalActor.send({
            type: event.target.checked ? "track.solo" : "track.reset",
            trackId: trackActor.id,
          });
        }}
      >
        S
      </Toggle>
      <Toggle
        id={`trackMute${currentTrackId}`}
        className="mute"
        checked={isMuted}
        onChange={(event) => {
          globalActor.send({
            type: event.target.checked ? "track.mute" : "track.reset",
            trackId: trackActor.id,
          });
        }}
      >
        M
      </Toggle>
    </div>
  );
}

export default SoloMute;
