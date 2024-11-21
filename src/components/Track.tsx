import { ActorRefFrom } from "xstate";
import { trackMachine } from "@/machines/trackMachine";
import SoloMute from "./SoloMute";

interface TrackProps {
  trackActor: ActorRefFrom<typeof trackMachine>;
  trackId: number;
}

export default function Track({ trackActor }: TrackProps) {
  return <SoloMute trackActor={trackActor} />;
}
