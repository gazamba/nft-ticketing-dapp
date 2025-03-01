import { gql } from "graphql-request";

export const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/105686/nft-ticketing-dapp/version/latest";

export const EVENT_QUERY = gql`
  query EventCreated($eventId: BigInt!) {
    eventCreateds(where: { eventId: $eventId }, first: 1) {
      eventId
      metadataCID
      ticketNFTMetadataBaseURI
      totalTickets
      organizer
      blockNumber
    }
  }
`;
