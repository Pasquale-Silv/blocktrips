// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';

// Importing the IDL and type of SC
import TripsIDL from './blocktrips_sc.json';
import type { BlocktripsSc } from './blocktrips_sc';

// Re-export the generated IDL and type
export { BlocktripsSc, TripsIDL };

// The programId is imported from the program IDL.
export const TRIPS_PROGRAM_ID = new PublicKey(TripsIDL.address);

// This is a helper function to get the Trips Anchor program.
export function getTripsProgram(provider: AnchorProvider) {
  return new Program(TripsIDL as BlocktripsSc, provider);
}

// This is a helper function to get the program ID for the Trips program depending on the Cluster.
export function getTripsProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Trips program on devnet and testnet.
      return TRIPS_PROGRAM_ID;
    case 'mainnet-beta':
    default:
      return TRIPS_PROGRAM_ID;
  }
}
