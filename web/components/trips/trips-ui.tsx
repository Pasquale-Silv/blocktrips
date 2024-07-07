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
            <label htmlFor="dod" className='block text-sm font-medium leading-6 text-gray-900'>Date of Departure</label>
            <input type="date" name='dod' placeholder='Date of departure' onChange={(e) => setDateOfDeparture(e.target.value)} className='block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            <label htmlFor="enddate" className='block text-sm font-medium leading-6 text-gray-900'>End date of the trip</label>
            <input type="date" name='enddate' placeholder='End date of the trip' onChange={(e) => setEndDate(e.target.value)} className='block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            <label htmlFor="price" className='block text-sm font-medium leading-6 text-gray-900'>Price</label>
            <input type="number" name='price' placeholder='Price' onChange={(e) => setPrice(parseFloat(e.target.value))} className='block w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
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
  const { publicKey } = useWallet();
  const { accounts, getProgramAccount } = useTripsProgram();
  const accountsAccomBusiness = accounts.data?.filter((account) => account.account.accommodationBusiness.toString() == publicKey?.toString())

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
      {accountsAccomBusiness === undefined ? (
        <p>No Trips...</p>
      ) : accountsAccomBusiness.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accountsAccomBusiness.map((account) => (
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
    setPriceMutation,
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
          { isForSale && traveler.toString() == "11111111111111111111111111111111" ? (
          <>
            <h2 className="card-title justify-center text-3xl text-indigo-600">
              This Trip is still "For Sale"
            </h2>
            <div className="card-actions justify-around">
              <button
                className="btn btn-xs lg:btn-md btn-outline"
                onClick={() => {
                  const value = window.prompt(
                    'Set new price value to:',
                    price.toString() ?? '0'
                  );
                  if (
                    !value ||
                    parseInt(value) === price ||
                    isNaN(parseInt(value))
                  ) {
                    return;
                  }
                  return setPriceMutation.mutateAsync(parseInt(value));
                }}
                disabled={setPriceMutation.isPending}
              >
                Set a new price for this trip
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
          </>
          ) : (
            <h2 className="card-title justify-center text-3xl text-indigo-600">
              Traveler: {traveler.toString()}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
