import { ActorRefFrom } from "xstate";
import { trackMachine } from "@/machines/trackMachine";
import SoloMute from "./SoloMute";
import { useSelector } from "@xstate/react";

interface TrackProps {
  trackActor: ActorRefFrom<typeof trackMachine>;
}

export default function Track({ trackActor }: TrackProps) {
  const { context } = useSelector(trackActor, (state) => state);

  return (
    <>
      {/* {context.soloed && <div>Soloed!</div>} */}
      <SoloMute trackActor={trackActor} />
    </>
  );
}
