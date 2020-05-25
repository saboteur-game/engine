import EventEmitter, { ListenerFn } from "eventemitter2";

const eventEmitter = new EventEmitter.EventEmitter2({
  wildcard: true,
  delimiter: ".",
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: false,
  ignoreErrors: true,
});

const emitter = {
  emit(name: string, ...data: unknown[]) {
    eventEmitter.emit(name, {
      data,
      time: Date.now(),
    });
  },

  on(name: string, listener: ListenerFn) {
    eventEmitter.on(name, listener);
  },
};

export default emitter;
export { ListenerFn };
