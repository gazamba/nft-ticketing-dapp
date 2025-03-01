import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { EventCanceled } from "../generated/schema"
import { EventCanceled as EventCanceledEvent } from "../generated/EventFactory/EventFactory"
import { handleEventCanceled } from "../src/event-factory"
import { createEventCanceledEvent } from "./event-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let eventId = BigInt.fromI32(234)
    let newEventCanceledEvent = createEventCanceledEvent(eventId)
    handleEventCanceled(newEventCanceledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("EventCanceled created and stored", () => {
    assert.entityCount("EventCanceled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "EventCanceled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "eventId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
