import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";

describe("CustomerCreated domain event unit test", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should record a CustomerCreatedEvent when a customer is created", () => {
    const customer = new Customer("123", "Customer 1");

    expect(customer.events).toHaveLength(1);

    const recordedEvent = customer.events[0] as CustomerCreatedEvent;
    expect(recordedEvent).toBeInstanceOf(CustomerCreatedEvent);
    expect(recordedEvent.eventData).toEqual({ id: "123", name: "Customer 1" });
    expect(recordedEvent.dataTimeOccurred).toBeInstanceOf(Date);
  });

  it("should not notify handlers until the recorded events are dispatched", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);

    new Customer("123", "Customer 1");

    expect(spyHandler1).not.toHaveBeenCalled();
  });

  it("should notify both handlers exactly once when the recorded events are dispatched", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");
    const spyHandler2 = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    const customer = new Customer("123", "Customer 1");
    customer.events.forEach((event) => eventDispatcher.notify(event));

    expect(spyHandler1).toHaveBeenCalledTimes(1);
    expect(spyHandler2).toHaveBeenCalledTimes(1);
  });

  it("should clear the recorded events once they are drained", () => {
    const customer = new Customer("123", "Customer 1");
    expect(customer.events).toHaveLength(1);

    customer.clearEvents();

    expect(customer.events).toHaveLength(0);
  });
});
