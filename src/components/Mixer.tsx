import React from 'react';
import Track from "./Track";
import { globalActor, mixerMachine } from "../machines/mixerMachine";
import { ActorRefFrom } from "xstate";
import { trackMachine } from "../machines/trackMachine";
import { useMachine, useSelector } from "@xstate/react";

function Mixer() {
  const { trackActorRefs, message } = useSelector(
    globalActor,
    (snapshot) => snapshot.context
  );
  const [state] = useMachine(mixerMachine);

  console.log("state", state.value);

  const tracks = trackActorRefs?.map(
    (trackActor: ActorRefFrom<typeof trackMachine>, i: number) => (
      <Track key={i} trackActor={trackActor} />
    )
  );

  return (
    <div>
      <div>{message}</div>
      <div>{tracks}</div>
    </div>
  );
}

export default Mixer;
