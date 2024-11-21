import mixerMachine from "./mixerMachine";
import { assign, setup, ActorRefFrom } from "xstate";

type SourceTrack = {
  id: number;
};

export const trackMachine = setup({
  types: {
    input: {} as {
      track: SourceTrack;
      trackActorRef: ActorRefFrom<typeof mixerMachine>;
    },
    context: {} as {
      muted: boolean;
      soloed: boolean;
      track: SourceTrack;
      trackActorRef: ActorRefFrom<typeof mixerMachine>;
    },
    events: {} as
      | { type: "SOLO"; trackInfo: { track: SourceTrack } }
      | { type: "MUTE" }
      | { type: "UNMUTE" },
  },
  actions: {
    toggleSolo: assign(({ context }) => {
      return { soloed: !context.soloed, muted: context.muted };
    }),
    muteTrack: assign({ muted: true }),
    unmuteTrack: assign({ muted: false }),
  },
}).createMachine({
  context: ({ input }) => ({
    track: input.track,
    trackActorRef: input.trackActorRef,
    muted: false,
    soloed: false,
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        SOLO: {
          actions: {
            type: "toggleSolo",
          },
        },
        MUTE: {
          actions: {
            type: "muteTrack",
          },
        },
        UNMUTE: {
          actions: {
            type: "unmuteTrack",
          },
        },
      },
    },
  },
});
