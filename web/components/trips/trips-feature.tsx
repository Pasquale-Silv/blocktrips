'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useTripsProgram } from './trips-data-access';
import { TripsCreate, TripsList } from './trips-ui';

export default function TripsFeature() {
  const { publicKey } = useWallet();
  const { programId } = useTripsProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Trips"
        subtitle={
          'Create a new Trip account by clicking the "Create Trip" button. The state of a Trip account is stored on-chain and can be manipulated by calling the program\'s methods.'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <TripsCreate />
      </AppHero>
      <TripsList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
