import { get } from 'lodash-es';

export const trimAddonName = (addonName) => addonName.split('rental')[0];

export const buildAddonsCommercialName = (service, property) =>
  service.addons.flatMap((addon) => [
    trimAddonName(get(addon, property, '')),
    ...buildAddonsCommercialName(addon, property),
  ]);

export const getProposedDatacenter = (configuration) =>
  configuration.find(({ name }) => name === 'dedicated_datacenter')?.value;

export const getDatacenter = (configuration) =>
  configuration.find(({ key }) => key === 'datacenter')?.value;

export const getStatus = (service) =>
  ['SBG1', 'SBG2'].includes(getDatacenter(service.serviceToMigrate.metadata))
    ? 'OUT_OF_ORDER'
    : '';

export const isOutOfOrder = (service) => getStatus(service) === 'OUT_OF_ORDER';

export const getDiscountAsMonth = ({ promotion }) =>
  moment.duration(promotion.duration).asMonths();

export const findPrice = (plan) =>
  plan.prices.find(({ capacities }) => capacities.includes('renew'))?.price;

export const getPrice = (service) =>
  findPrice(service.proposedOffer.plan)?.value +
  service.addons.reduce((acc, addon) => acc + getPrice(addon), 0);

export const formatPrice = (service, price) =>
  findPrice(service.proposedOffer.plan).text.replace(/([0-9]|\.|,)+/g, price);

export default {
  buildAddonsCommercialName,
  formatPrice,
  getDatacenter,
  getPrice,
  getProposedDatacenter,
  getStatus,
  isOutOfOrder,
};
