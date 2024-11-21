import Track from "./Track";
import { MixerContext } from "../machines/mixerMachine";
import { ActorRefFrom } from "xstate";
import { trackMachine } from "@/machines/trackMachine";

function Mixer() {
  const { trackActorRefs, message } = MixerContext.useSelector(
    (state) => state.context,
  );

  const tracks = trackActorRefs?.map(
    (trackActor: ActorRefFrom<typeof trackMachine>, i: number) => {
      return (
        <div key={i}>
          <Track trackActor={trackActor} />
        </div>
      );
    },
  );

  return (
    <div>
      <div>{message}</div>
      <div>{tracks}</div>
    </div>
  );
}

export default Mixer;
