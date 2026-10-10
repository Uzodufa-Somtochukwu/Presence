import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import {
  createPublicClient,
  createWalletClient,
  getAddress,
  http,
  isAddress,
  isAddressEqual,
  zeroAddress,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

dotenv.config({ path: '.env.local' });

function getAwarderAddress() {
  const value = process.env.PRESENCE_AWARDER_ADDRESS?.trim();

  if (!value || !isAddress(value, { strict: false })) {
    throw new Error(
      'Set PRESENCE_AWARDER_ADDRESS to a valid Ethereum address in .env.local.',
    );
  }

  let address;

  try {
    address = getAddress(value);
  } catch {
    throw new Error(
      'PRESENCE_AWARDER_ADDRESS must be a valid Ethereum address.',
    );
  }

  if (isAddressEqual(address, zeroAddress)) {
    throw new Error(
      'PRESENCE_AWARDER_ADDRESS cannot be the zero address.',
    );
  }

  return address;
}

function getDeployerAccount() {
  const privateKey =
    process.env.BASE_SEPOLIA_DEPLOYER_PRIVATE_KEY?.trim();

  if (!privateKey) {
    throw new Error(
      'Set BASE_SEPOLIA_DEPLOYER_PRIVATE_KEY in .env.local to deploy.',
    );
  }

  try {
    return privateKeyToAccount(privateKey);
  } catch {
    throw new Error(
      'BASE_SEPOLIA_DEPLOYER_PRIVATE_KEY must be a valid 32-byte private key.',
    );
  }
}

async function deploy() {
  const awarderAddress = getAwarderAddress();
  const deployerAccount = getDeployerAccount();

  const rpcUrl =
    process.env.BASE_SEPOLIA_RPC_URL ||
    'https://sepolia.base.org';

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account: deployerAccount,
    chain: baseSepolia,
    transport: http(rpcUrl),
  });

  const connectedChainId = await publicClient.getChainId();

  if (connectedChainId !== baseSepolia.id) {
    throw new Error(
      `RPC endpoint returned chain ID ${connectedChainId}; expected Base Sepolia (${baseSepolia.id}).`,
    );
  }

  const artifactPath = resolve(
    'artifacts/contracts/PresencePointsLedger.sol/PresencePointsLedger.json',
  );

  const artifact = JSON.parse(
    await readFile(artifactPath, 'utf8'),
  );

  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [awarderAddress],
  });

  const receipt =
    await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) {
    throw new Error(
      'Deployment transaction completed without a contract address.',
    );
  }

  console.log(
    `PresencePointsLedger deployed at: ${receipt.contractAddress}`,
  );

  console.log(
    `Configured awarder address: ${awarderAddress}`,
  );

  console.log(`Deployment transaction: ${hash}`);
}

deploy().catch((error) => {
  console.error(`Deployment failed: ${error.message}`);
  process.exitCode = 1;
});