import fetch from "node-fetch";
import { stringify } from "query-string";

type Token = {
  bearer_token: string;
};

type Transaction = {
  id: number;
};

export class ValueCommerceAdvertiser {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  token() {
    const params = stringify({
      grant_type: "client_credentials"
    });

    return this.request<Token>(
      `https://api.valuecommerce.com/auth/v1/merchant/token/?${params}`,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
  }

  // TODO: add params option
  transaction({ token }: { token: Token }) {
    return this.request<Transaction>(
      `https://api.valuecommerce.com/report/v1/merchant/transaction/`,
      {
        headers: {
          Authorization: `Bearer ${token.bearer_token}`,
          Accept: "application/json"
        }
      }
    );
  }

  // TODO: add params option
  transactionStatus({
    token,
    transaction,
    status
  }: {
    token: Token;
    transaction: Transaction;
    status: boolean;
  }) {
    const params = stringify({
      id: transaction.id,
      st: status ? "a" : "c" // "a" means "accept", "c" means "cancel"
    });

    return this.request<Transaction>(
      `https://api.valuecommerce.com/modify/v1/merchant/transaction/status/`,
      {
        headers: {
          method: "POST",
          Authorization: `Bearer ${token.bearer_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          body: params
        }
      }
    );
  }

  // TODO: change any type
  private async request<T>(url: string, options: any) {
    let rawResponse;

    try {
      rawResponse = await fetch(url, options);
    } catch {
      // TODO: error handling
      throw new Error();
    }

    const response = await rawResponse.json()

    return response.resultSet.rowData as T;
  }
}
