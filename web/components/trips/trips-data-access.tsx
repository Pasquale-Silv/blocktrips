'use client';

import { getTripsProgram, getTripsProgramId } from './blocktrips-sc/trips-exports';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

const anchor = require('@project-serum/anchor');

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
  const { connection } = useConnection();
  const wallet = useWallet();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useTripsProgram();

  const accountQuery = useQuery({
    queryKey: ['trips', 'fetch', { cluster, account }],
    queryFn: () => program.account.trip.fetch(account),
  });

  const setPriceMutation = useMutation({
    mutationKey: ['trips', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.setPrice(value).accounts({ trip: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const buyFunction = async (travelerBuyer: PublicKey, accommodation_business: PublicKey, amount: number) => {
    console.log("Buying the trip...");
    const amountToTransfer = new anchor.BN(amount * LAMPORTS_PER_SOL);
    console.log("Trasferring ", amountToTransfer);
    const signature = await program.methods.buy(travelerBuyer, amountToTransfer).accounts({ trip: account, from: travelerBuyer, to: accommodation_business }).rpc();
      try {
        
        console.log("Successfully bought the Trip!");
        console.log("Your transaction signature:", signature);
        transactionToast(signature);
        return accountQuery.refetch();
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`);
        return accountQuery.refetch();
      }
  }

  const closeMutation = useMutation({
    mutationKey: ['trips', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ trip: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    setPriceMutation,
    buyFunction,
  };
}


// Function for creating the Transaction for transferring SOL
async function createTransaction({
  publicKey,
  destination,
  amount,
  connection,
}: {
  publicKey: PublicKey;
  destination: PublicKey;
  amount: number;
  connection: Connection;
}): Promise<{
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
}> {
  // Get the latest blockhash to use in our transaction
  const latestBlockhash = await connection.getLatestBlockhash();

  // Create instructions to send, in this case a simple transfer
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  ];

  // Create a new TransactionMessage with version and compile it to legacy
  const messageLegacy = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage();

  // Create a new VersionedTransaction which supports legacy and v0
  const transaction = new VersionedTransaction(messageLegacy);

  return {
    transaction,
    latestBlockhash,
  };
}
