'use client';

import { getTripsProgram, getTripsProgramId } from './blocktrips-sc/trips-exports';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useTripsProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getTripsProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getTripsProgram(provider);

  const accounts = useQuery({
    queryKey: ['trips', 'all', { cluster }],
    queryFn: () => program.account.trip.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = async (keypair: Keypair, accommodation_business: PublicKey, date_of_departure: string, end_date: string, price: number) => {
    const signature = await program.methods
        .initialize(accommodation_business, date_of_departure, end_date, price)
        .accounts({ trip: keypair.publicKey })
        .signers([keypair])
        .rpc();
    
    console.log("Your transaction signature:", signature);
    transactionToast(signature);
    return accounts.refetch();
  }

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useTripsProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useTripsProgram();

  const accountQuery = useQuery({
    queryKey: ['trips', 'fetch', { cluster, account }],
    queryFn: () => program.account.trip.fetch(account),
  });

  return {
    accountQuery,
  };
}
