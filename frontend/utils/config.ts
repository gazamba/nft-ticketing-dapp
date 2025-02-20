"server only";

import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_PINATA_PUBLIC_GATEWAY_URL}`,
});
