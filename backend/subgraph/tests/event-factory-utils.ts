import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  EventCanceled,
  EventCreated
} from "../generated/EventFactory/EventFactory"

export function createEventCanceledEvent(eventId: BigInt): EventCanceled {
  let eventCanceledEvent = changetype<EventCanceled>(newMockEvent())

  eventCanceledEvent.parameters = new Array()

  eventCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "eventId",
      ethereum.Value.fromUnsignedBigInt(eventId)
    )
  )

  return eventCanceledEvent
}

export function createEventCreatedEvent(
  eventId: BigInt,
  metadataCID: string,
  ticketNFTMetadataBaseURI: string,
  totalTickets: BigInt,
  organizer: Address
): EventCreated {
  let eventCreatedEvent = changetype<EventCreated>(newMockEvent())

  eventCreatedEvent.parameters = new Array()

  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "eventId",
      ethereum.Value.fromUnsignedBigInt(eventId)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataCID",
      ethereum.Value.fromString(metadataCID)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "ticketNFTMetadataBaseURI",
      ethereum.Value.fromString(ticketNFTMetadataBaseURI)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalTickets",
      ethereum.Value.fromUnsignedBigInt(totalTickets)
    )
  )
  eventCreatedEvent.parameters.push(
    new ethereum.EventParam("organizer", ethereum.Value.fromAddress(organizer))
  )

  return eventCreatedEvent
}
