import { mixerMachine } from "./mixerMachine";
import { assign, setup, ActorRefFrom, assertEvent } from "xstate";

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
      trackActorRef: ActorRefFrom<typeof mixerMachine>;
    },
    events: {} as { type: "SOLO" } | { type: "MUTE" } | { type: "UNMUTE" },
  },
  actions: {
    toggleSolo: assign(({ context, event }) => {
      assertEvent(event, "SOLO");
      return { soloed: !context.soloed, muted: context.muted };
    }),
    muteTrack: assign(({ event }) => {
      assertEvent(event, "MUTE");
      console.log("muting track");
      return { muted: true };
    }),
    unmuteTrack: assign(({ event }) => {
      assertEvent(event, "UNMUTE");
      return { muted: false };
    }),
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
