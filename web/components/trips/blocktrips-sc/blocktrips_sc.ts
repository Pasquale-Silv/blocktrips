/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/blocktrips_sc.json`.
 */
export type BlocktripsSc = {
  "address": "Eu6oXy1qR4xBfxNphKzeBMA41tT3EycJRs7wVNCNSnDN",
  "metadata": {
    "name": "blocktripsSc",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "close",
      "discriminator": [
        98,
        165,
        201,
        177,
        108,
        65,
        206,
        96
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "trip",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "trip",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "accommodationBusiness",
          "type": "pubkey"
        },
        {
          "name": "dateOfDeparture",
          "type": "string"
        },
        {
          "name": "endDate",
          "type": "string"
        },
        {
          "name": "price",
          "type": "f64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "trip",
      "discriminator": [
        181,
        162,
        236,
        3,
        69,
        140,
        211,
        173
      ]
    }
  ],
  "types": [
    {
      "name": "trip",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "review",
            "type": "string"
          },
          {
            "name": "traveler",
            "type": "pubkey"
          },
          {
            "name": "accommodationBusiness",
            "type": "pubkey"
          },
          {
            "name": "isForSale",
            "type": "bool"
          },
          {
            "name": "price",
            "type": "f64"
          },
          {
            "name": "dateOfDeparture",
            "type": "string"
          },
          {
            "name": "endDate",
            "type": "string"
          }
        ]
      }
    }
  ]
};
