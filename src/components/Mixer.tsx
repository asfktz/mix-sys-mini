import Track from "./Track";
import { MixerContext } from "../machines/mixerMachine";

function Mixer() {
  const { trackActorRefs } = MixerContext.useSelector((state) => state.context);

  return trackActorRefs?.map((trackActor, i: number) => (
    <Track key={i} trackActor={trackActor} trackId={i} />
  ));
}

export default Mixer;
