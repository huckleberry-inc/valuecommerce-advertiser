import fetch, { RequestInit } from 'node-fetch';
import { stringify } from 'query-string';

type TokenResponse = {
  resultSet: {
    responseInfo: {
      numberOfResult: number;
      nextOffset: number;
      responseTime: string;
    };
    requestInfo: {
      query: string;
      requestTime: string;
    };
    rowData: {
      // eslint-disable-next-line camelcase
      bearer_token: string;
    };
  };
};

type TransactionResponse = {
  resultSet: {
    responseInfo: {
      numberOfResult: number;
      nextOffset: number;
      responseTime: string;
    };
    requestInfo: {
      query: string;
      requestTime: string;
    };
    rowData: {
      affilId: string;
      affilPayment: string;
      affilPaymentNet: string;
      affilPaymentTax: string;
      affiliateSite: string;
      approvalDate: string | null; // TODO
      approvalDeadline: string;
      approvalStatus: 'P'; // TODO
      clickDate: string;
      custEmail: string;
      custName: string;
      custTel: string;
      customerStatus: string | null; // TODO
      itemPriceTotal: string;
      itemQuantity: string;
      orderDate: string;
      orderId: string;
      programName: string;
      updDate: string;
      userId: string | null; // TODO
    }[];
  };
};

type TransactionStatusResponse = {
  resultSet: {
    responseInfo: {
      numberOfResult: number;
      nextOffset: number;
      responseTime: string;
    };
    requestInfo: {
      query: string;
      requestTime: string;
    };
    rowData: {
      result: boolean;
    };
  };
};

export class Client {
  clientKey: string;

  clientSecret: string;

  constructor({
    clientKey,
    clientSecret,
  }: {
    clientKey: string;
    clientSecret: string;
  }) {
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
  }

  async token(): Promise<TokenResponse> {
    const accessToken = Buffer.from(
      `${this.clientKey}|${this.clientSecret}`,
    ).toString('base64');
    const params = stringify({
      grant_type: 'client_credentials',
    });

    return this.request<TokenResponse>(
      `https://api.valuecommerce.com/auth/v1/merchant/token/?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }

  async transaction(
    bearerToken: string,
    option: any = {}, // TODO:
  ): Promise<TransactionResponse> {
    const params = stringify(option);

    return this.request<TransactionResponse>(
      `https://api.valuecommerce.com/report/v1/merchant/transaction/?${params}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          Accept: 'application/json',
        },
      },
    );
  }

  // TODO: add params option
  transactionStatus(
    bearerToken: string,
    statusSet: Map<string, boolean>,
  ): Promise<TransactionStatusResponse> {
    const params = stringify({
      order: JSON.stringify({
        list: Array.from(statusSet).map(([orderId, status]) => {
          return {
            id: orderId,
            st: status ? 'a' : 'c', // "a" means "accept", "c" means "cancel". Ref: https://pub-docs.valuecommerce.ne.jp/docs/ec-76-order-status-api/#%E3%83%9A%E3%82%A4%E3%83%AD%E3%83%BC%E3%83%89
          };
        }),
      }),
    });

    return this.request<TransactionStatusResponse>(
      'https://api.valuecommerce.com/modify/v1/merchant/transaction/status/',
      {
        body: params,
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        method: 'POST',
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private async request<T>(url: string, option: RequestInit) {
    const response = await fetch(url, option).catch(() => {
      // TODO: error handling

      throw new Error();
    });

    return (await response.json()) as T;
  }
}
