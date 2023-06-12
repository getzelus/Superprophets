import { create } from 'zustand';
import  walletStore  from './walletStore';
import  otherStore  from './otherStore';

const useStore = create((...args) => ({
  ...walletStore(...args),
  ...otherStore(...args),
}));

export default useStore;
