const walletStore = (set) => ({
  provider: null,
  signer: null,
    setProvider: (newProvider) => set( (s) => ({ provider: newProvider })),
    setSigner: (newSigner) => set( (s) => ({ signer: newSigner })),
});

export default walletStore;