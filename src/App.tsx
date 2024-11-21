import { MixerContext } from "./machines/mixerMachine";
import Mixer from "./components/Mixer";

function App() {
  return (
    <MixerContext.Provider
      options={{
        systemId: "mixer",
      }}
    >
      <Mixer />
    </MixerContext.Provider>
  );
}

export default App;
