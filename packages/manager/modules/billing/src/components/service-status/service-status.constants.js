export const SERVICE_STATES = {
  error: ['expired', 'delete_at_expiration'],
  success: ['auto', 'automatic'],
  warning: ['manual', 'manualPayment'],
  info: ['billing_suspended'],
};

export default {
  SERVICE_STATES,
};
