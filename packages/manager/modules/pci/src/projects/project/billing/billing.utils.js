const getDuration = ({ beginDate, endDate }, format) =>
  moment(endDate).diff(moment(beginDate), format);

const formatPrice = (price, value) =>
  price.text.replace(/([0-9]|\.|,)+/g, Math.round(value * 100) / 100);

export const getConsumptionByTheMinute = (consumption) => {
  const durationInMinutes = getDuration(consumption, 'minutes');
  const priceByTheMinute = consumption.price.value / durationInMinutes;
  return formatPrice(consumption.price, priceByTheMinute);
};

export const getConsumptionByTheHour = (consumption) => {
  const durationInHours = getDuration(consumption, 'hour');
  const priceByTheHour = consumption.price.value / durationInHours;
  return formatPrice(consumption.price, priceByTheHour);
};

export const getPrice = (catalogItem, price) => {
  const value =
    catalogItem.pricings.find(({ capacities }) =>
      capacities.includes('consumption'),
    )?.price / 100000000;
  const unit = catalogItem.planCode.includes('.postpaid') ? 'month' : 'hour';
  return {
    value: formatPrice(price, value),
    unit,
  };
};

export default {
  getConsumptionByTheMinute,
  getConsumptionByTheHour,
  getPrice,
};
