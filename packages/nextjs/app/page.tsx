"use client";

import Image from "next/image";
import Link from "next/link";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useSigner } from "~~/utils/scaffold-eth/eas-wagmi-utils";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const signer = useSigner();

  const attestProductProvenace = async () => {
    const easContractAddress = "0x4200000000000000000000000000000000000021";
    const schemaUID = "0xa18f97dfff3f61f3577d9019d0af390b2375d315555482fe379256b504e6d5e4";
    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.

    if (signer) {
      await eas.connect(signer);
    }

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "bytes32 productId,string productName,address producerAddress,bytes32 batchId,uint64 productionDate,uint64 expirationDate",
    );
    const encodedData = schemaEncoder.encodeData([
      {
        name: "productId",
        value: "0x6162633132330000000000000000000000000000000000000000000000000000",
        type: "bytes32",
      },
      { name: "productName", value: "abc123", type: "string" },
      { name: "producerAddress", value: "0x0000000000000000000000000000000000000000", type: "address" },
      { name: "batchId", value: "0x6162633132330000000000000000000000000000000000000000000000000000", type: "bytes32" },
      { name: "productionDate", value: "0", type: "uint64" },
      { name: "expirationDate", value: "0", type: "uint64" },
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x0000000000000000000000000000000000000000",
        expirationTime: 0n,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <div className="block text-4xl font-bold">
              <div className="inline-block relative w-10 h-10 align-bottom mr-2">
                <Image alt="Base logo" className="cursor-pointer" fill src="/Base_Symbol_Blue.svg" />
              </div>
              Scaffold-Base
            </div>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="pt-10" data-tip="Attest Product Provenance">
          <button className="btn btn-secondary btn-sm px-2 rounded-full" onClick={() => attestProductProvenace()}>
            Attest Product Provenance
          </button>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
