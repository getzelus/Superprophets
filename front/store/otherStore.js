const otherStore = (set, get) => ({
  other: 2,
  setOther: (num) => set( (s) => ({ other: num })),
  getSigner: () => { return get().signer }
});

export default otherStore;