import { useSelector } from "@xstate/react";
import { Toggle } from "./Buttons";
import { ActorRefFrom } from "xstate";
import { trackMachine } from "@/machines/trackMachine";
import { MixerContext } from "../machines/mixerMachine";

type Props = {
  trackActor: ActorRefFrom<typeof trackMachine>;
};

function SoloMute({ trackActor }: Props) {
  const { context } = useSelector(trackActor, (state) => state);
  const currentTrackId = context.track.id;
  const { send } = MixerContext.useActorRef();

  console.log("context", context);
  console.log("trackActor", trackActor);

  return (
    <div className="flex gap8">
      <Toggle
        id={`trackSolo${currentTrackId}`}
        checked={context.soloed}
        onChange={() => {
          return send({
            type: "SOLO",
            trackInfo: context,
            systemId: trackActor.id,
          });
        }}
      >
        S
      </Toggle>
      <Toggle
        id={`trackMute${currentTrackId}`}
        className="mute"
        checked={context.muted}
        onChange={() => {
          trackActor.send({
            type: context.muted ? "UNMUTE" : "MUTE",
          });
        }}
      >
        M
      </Toggle>
    </div>
  );
}

export default SoloMute;
