"server only";

import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT_TOKEN}`,
  pinataGateway: `${process.env.PINATA_PUBLIC_GATEWAY_URL}`,
});
