'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useTripsProgram,
  useTripsProgramAccount,
} from './trips-data-access';

export function TripsCreate() {
  const { publicKey } = useWallet();
  const { initialize } = useTripsProgram();

  const accommodation_business = publicKey!;
  const [dateOfDeparture, setDateOfDeparture] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState(0);

  return (
        <>
            <input type="date" placeholder='Date of departure' onChange={(e) => setDateOfDeparture(e.target.value)} />
            <input type="date" placeholder='End date of the trip' onChange={(e) => setEndDate(e.target.value)} />
            <input type="number" placeholder='Price' onChange={(e) => setPrice(parseFloat(e.target.value))} />
            <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={() => initialize(Keypair.generate(), accommodation_business, dateOfDeparture, endDate, price)}
            >
                Create Trip
            </button>
        </>
    );
}

export function TripsList() {
  const { accounts, getProgramAccount } = useTripsProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <TripsCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function TripsCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    closeMutation,
  } = useTripsProgramAccount({ account });

  const price = useMemo(
    () => accountQuery.data?.price ?? 0,
    [accountQuery.data?.price]
  );

  const accommodationBusiness = useMemo(
    () => accountQuery.data?.accommodationBusiness ?? "",
    [accountQuery.data?.accommodationBusiness]
  );

  const dateOfDeparture = useMemo(
    () => accountQuery.data?.dateOfDeparture ?? "",
    [accountQuery.data?.dateOfDeparture]
  );

  const endDate = useMemo(
    () => accountQuery.data?.endDate ?? "",
    [accountQuery.data?.endDate]
  );

  const isForSale = useMemo(
    () => accountQuery.data?.isForSale ?? 0,
    [accountQuery.data?.isForSale]
  );

  const traveler = useMemo(
    () => accountQuery.data?.traveler ?? "",
    [accountQuery.data?.traveler]
  );

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h3 className="card-title justify-center">
            Accommodation Business: {accommodationBusiness.toString()}
          </h3>
          <h2 className="card-title justify-center text-3xl">
            Date of departure: {dateOfDeparture}
          </h2>
          <h2 className="card-title justify-center text-3xl">
            End Date: {endDate}
          </h2>
          <h2 className="card-title justify-center text-5xl">
            Trip's price: {price} SOL
          </h2>
          {isForSale ? (
            <h2 className="card-title justify-center text-3xl">
              This Trip is still "For Sale"
            </h2>
          ) : (
            <h2 className="card-title justify-center text-3xl">
              Traveler: {traveler.toString()}
            </h2>
          )}
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              // onClick={() => func()}
            >
              Some Function
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close/eliminate this trip account?'
                  )
                ) {
                  return;
                }
                return closeMutation.mutateAsync();
              }}
              disabled={closeMutation.isPending}
            >
              Close Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
