import { defineConfig } from 'hardhat/config';

export default defineConfig({
  solidity: '0.8.28',
  networks: {
    baseSepolia: {
      type: 'http',
      chainType: 'op',
      chainId: 84532,
      url: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
    },
  },
});
