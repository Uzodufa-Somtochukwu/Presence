import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseAbi,
} from 'viem';
import { baseSepolia } from 'viem/chains';

export const PRESENCE_POINTS_CONTRACT =
  '0xBbb1E2003d11ab49E030e6005967Dc03740Ea0d9';

export const presencePointsAbi = parseAbi([
  'function pointsOf(address user) view returns (uint256)',
  'function awardPoints(address user, uint256 amount)',
  'function awarder() view returns (address)',
  'event PointsAwarded(address indexed user, uint256 amount, uint256 newTotal)',
]);

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

export function getWalletClient() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not available.');
  }

  return createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum),
  });
}

export async function getOnChainPoints(address) {
  return baseSepoliaPublicClient.readContract({
    address: PRESENCE_POINTS_CONTRACT,
    abi: presencePointsAbi,
    functionName: 'pointsOf',
    args: [address],
  });
}