import Track from "./Track";
import { globalActor } from "../machines/mixerMachine";
import { ActorRefFrom } from "xstate";
import { trackMachine } from "@/machines/trackMachine";
import { useSelector } from "@xstate/react";

function Mixer() {
  const { trackActorRefs, message } = useSelector(
    globalActor,
    (snapshot) => snapshot.context,
  );

  const tracks = trackActorRefs?.map(
    (trackActor: ActorRefFrom<typeof trackMachine>, i: number) => (
      <Track key={i} trackActor={trackActor} />
    ),
  );

  return (
    <div>
      <div>{message}</div>
      <div>{tracks}</div>
    </div>
  );
}

export default Mixer;
