import './atInternetTracking.config';
import './autoRenew/actions/activation/activation.component';
import './autoRenew/actions/activation/activation.controller';
import './autoRenew/actions/activation/activation.routing';
import './autoRenew/cancel-resiliation/cancel-resiliation.routing';
import './autoRenew/actions/debtBeforePaying/debtBeforePaying.component';
import './autoRenew/actions/debtBeforePaying/debtBeforePaying.routing';
import './autoRenew/actions/exchange/exchange-renew.routing';
import './autoRenew/actions/terminate-enterprise-cloud-database/terminate-enterprise-cloud-database.component';
import './autoRenew/actions/terminate-enterprise-cloud-database/terminate-enterprise-cloud-database.controller';
import './autoRenew/actions/terminate-enterprise-cloud-database/terminate-enterprise-cloud-database.routing';
import './autoRenew/actions/terminate-webcoach/terminate-webcoach.component';
import './autoRenew/actions/terminate-webcoach/terminate-webcoach.controller';
import './autoRenew/actions/terminate-webcoach/terminate-webcoach.routing';
import './autoRenew/actions/terminate/terminate.component';
import './autoRenew/actions/terminate/terminate.controller';
import './autoRenew/actions/terminateEmail/billing-autoRenew-terminateEmail.controller';
import './autoRenew/actions/terminateEmail/email.component';
import './autoRenew/actions/terminateEmail/email.routing';
import './autoRenew/actions/terminateHostingWeb/billing-autoRenew-terminateHostingWeb.controller';
import './autoRenew/actions/terminateHostingWeb/hosting-web.component';
import './autoRenew/actions/terminateHostingWeb/hosting-web.routing';
import './autoRenew/actions/terminatePrivateDatabase/billing-autoRenew-terminatePrivateDatabase.controller';
import './autoRenew/actions/terminatePrivateDatabase/private-database.component';
import './autoRenew/actions/terminatePrivateDatabase/private-database.routing';
import './autoRenew/actions/update/automatic/automatic.component';
import './autoRenew/actions/update/form/form.component';
import './autoRenew/actions/update/form/form.constants';
import './autoRenew/actions/update/form/form.controller';
import './autoRenew/actions/update/form/form.service';
import './autoRenew/actions/update/manualPayment/manualPayment.component';
import './autoRenew/actions/update/noPaymentMean/noPaymentMean.component';
import './autoRenew/actions/update/update.component';
import './autoRenew/actions/update/update.controller';
import './autoRenew/actions/update/update.routing';
import './autoRenew/actions/warnNicBilling/warnNicBilling.component';
import './autoRenew/actions/warnNicBilling/warnNicBilling.routing';
import './autoRenew/actions/warnPendingDebt/pending-debt.component';
import './autoRenew/actions/warnPendingDebt/pending-debt.routing';
import './autoRenew/agreements/details/details.routing';
import './autoRenew/agreements/details/user-agreements-details.controller';
import './autoRenew/agreements/user-agreements.constant';
import './autoRenew/agreements/user-agreements.controller';
import './autoRenew/agreements/user-agreements.routes';
import './autoRenew/agreements/user-agreements.service';
import './autoRenew/autorenew.component';
import './autoRenew/autorenew.constants';
import './autoRenew/autorenew.controller';
import './autoRenew/autorenew.routing';
import './autoRenew/autorenew.service';
import './autoRenew/bulk/bulk.component';
import './autoRenew/bulk/bulk.controller';
import './autoRenew/disable-domains-bulk/disable-domains-bulk.component';
import './autoRenew/disable-domains-bulk/disable-domains-bulk.controller';
import './autoRenew/disable-domains-bulk/disable-domains-bulk.routing';
import './autoRenew/disable/disable.component';
import './autoRenew/disable/disable.controller';
import './autoRenew/disable/disable.routing';
import './autoRenew/disable/disable.service';
import './autoRenew/enable/enable.component';
import './autoRenew/enable/enable.controller';
import './autoRenew/enable/enable.routing';
import './autoRenew/enable/enable.service';
import './autoRenew/ssh/add/cloud/user-ssh-add-cloud.controller';
import './autoRenew/ssh/add/dedicated/user-ssh-add-dedicated.controller';
import './autoRenew/ssh/delete/user-ssh-delete.controller';
import './autoRenew/ssh/ssh.routing';
import './autoRenew/ssh/user-ssh.controller';
import './autoRenew/ssh/user-ssh.service';
import './autoRenew/ssh/view/user-ssh-view.controller';
import './billing-feature-availability';
import './billing.controller';
import './billing.routing';
import './common/Auth';
import './common/dateRangeSelection';
import './common/messageParser';
import './common/renew-helper.service';
import './common/User';
import './components/api/api-schema';
import './components/api/api';
import './components/directives/dateRange/billingDateRange.controller';
import './components/directives/dateRange/billingDateRange.directive';
import './components/directives/sortingFieldButton/billingSortingFieldButton';
import './components/directives/sortingFieldButton/billingSortingFieldButtonCtrl';
import './components/filters/renewFrequence';
import './components/renewDate/billing-renew-date.component';
import './components/renewLabel/billing-renew-label.component';
import './constants/autorenewEvent.constants';
import './constants/fidelityEvent.constants';
import './constants/ovhAccountEvent.constants';
import './constants/paymentEvent.constants';
import './dbtAccount/billing-debtAccount.service';
import './main/billing-main.controller';
import './main/billing-main.routes';
import './main/history/balance/billing-history-balance.controller';
import './main/history/balance/billing-history-balance.routes';
import './main/history/debt/billing-main-history-debt.routes';
import './main/history/debt/details/billing-main-history-debt-details.controller';
import './main/history/debt/details/billing-main-history-debt-details.routes';
import './main/history/debt/pay/billing-main-history-debt-pay.controller';
import './main/history/debt/pay/billing-main-history-debt-pay.routes';
import './main/history/postalMailOptions/billing-main-history-postal-mail-options.controller';
import './main/payAsYouGo/billing-main-pay-as-you-go.controller';
import './main/payAsYouGo/billing-main-pay-as-you-go.routes';
import './main/payments/billing-payments.controller';
import './main/payments/billing-payments.routes';
import './main/payments/billing-payments.service';
import './main/payments/details/billing-payments-details.controller';
import './main/payments/details/billing-payments-details.routes';
import './main/payments/request/billing-payments-request.controller';
import './main/payments/request/billing-payments-request.routes';
import './order/billing-order-tracking.controller';
import './order/billing-order-tracking.routing';
import './orders/billing-orders-apiv7.service';
import './orders/billing-orders-statusEnum.service';
import './orders/billing-orders-statusFilters.service';
import './orders/billing-orders.controller';
import './orders/billing-orders.service';
import './orders/orders.routing';
import './orders/retraction/billing-orders-retraction.controller';
import './orders/retraction/retraction.routing';
import './payment/billing-payment.controller';
import './payment/billing-payment.routes';
import './payment/credits/billing-credits.controller';
import './payment/credits/billing-credits.service';
import './payment/credits/billing-payment-credits.routes';
import './payment/credits/movements/billing-credits-movements.controller';
import './payment/credits/movements/billing-payment-credits-movements.routes';
import './payment/fidelity/billing-fidelity.controller';
import './payment/fidelity/billing-fidelity.service';
import './payment/fidelity/billing-payment-fidelity.routes';
import './payment/fidelity/creditOrder/billing-fidelity-creditOrder.controller';
import './payment/method/add/component';
import './payment/method/add/constants';
import './payment/method/add/controller';
import './payment/method/add/index';
import './payment/method/add/routing';
import './payment/method/add/views/billingContact/component';
import './payment/method/add/views/billingContact/controller';
import './payment/method/add/views/billingContact/index';
import './payment/method/add/views/legacyBankAccount/component';
import './payment/method/add/views/legacyBankAccount/controller';
import './payment/method/add/views/legacyBankAccount/index';
import './payment/method/add/views/legacyBillingAddress/component';
import './payment/method/add/views/legacyBillingAddress/controller';
import './payment/method/add/views/legacyBillingAddress/index';
import './payment/method/component';
import './payment/method/constants';
import './payment/method/controller';
import './payment/method/default/component';
import './payment/method/default/index';
import './payment/method/default/routing';
import './payment/method/delete/component';
import './payment/method/delete/index';
import './payment/method/delete/routing';
import './payment/method/edit/component';
import './payment/method/edit/index';
import './payment/method/edit/routing';
import './payment/method/index';
import './payment/method/routing';
import './payment/ovhAccount/billing-ovhAccount.controller';
import './payment/ovhAccount/billing-ovhAccount.service';
import './payment/ovhAccount/billing-payment-ovhAccount.routes';
import './payment/ovhAccount/createAlert/billing-ovhAccount-createAlert.controller';
import './payment/ovhAccount/renew/billing-ovhAccount-renew.controller';
import './payment/vouchers/billing-payment-voucher.routes';
import './payment/vouchers/billing-vouchers.controller';
import './payment/vouchers/billing-vouchers.service';
import './payment/vouchers/movements/billing-payment-vouchers-movements.routes';
import './payment/vouchers/movements/billing-vouchers-movements.controller';
import './sla/billing-sla.controller';
import './sla/billing-sla.service';
import './sla/sla.routing';
