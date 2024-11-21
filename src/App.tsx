import { useMachine } from "@xstate/react";
import { mixerMachine } from "./machines";
import Track from "./components/Track";

function App() {
  const [state] = useMachine(mixerMachine);

  const { trackActorRefs } = state.context;

  return trackActorRefs.map((trackRef, i) => (
    <Track key={i} trackRef={trackRef} index={i} />
  ));
}

export default App;
