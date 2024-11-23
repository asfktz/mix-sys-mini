import {
  ActorRefFrom,
  assign,
  createActor,
  enqueueActions,
  forwardTo,
  setup,
} from "xstate";
import { TrackActor, TrackEvents, trackMachine } from "./trackMachine";

type SourceTrack = {
  id: string;
};

const tracks = [
  { id: "track1" },
  { id: "track2" },
  { id: "track3" },
  { id: "track4" },
];

type MixerEvents = TrackEvents & { trackId: string };
type MixerContext = {
  trackActorRefs: TrackActor[];
  tracks: SourceTrack[];
  message?: string | null;
};

export const mixerMachine = setup({
  types: {
    context: {} as MixerContext,
    events: {} as MixerEvents,
  },
  actors: {
    trackActor: trackMachine,
  },
  actions: {
    buildTracks: assign(({ context, spawn }) => {
      const trackActorRefs = context.tracks.map((track) => {
        return spawn("trackActor", {
          id: track.id,
          input: { track },
        });
      });

      return { trackActorRefs };
    }),
  },
}).createMachine({
  initial: "initializing",
  context: {
    tracks,
    trackActorRefs: [],
    message: null,
  },
  states: {
    initializing: {
      entry: "buildTracks",
      after: {
        250: {
          target: "ready",
        },
      },
    },
    ready: {
      on: {
        "track.solo": {
          actions: enqueueActions(({ event, enqueue, context }) => {
            context.trackActorRefs.forEach((trackActor) => {
              const selectedTrack = trackActor.id === event.trackId;
              const trackSnapshot = trackActor.getSnapshot();

              if (selectedTrack) {
                enqueue.sendTo(trackActor, { type: "track.solo" });
                return;
              }

              if (!trackSnapshot.matches("soloing")) {
                enqueue.sendTo(trackActor, { type: "track.mute" });
              }
            });
          }),
        },
        "track.reset": {
          actions: enqueueActions(({ context, event, enqueue }) => {
            const selectedTrack = selectTrackActorById(context, event.trackId)!;

            const soloingTracks = context.trackActorRefs.filter((trackActor) =>
              trackActor.getSnapshot().matches("soloing"),
            );

            const hasMultipleSoloedTracks = soloingTracks.length > 1;

            if (hasMultipleSoloedTracks) {
              enqueue.sendTo(selectedTrack, { type: "track.mute" });
            } else {
              context.trackActorRefs.forEach((trackActor) => {
                enqueue.sendTo(trackActor, { type: "track.reset" });
              });
            }
          }),
        },

        // Delegate all other events that start with "track.*" (such as "track.mute")
        // to the selected track actor as is.
        "track.*": {
          actions: enqueueActions(({ context, event, enqueue }) => {
            const trackActor = selectTrackActorById(context, event.trackId);
            enqueue.sendTo(trackActor, event);
          }),
        },
      },
    },
  },
});

function selectTrackActorById(context: MixerContext, actorId: string) {
  return context.trackActorRefs.find(
    (trackActor) => trackActor.id === actorId,
  )!;
}

export const globalActor = createActor(mixerMachine);

globalActor.start();
