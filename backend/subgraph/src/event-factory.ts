import {
  EventCanceled as EventCanceledEvent,
  EventCreated as EventCreatedEvent
} from "../generated/EventFactory/EventFactory"
import { EventCanceled, EventCreated } from "../generated/schema"

export function handleEventCanceled(event: EventCanceledEvent): void {
  let entity = new EventCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.eventId = event.params.eventId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEventCreated(event: EventCreatedEvent): void {
  let entity = new EventCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.eventId = event.params.eventId
  entity.metadataCID = event.params.metadataCID
  entity.ticketNFTMetadataBaseURI = event.params.ticketNFTMetadataBaseURI
  entity.totalTickets = event.params.totalTickets
  entity.organizer = event.params.organizer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
