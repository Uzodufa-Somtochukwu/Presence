import { useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';
import {
  useConnect,
  useConnection,
  useDisconnect,
  useSwitchChain,
} from 'wagmi';
import {
  Check,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Wallet,
} from 'lucide-react';
import { getOnChainPoints } from '../../blockchain/presencePoints.js';

const connectorLabels = {
  injected: 'Browser Wallet',
  coinbaseWallet: 'Coinbase Wallet',
  metaMask: 'MetaMask',
};

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnection() {
  const [open, setOpen] = useState(false);
  const [pendingConnector, setPendingConnector] = useState(null);
  const [onChainPoints, setOnChainPoints] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState('');

  const { address, chainId, connector, isConnected } = useConnection();

  const {
    connectors,
    connectAsync,
    error: connectError,
    isPending: isConnecting,
  } = useConnect();

  const {
    disconnectAsync,
    error: disconnectError,
    isPending: isDisconnecting,
  } = useDisconnect();

  const {
    switchChainAsync,
    error: switchError,
    isPending: isSwitching,
  } = useSwitchChain();

  const connectedToBaseSepolia =
    isConnected && chainId === baseSepolia.id;

  useEffect(() => {
    let cancelled = false;

    async function loadOnChainPoints() {
      if (!address || !connectedToBaseSepolia) {
        setOnChainPoints(null);
        setPointsError('');
        return;
      }

      setPointsLoading(true);
      setPointsError('');

      try {
        const points = await getOnChainPoints(address);

        if (!cancelled) {
          setOnChainPoints(Number(points));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to read on-chain points:', error);
          setPointsError('Couldn’t read on-chain points.');
          setOnChainPoints(null);
        }
      } finally {
        if (!cancelled) {
          setPointsLoading(false);
        }
      }
    }

    loadOnChainPoints();

    return () => {
      cancelled = true;
    };
  }, [address, connectedToBaseSepolia]);

  const handleConnect = async (selectedConnector) => {
    setPendingConnector(selectedConnector.uid);

    try {
      await connectAsync({
        connector: selectedConnector,
        chainId: baseSepolia.id,
      });

      setOpen(false);
    } catch {
      // Connector error is shown below.
    } finally {
      setPendingConnector(null);
    }
  };

  const handleSwitch = async () => {
    try {
      await switchChainAsync({
        chainId: baseSepolia.id,
      });
    } catch {
      // Switch error is shown below.
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
      setOpen(false);
      setOnChainPoints(null);
    } catch {
      // Keep connected state visible if disconnecting fails.
    }
  };

  const errorMessage =
    connectError || switchError || disconnectError;

  return (
    <div className="space-y-2">
      {isConnected ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <Wallet
              className="h-4 w-4 shrink-0 text-[#d8b784]"
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {address
                  ? shortenAddress(address)
                  : connector?.name || 'Wallet connected'}
              </p>

              <p
                className={`mt-0.5 flex items-center gap-1 text-[11px] ${
                  connectedToBaseSepolia
                    ? 'text-emerald-200'
                    : 'text-amber-200'
                }`}
              >
                {connectedToBaseSepolia && (
                  <Check
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                )}

                {connectedToBaseSepolia
                  ? 'Connected to Base Sepolia'
                  : 'Connected to another network'}
              </p>
            </div>
          </div>

          {connectedToBaseSepolia && (
            <div className="mt-3 rounded-lg bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-[#f5eee4]/50">
                On-chain Presence Points
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#f5eee4]">
                {pointsLoading
                  ? 'Reading…'
                  : onChainPoints !== null
                    ? onChainPoints.toLocaleString()
                    : '—'}
              </p>

              {pointsError && (
                <p className="mt-1 text-[10px] text-amber-200">
                  {pointsError}
                </p>
              )}
            </div>
          )}

          {!connectedToBaseSepolia && (
            <button
              type="button"
              onClick={handleSwitch}
              disabled={isSwitching}
              className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-xs font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-60"
            >
              {isSwitching
                ? 'Switching to Base Sepolia…'
                : 'Switch to Base Sepolia'}
            </button>
          )}

          <button
            type="button"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs text-[#f5eee4]/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
          >
            {isDisconnecting ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}

            {isDisconnecting
              ? 'Disconnecting…'
              : 'Disconnect wallet'}
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs font-medium text-[#f5eee4]/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <Wallet
                className="h-4 w-4 text-[#d8b784]"
                aria-hidden="true"
              />

              <span className="flex-1">
                Connect Wallet
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  open ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {open && (
            <div className="space-y-1 rounded-xl border border-white/10 bg-black/10 p-2">
              {connectors.map((availableConnector) => (
                <button
                  key={availableConnector.uid}
                  type="button"
                  onClick={() =>
                    handleConnect(availableConnector)
                  }
                  disabled={isConnecting}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-[#f5eee4]/85 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
                >
                  {isConnecting &&
                  pendingConnector === availableConnector.uid ? (
                    <LoaderCircle
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Wallet
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  )}

                  {connectorLabels[availableConnector.id] ||
                    availableConnector.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {errorMessage && (
        <p
          role="status"
          className="px-1 text-[11px] leading-relaxed text-amber-200"
        >
          {connectError
            ? connectError.message
            : switchError
              ? 'Couldn’t switch networks. Try again from your wallet.'
              : 'Couldn’t disconnect the wallet. Please try again.'}
        </p>
      )}
    </div>
  );
}