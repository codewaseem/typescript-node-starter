import { observable, computed, action, reaction, when } from "mobx";

// configure({
//   enforceActions: "observed",
// });

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

class Cart {
  @observable items: CartItem[] = [];
  @observable modified = Date.now();
  cancelPriceTracker: Function | null = null;

  @computed get description() {
    switch (this.items.length) {
      case 0:
        return `Cart is empty`;
      case 1:
        return `Cart only has one item`;
      default:
        return `Cart has ${this.items.length} items.`;
    }
  }

  @action.bound
  addItem(name: string, price = 500, quantity = 1) {
    this.items.push({
      name,
      price,
      quantity,
    });
  }

  @action.bound
  changePrice(name: string, newPrice: number) {
    let item = this.items.find((item) => item.name == name);
    if (item) {
      item.price = newPrice;
    }
  }

  trackPriceChangeFor(this: Cart, itemName: string) {
    if (this.cancelPriceTracker) {
      this.cancelPriceTracker();
    }

    this.cancelPriceTracker = reaction(
      () => {
        const item = this.items.find((item) => item.name == itemName);
        return item ? item.price : null;
      },
      (price) => {
        console.log(`Price updated for ${itemName}, new price is ${price}`);
      }
    );
  }

  async trackAvailability(this: Cart, itemName: string) {
    const item = this.items.find((item) => item.name == itemName);
    await when(() => (item ? item.quantity > 0 : false));

    console.log(`The ${itemName} is now available`);
  }

  @action.bound
  changeQuantity(itemName: string, newQuantity: number) {
    let item = this.items.find((item) => item.name == itemName);
    if (item) {
      item.quantity = newQuantity;
    }
  }
}

let cart = new Cart();

cart.addItem("ice cream", 500, 0);

cart.trackPriceChangeFor("ice cream");

cart.changePrice("ice cream", 200);
cart.changePrice("ice cream", 200);
cart.changePrice("ice cream", 250);
cart.trackAvailability("ice cream");
cart.changeQuantity("ice cream", 4);
cart.changeQuantity("ice cream", 5);
