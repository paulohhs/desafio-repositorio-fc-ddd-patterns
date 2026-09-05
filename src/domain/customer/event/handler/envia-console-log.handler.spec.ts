import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "./envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./envia-console-log-2.handler";

describe("Enviar console.log unit test", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should print the first CustomerCreated message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const handler = new EnviaConsoleLog1Handler();
    const event = new CustomerCreatedEvent({ id: "123", name: "Customer 1" });

    handler.handle(event);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
  });

  it("should print the second CustomerCreated message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const handler = new EnviaConsoleLog2Handler();
    const event = new CustomerCreatedEvent({ id: "123", name: "Customer 1" });

    handler.handle(event);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
  });
});
