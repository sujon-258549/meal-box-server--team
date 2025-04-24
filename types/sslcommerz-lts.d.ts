// declare module 'sslcommerz-lts' {
//   interface SSLCommerzInitData {
//     total_amount: number;
//     currency: string;
//     success_url: string;
//     fail_url: string;
//     cancel_url: string;
//     ipn_url?: string;
//     shipping_method: string;
//     product_name: string;
//     product_category: string;
//     product_profile: string;
//     cus_name: string;
//     cus_email: string;
//     cus_add1: string;
//     cus_add2?: string;
//     cus_city: string;
//     cus_state: string;
//     cus_postcode: string | number;
//     cus_country: string;
//     cus_phone: string;
//     cus_fax?: string;
//     ship_name: string;
//     ship_add1: string;
//     ship_add2?: string;
//     ship_city: string;
//     ship_state: string;
//     ship_postcode: string | number;
//     ship_country: string;
//     tran_id: string | number;
//   }

//   class SSLCommerzPayment {
//     constructor(storeId: string, storePassword: string, isLive: boolean);
//     init(data: SSLCommerzInitData): Promise<any>;
//   }

//   export default SSLCommerzPayment;
// }

// declare module 'sslcommerz-lts' {
//   export interface SSLCommerzInitData {
//     total_amount: number;
//     currency: string;
//     success_url: string;
//     fail_url: string;
//     cancel_url: string;
//     ipn_url?: string;
//     shipping_method: string;
//     product_name: string;
//     product_category: string;
//     product_profile: string;
//     cus_name: string;
//     cus_email: string;
//     cus_add1: string;
//     cus_add2?: string;
//     cus_city: string;
//     cus_state: string;
//     cus_postcode: string | number;
//     cus_country: string;
//     cus_phone: string;
//     cus_fax?: string;
//     ship_name: string;
//     ship_add1: string;
//     ship_add2?: string;
//     ship_city: string;
//     ship_state: string;
//     ship_postcode: string | number;
//     ship_country: string;
//     tran_id: string | number;
//   }

//   class SSLCommerzPayment {
//     constructor(storeId: string, storePassword: string, isLive: boolean);

//     init(data: SSLCommerzInitData): Promise<{
//       GatewayPageURL: string;
//       [key: string]: unknown;
//     }>;

//     transactionQueryByTransactionId(data: { tran_id: string }): Promise<{
//       element: {
//         status: string;
//         [key: string]: unknown;
//       }[];
//     }>;
//   }

//   export default SSLCommerzPayment;
// }

declare module 'sslcommerz-lts' {
  export interface SSLCommerzInitData {
    total_amount: number;
    currency: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_add2?: string;
    cus_city: string;
    cus_state: string;
    cus_postcode: string | number;
    cus_country: string;
    cus_phone: string;
    cus_fax?: string;
    ship_name: string;
    ship_add1: string;
    ship_add2?: string;
    ship_city: string;
    ship_state: string;
    ship_postcode: string | number;
    ship_country: string;
    tran_id: string | number;
  }

  class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);

    init(data: SSLCommerzInitData): Promise<{
      GatewayPageURL: string;
      [key: string]: unknown;
    }>;

    transactionQueryByTransactionId(data: { tran_id: string }): Promise<{
      element: {
        status: string;
        [key: string]: unknown;
      }[];
    }>;
  }

  export default SSLCommerzPayment;
}
