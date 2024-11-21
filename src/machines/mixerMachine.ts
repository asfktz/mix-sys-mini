import { assign, setup, ActorRefFrom, enqueueActions } from "xstate";
import { trackMachine } from "./trackMachine";
import { createActorContext } from "@xstate/react";

type SourceTrack = {
  id: number;
};

const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

export const mixerMachine = setup({
  types: {
    context: {} as {
      trackActorRefs: ActorRefFrom<typeof trackMachine>[];
      tracks: SourceTrack[];
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
          systemId: `track${track.id}`,
          id: `track${track.id}`,
          input: {
            track,
            trackActorRef: self,
          },
        });
      });
      console.log("trackActorRefs", trackActorRefs);

      return { trackActorRefs };
    }),
  },
}).createMachine({
  initial: "initializing",
  context: {
    tracks,
    trackActorRefs: [],
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
          actions: enqueueActions(({ context, enqueue }) => {
            const mutedTracks = context.trackActorRefs?.filter(
              (trackActor) => !trackActor.getSnapshot().context.soloed,
            );
            const allTracksMuted =
              mutedTracks?.length === context.trackActorRefs!.length;

            context.trackActorRefs?.forEach((trackActor) => {
              const { soloed } = trackActor.getSnapshot().context;

              if (!soloed) {
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
      },
    },
  },
});

export const MixerContext = createActorContext(mixerMachine);
