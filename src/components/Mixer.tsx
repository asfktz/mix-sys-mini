import Track from "./Track";
import { MixerContext } from "../machines/mixerMachine";

function Mixer() {
  const trackActors = MixerContext.useSelector(
    (state) => state.context.trackActorRefs,
  );
  return (
    <div>
      {" "}
      {trackActors?.map((trackActor, i: number) => (
        <Track key={i} trackActor={trackActor} trackId={i} />
      ))}
    </div>
  );
}

export default Mixer;
