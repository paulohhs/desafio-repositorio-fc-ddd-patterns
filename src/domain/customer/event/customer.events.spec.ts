import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";

describe("CustomerCreated domain event unit test", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should notify both handlers exactly once when a customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");
    const spyHandler2 = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    new Customer("123", "Customer 1", eventDispatcher);

    expect(spyHandler1).toHaveBeenCalledTimes(1);
    expect(spyHandler2).toHaveBeenCalledTimes(1);
  });

  it("should carry the customer id and name in the event payload", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);

    new Customer("123", "Customer 1", eventDispatcher);

    const publishedEvent = spyHandler1.mock.calls[0][0];
    expect(publishedEvent).toBeInstanceOf(CustomerCreatedEvent);
    expect(publishedEvent.eventData).toEqual({ id: "123", name: "Customer 1" });
    expect(publishedEvent.dataTimeOccurred).toBeInstanceOf(Date);
  });

  it("should not notify handlers when no event dispatcher is provided", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);

    new Customer("123", "Customer 1");

    expect(spyHandler1).not.toHaveBeenCalled();
  });

  it("should not notify handlers when the customer is invalid", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new EnviaConsoleLog1Handler();
    const spyHandler1 = jest.spyOn(handler1, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);

    expect(() => {
      new Customer("", "Customer 1", eventDispatcher);
    }).toThrowError("Id is required");

    expect(spyHandler1).not.toHaveBeenCalled();
  });
});
