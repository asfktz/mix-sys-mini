import { assign, setup, ActorRefFrom, enqueueActions } from "xstate";
import { trackMachine } from "./trackMachine";
import { createActorContext } from "@xstate/react";

type SourceTrack = {
  id: string;
};

const tracks = [
  { id: "track1" },
  { id: "track2" },
  { id: "track3" },
  { id: "track4" },
];

export const mixerMachine = setup({
  types: {
    context: {} as {
      trackActorRefs: ActorRefFrom<typeof trackMachine>[];
      tracks: SourceTrack[];
      message?: string;
    },
    events: {} as
      | {
          type: "SOLO";
          trackInfo: { track: SourceTrack };
          systemId: string;
        }
      | { type: "MUTED_BY_SOLO"; id: string },
  },
  actions: {
    buildTracks: assign(({ context, spawn, self }) => {
      const trackActorRefs = context.tracks.map((track) => {
        return spawn(trackMachine, {
          systemId: track.id,
          id: track.id,
          input: {
            track,
            trackActorRef: self,
          },
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
    message: "",
  },
  states: {
    initializing: {
      entry: "buildTracks",
      on: {
        SOLO: {
          actions: enqueueActions(({ event, enqueue }) => {
            enqueue.sendTo(({ system }) => system.get(event.systemId), {
              type: "SOLO",
              trackInfo: event.trackInfo,
            });

            enqueue.sendTo(({ system }) => system.get("mixer"), {
              type: "MUTED_BY_SOLO",
              id: event.trackInfo.track.id,
            });
          }),
        },
        MUTED_BY_SOLO: {
          actions: enqueueActions(({ context, event, enqueue }) => {
            const currentTrackId = event.id;
            const mutedTracks = context.trackActorRefs?.filter(
              (trackActor) => !trackActor.getSnapshot().context.soloed,
            );
            const allTracksMuted =
              mutedTracks?.length === context.trackActorRefs!.length;

            context.trackActorRefs?.forEach((trackActor) => {
              const { soloed, track } = trackActor.getSnapshot().context;

              if (!soloed) {
                if (currentTrackId === track.id) {
                  console.log("unsoloed!");
                  enqueue.sendTo(({ system }) => system.get("mixer"), {
                    type: "SET_MESSAGE",
                    message: `Unsoloed ${track.id}`,
                  });
                }
                enqueue.sendTo(trackActor, {
                  type: "MUTE",
                });
              } else {
                enqueue.sendTo(trackActor, {
                  type: "UNMUTE",
                });
              }
              if (allTracksMuted) {
                enqueue.sendTo(trackActor, {
                  type: "UNMUTE",
                });
              }
            });
          }),
        },
        SET_MESSAGE: {
          actions: assign({
            message: ({ context, event }) => event.message,
          }),
        },
      },
    },
  },
});

export const MixerContext = createActorContext(mixerMachine);
