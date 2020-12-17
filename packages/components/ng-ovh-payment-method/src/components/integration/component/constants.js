export const ADYEN_CONFIG = {
  DEFAULT: {
    environment: 'test', // TODO REMOVE // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/checkout/components-web#testing-your-integration.
    // showPayButton: false, // Adyen provides a Pay button. To use the Pay button for each payment method, set this to true. The Pay button triggers the onSubmit event. If you want to use your own button and then trigger the submit flow on your own, set this to false and call the .submit() method from your own button implementation. For example, component.submit().
    hasHolderName: true, // Show the input field for the card holder name.
    holderNameRequired: true, // Make the card holder name a required field
    styles: {
      base: {
        color: '#4F558E',
        lineHeight: '20px',
        fontFamily: '"Source Sans Pro", "Segoe UI", sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
      },
      placeholder: {
        color: '#4F558E',
      },
    },
  },
};
export default {
  ADYEN_CONFIG,
};
