'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useTripsProgram } from './trips-data-access';
import { TripsTravelerList } from './traveler-trips-ui';

export default function TravelerTripsFeature() {
  const { publicKey } = useWallet();
  const { programId } = useTripsProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Trips"
        subtitle={
          'Available Trips for Travelers.'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
      </AppHero>
      <TripsTravelerList />
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
