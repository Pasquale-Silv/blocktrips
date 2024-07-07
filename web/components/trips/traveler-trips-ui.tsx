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

export function TripsTravelerList() {
  const { publicKey } = useWallet();
  const { accounts, getProgramAccount } = useTripsProgram();
  // If the Public Keys are different and the trip isForSale=true, I show the trips that can be acquired by the traveler
  const accountsBuyable = accounts.data?.filter((account) => publicKey?.toString() != account.account.accommodationBusiness.toString() && account.account.isForSale && publicKey?.toString() != account.account.traveler.toString());
  const accountsTraveler = accounts.data?.filter((account) => account.account.traveler.toString() == publicKey?.toString())

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
        <h1 className="card-title justify-center text-7xl text-indigo-700">
          Buyable Trips
        </h1>
        { accountsBuyable?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
        {accountsBuyable.map((account) => (
          <TripsTravelerCardBuyable
            key={account.publicKey.toString()}
            account={account.publicKey}
          />
        ))}
      </div>
    ) : (
      <div className="text-center">
        <h2 className={'text-2xl'}>No Buyable Trips</h2>
      </div>
      )}
      <h1 className="card-title justify-center text-7xl text-indigo-700">
        My Trips
      </h1>
      { accountsTraveler?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
        {accountsTraveler.map((account) => (
          <TripsTravelerCard
            key={account.publicKey.toString()}
            account={account.publicKey}
          />
        ))}
      </div>
    ) : (
      <div className="text-center">
        <h2 className={'text-2xl'}>You have No Trips in program</h2>
        No Trips found.
      </div>
      )}
    </div>
  );
}

function TripsTravelerCardBuyable({ account }: { account: PublicKey }) {
  const { publicKey } = useWallet();
  const {
    accountQuery,
    buyFunction,
  } = useTripsProgramAccount({ account });

  const price = useMemo(
    () => accountQuery.data?.price ?? 0,
    [accountQuery.data?.price]
  );

  const accommodationBusiness = useMemo(
    () => accountQuery.data?.accommodationBusiness!,
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
    () => accountQuery.data?.traveler!,
    [accountQuery.data?.traveler]
  );
  
  return (
  accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
          <div className="card card-bordered border-base-300 border-4 text-neutral-content">
          <div className="card-body items-center text-center">
              <div className="space-y-6">
              <h3 className="card-title justify-center text-indigo-600">
                  Accommodation Business: {accommodationBusiness.toString()}
              </h3>
              <h2 className="card-title justify-center text-3xl text-indigo-600">
                  Date of departure: {dateOfDeparture}
              </h2>
              <h2 className="card-title justify-center text-3xl text-indigo-600">
                  End Date: {endDate}
              </h2>
              <h2 className="card-title justify-center text-5xl text-indigo-600">
                  Trip's price: {price} SOL
              </h2>
              <div className="card-actions justify-around">
                  <button
                  className="btn btn-xs lg:btn-md btn-outline"
                  onClick={() => buyFunction(publicKey!, accommodationBusiness, price)}
                  >
                  Buy Trip for {price} SOL
                  </button>
              </div>
              <div className="text-center space-y-4">
                  <p>
                  <ExplorerLink
                      path={`account/${account}`}
                      label={ellipsify(account.toString())}
                  />
                  </p>
              </div>
              </div>
          </div>
          </div>
    )
  );
}

function TripsTravelerCard({ account }: { account: PublicKey }) {
  const { publicKey } = useWallet();
  const {
    accountQuery,
    sellTripFunction
  } = useTripsProgramAccount({ account });

  const [priceSell, setPriceSell] = useState(0);

  const price = useMemo(
    () => accountQuery.data?.price ?? 0,
    [accountQuery.data?.price]
  );

  const accommodationBusiness = useMemo(
    () => accountQuery.data?.accommodationBusiness!,
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
    () => accountQuery.data?.traveler!,
    [accountQuery.data?.traveler]
  );
  
  return (
  accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
          <div className="card card-bordered border-base-300 border-4 text-neutral-content">
          <div className="card-body items-center text-center">
              <div className="space-y-6">
              <h3 className="card-title justify-center text-indigo-600">
                  Accommodation Business: {accommodationBusiness.toString()}
              </h3>
              <h2 className="card-title justify-center text-3xl text-indigo-600">
                  Date of departure: {dateOfDeparture}
              </h2>
              <h2 className="card-title justify-center text-3xl text-indigo-600">
                  End Date: {endDate}
              </h2>
              <h2 className="card-title justify-center text-5xl text-indigo-600">
                { isForSale ? (
                  <>
                    <p className="card-title justify-center text-3xl text-indigo-600">Trip's price: {price} SOL</p>
                  </>
                ) : (
                  <div className="card-actions justify-around">
                    <input type="number" placeholder='Price' onChange={(e) => setPriceSell(parseFloat(e.target.value))} />
                    <button
                      className="btn btn-xs lg:btn-md btn-outline"
                      onClick={() => sellTripFunction.mutateAsync(parseInt(priceSell.toString()))}
                    >
                      Sell your Trip
                    </button>
                  </div>
                )}
              </h2>
              </div>
          </div>
          </div>
    )
  );
}
