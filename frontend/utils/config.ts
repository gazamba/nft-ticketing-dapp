"server only";

import { PinataSDK } from "pinata-web3";
import { env } from "process";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.PINATA_JWT_TOKEN}`,
});
