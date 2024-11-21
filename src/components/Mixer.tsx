import Track from "./Track";
import { MixerContext } from "../machines/mixerMachine";

function Mixer() {
  const { trackActorRefs, message } = MixerContext.useSelector(
    (state) => state.context,
  );

  console.log("message", message);

  return trackActorRefs?.map((trackActor, i: number) => (
    <Track key={i} trackActor={trackActor} />
  ));
}

export default Mixer;
