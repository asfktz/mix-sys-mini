import { ActorRefFrom, setup } from "xstate";

type SourceTrack = {
  id: string;
};

export type TrackEvents =
  | { type: "track.solo" }
  | { type: "track.mute" }
  | { type: "track.reset" };

export const trackMachine = setup({
  types: {
    input: {} as {
      track: SourceTrack;
    },
    context: {} as {
      track: SourceTrack;
    },
    events: {} as TrackEvents,
  },
  actions: {
    muteTrack: () => {
      // TODO: Mute Track
    },
    unmuteTrack: () => {
      // TODO: Unmute Track
    },
    soloTrack: () => {
      // TODO: Solo Track
    },
    unsoloTrack: () => {
      // TODO: Unsolo Track
    },
  },
}).createMachine({
  context: ({ input }) => ({
    track: input.track,
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        "track.solo": { target: "soloing" },
        "track.mute": { target: "muted" },
      },
    },
    soloing: {
      entry: "soloTrack",
      exit: "unsoloTrack",
      on: {
        "track.mute": { target: "muted" },
        "track.reset": { target: "idle" },
      },
    },
    muted: {
      entry: "muteTrack",
      exit: "unmuteTrack",
      on: {
        "track.solo": { target: "soloing" },
        "track.reset": { target: "idle" },
      },
    },
  },
});

export type TrackActor = ActorRefFrom<typeof trackMachine>;
