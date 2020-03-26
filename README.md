## valuecommerce-advertiser

ValueCommerce client for Advertiser.


### Usage

```js
import { ValueCommerceAdvertiser as ValueCommerceAdvertiserClient } from '@yosemitelab/valuecommerce-advertiser'

const accessToken = "...";
const client = new ValueCommerceAdvertiserClient(accessToken);

(async () => {
  // Create Token
  const token = await client.token();

  // Fetch transactions
  const transactions = await client.transaction({ token });

  // Update transaction's status
  await client.transactionStatus({ token, transaction: transactions[0], status: true });
})();
```