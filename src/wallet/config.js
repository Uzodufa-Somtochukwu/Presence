import { createConfig, http } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { base } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Presence' }),
  ],
  transports: {
    [base.id]: http(),
  },
});
