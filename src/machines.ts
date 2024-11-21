import { assign, setup, createMachine, ActorRefFrom } from "xstate";

export const trackMachine = setup({
  types: {
    context: {} as {
      muted: boolean;
      soloed: boolean;
      position: number | null;
      trackActorRef: any;
    },
    events: {} as { type: "TOGGLE_MUTE" } | { type: "TOGGLE_SOLO" },
  },
  actions: {
    handleMute: assign(({ context }) => {
      return {
        muted: !context.muted,
      };
    }),
    handleSolo: assign(({ context }) => {
      return {
        soloed: !context.soloed,
      };
    }),
  },
}).createMachine({
  context: {
    muted: false,
    soloed: false,
    position: null,
    trackActorRef: null,
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        TOGGLE_MUTE: {
          actions: {
            type: "handleMute",
          },
        },
        TOGGLE_SOLO: {
          actions: {
            type: "handleSolo",
          },
        },
      },
    },
  },
});

const tracks = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
];

export const mixerMachine = createMachine({
  id: "all-actors",
  initial: "initializing",
  context: {
    tracks,
    trackActorRefs: [],
  },
  states: {
    initializing: {
      entry: assign(({ context, spawn, self }) => {
        const trackActorRefs = context.tracks.map((track) => {
          return spawn(trackMachine, {
            systemId: `track${track.id}`,
            id: `track${track.id}`,
            input: {
              trackActorRef: self,
            },
          });
        });
        console.log("trackActorRefs", trackActorRefs);

        return { trackActorRefs };
      }),
    },
  },
});
