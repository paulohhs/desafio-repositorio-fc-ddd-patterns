import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      { where: { id: entity.id } }
    );

    await OrderItemModel.destroy({ where: { order_id: entity.id } })

    await OrderItemModel.bulkCreate(
      entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      })),
      { updateOnDuplicate: ["name", "price", "quantity"] }
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel, as: "items" }],
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    if (!orderModel) {
      throw new Error("Order not found");
    }

    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      ))
    );

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    if(orderModels.length === 0) {
      throw new Error("Orders not found");
    }

    const orders = orderModels.map((om) => {
      return new Order(
        om.id,
        om.customer_id,
        om.items.map((item) => new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        ))
      );
    });
    return orders;
  }
}
