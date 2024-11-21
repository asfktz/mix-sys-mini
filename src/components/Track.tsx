import { ActorRefFrom } from 'xstate';
import { useSelector } from '@xstate/react';
import { trackMachine } from '../machines';

type Props = {
  trackRef: ActorRefFrom<typeof trackMachine>;
  index: number;
};

function Track({ trackRef }: Props) {
  const { context } = useSelector(trackRef, (state) => state);
  const { muted, soloed } = context;
  return (
    <div>
      <span>{trackRef.id} </span>
      <button
        onClick={() => {
          trackRef.send({
            type: 'TOGGLE_MUTE',
          });
        }}
      >
        {muted ? 'Unmute' : 'Mute'}
      </button>
      <button
        onClick={() => {
          trackRef.send({
            type: 'TOGGLE_SOLO',
          });
        }}
      >
        {soloed ? 'Unsolo' : 'Solo'}
      </button>
      <pre>{JSON.stringify(context)}</pre>
    </div>
  );
}

export default Track;
