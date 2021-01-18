import map from 'lodash/map';
import template from 'lodash/template';

export default class PciProjectNewConfigCtrl {
  /* @ngInject */
  constructor($q, orderCart, pciProjectNew) {
    this.$q = $q;
    this.orderCart = orderCart;
    this.pciProjectNew = pciProjectNew;
  }

  /* ==============================
  =            Helpers            =
  =============================== */

  getCompiledLinks(linkTemplate) {
    return map(this.checkout.contracts, (contract) => {
      const compile = template(linkTemplate);
      return compile(contract);
    }).join(', ');
  }

  setCartProjectItem() {
    if (
      this.model.description &&
      !this.cart.projectItem.descriptionConfiguration
    ) {
      return this.pciProjectNew.setCartProjectItemDescription(
        this.cart,
        this.model.description,
      );
    }

    return this.$q.when();
  }

  setHdsOptionItem() {
    const { cartId, projectItem, hdsItem } = this.cart;
    if (this.hds.isValidSupportLevel) {
      if (this.model.hds && !hdsItem) {
        const priceMode = this.hds.option.prices.find(({ capacities }) =>
          capacities.includes('renew'),
        );
        return this.orderCart
          .addNewOptionToProject(cartId, {
            duration: priceMode.duration,
            itemId: projectItem.itemId, // Add HDS option to project
            planCode: this.hds.option.planCode,
            pricingMode: priceMode.pricingMode,
            quantity: 1,
          })
          .then((option) => this.cart.addItem(option));
      }
      if (!this.model.hds && hdsItem) {
        return this.orderCart
          .deleteItem(cartId, hdsItem.itemId)
          .then(() => this.cart.deleteItem(hdsItem));
      }
    }

    return this.$q.when();
  }

  sendTracking() {
    this.trackClick('PublicCloud::pci::projects::new_project_continue');
    if (this.model.hds) {
      this.trackClick('PublicCloud::pci::projects::new_project_with_HDS');
    }
  }

  /* -----  End of Helpers  ------ */

  /* =============================
  =            Events            =
  ============================== */
  onProjectConfigFormSubmit() {
    this.sendTracking();
    return this.setCartProjectItem()
      .then(() => this.setHdsOptionItem())
      .then(() => this.goToPayment());
  }

  /* -----  End of Events  ------ */
}
