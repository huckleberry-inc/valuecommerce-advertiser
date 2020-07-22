# Welcome to @huckleberry-inc/valuecommerce-advertiser 👋
[![Version](https://img.shields.io/npm/v/@huckleberry-inc/valuecommerce-advertiser.svg)](https://www.npmjs.com/package/@huckleberry-inc/valuecommerce-advertiser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
![build and test](https://github.com/huckleberry-inc/valuecommerce-advertiser/workflows/build%20and%20test/badge.svg)

> ValueCommerce node client for advertiser

### 🏠 [Homepage](https://github.com/huckleberry-inc/valuecommerce-advertiser)

## Usage

```ts
import { Client } from '@huckleberry-inc/valuecommerce-advertiser'

const clientKey = 'CLIENT_KEY';
const clientSecret = 'CLIENT_SECRET';
const client = new Client({ clientKey, clientSecret });

(async () => {
  // Create Token
  const token = await client.token();

  // Fetch transactions
  const transactions = await client.transaction(token.resultSet.rowData.bearer_token);

  // Update transaction's status
  const statusMap = new Map<string, boolean>();
  statusMap.set(transactions[0].resultSet.rowData.orderId, false);

  await client.transactionStatus(
    bearerToken,
    statusMap,
  );
})();
```

## Install

```sh
yarn add @huckleberry-inc/valuecommerce-advertiser
yarn
```

## Run tests

```sh
VCR_MODE=cache yarn test 
```

## Author

👤 **Huckleberry, inc. <dev@huckleberry-inc.com>**


## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/huckleberry-inc/valuecommerce-advertiser/issues). 

## Show your support

Give a ⭐️ if this project helped you!


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_