/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from '../index';

import nock from 'nock';

const clientKey = 'CLIENT_KEY';
const clientSecret = 'CLIENT_SECRET';

// Sample values
const bearerToken = '69449c99-d35e-4e9b-b2ae-9ab21b4d00d3';

const apiURL = 'https://api.valuecommerce.com';
const apiVersion = 'v1';

const client = new Client();

beforeAll(() => {
  nock.cleanAll();
});

test('returns token', async () => {
  const params = { grant_type: 'client_credentials'};
  nock(apiURL)
    .get(`/auth/${apiVersion}/merchant/token/`)
    .query(params)
    .reply(200, {
      "resultSet": {
        "responseInfo": {
          "numberOfResult": 1,
          "nextOffset": -1,
          "responseTime": "2020-11-04 19:21:11"
        },
        "requestInfo": {
          "query": "grant_type=client_credentials",
          "requestTime": "2020-11-04 19:21:11"
        },
        "rowData": {
          "bearer_token": "69449c99-d35e-4e9b-b2ae-9ab21b4d00d3"
        }
      }
    });
  const token = await client.token({ clientKey, clientSecret });

  expect(token.resultSet.rowData.bearer_token).toBe(bearerToken);
});

test('invalid credentials', async () => {
  const params = { grant_type: 'client_credentials'};
  nock(apiURL)
    .get(`/auth/${apiVersion}/merchant/token/`)
    .query(params)
    .reply(401, {
      "error": "invalid_request",
      "error_description": "Authorization request header is in invalid format (or may not be encoded)."
    });

  await expect(client.token({ clientKey, clientSecret })).rejects.toThrowError(new Error('401 Unauthorized'));
});

test('returns transactions', async () => {
  const params = { from_date: '2020-04-01', to_date: '2020-06-19', limit: '10', offset: '0', approval_status: 'p,a,c,i' };
  nock(apiURL)
    .get(`/report/${apiVersion}/merchant/transaction/`)
    .query(params)
    .reply(200, {
      "resultSet": {
        "responseInfo": {
          "numberOfResult": 1,
          "nextOffset": -1,
          "responseTime": "2020-11-04 19:32:44"
        },
        "requestInfo": {
          "query": "from_date=2020-04-01&to_date=2020-06-19&limit=10&offset=0&approval_status=p,a,c,i",
          "requestTime": "2020-11-04 19:32:00"
        },
        "rowData": [
          {
            "approvalStatus": "I",
            "clickDate": "2020-08-26 16:00:50",
            "orderDate": "2020-04-09 14:40:34",
            "approvalDate": "2020-10-24 14:40:34",
            "orderId": "2456388206728",
            "programName": "T3EC<Shopify Affi>テスト用",
            "userId": null,
            "custName": "192.168.106.3 183.180.177.94",
            "customerStatus": null,
            "custEmail": "192.168.106.3 183.180.177.94 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, l",
            "custTel": "192.168.106.3",
            "affilId": "3479028",
            "affiliateSite": "T3CH_iTRACKテストサイト7",
            "itemQuantity": "1",
            "itemPriceTotal": "100",
            "affilPaymentNet": "0",
            "affilPaymentTax": "0",
            "affilPayment": "0",
            "approvalDeadline": "-11",
            "updDate": "2020-11-01 03:16:49"
          }
        ]
      }
    });

  const transaction = await client.transaction(bearerToken, {
    limit: 10,
    offset: 0,
    from_date: '2020-04-01',
    to_date: '2020-06-19',
    approval_status: 'p,a,c,i',
  });

  const {
    affilId,
    // TODO: tests below
    // affilPayment, // affilPaymentNet,
    // affilPaymentTax,
    // affiliateSite,
    // approvalDate,
    approvalDeadline,
    // approvalStatus,
    // clickDate,
    // custEmail,
    // custName,
    // custTel,
    // customerStatus,
    // itemPriceTotal,
    // itemQuantity,
    orderDate,
    // orderId,
    // programName,
    // upDate,
    // userId,
  } = transaction.resultSet.rowData[0];

  expect(approvalDeadline).toBe('-11');
  expect(orderDate).toBe('2020-04-09 14:40:34');
  expect(affilId).toBe('3479028');
});

test('returns no transactions', async () => {
  const params = { from_date: '2020-04-01', to_date: '2020-06-19', limit: '10', offset: '0', approval_status: 'p,a,c,i' };
  nock(apiURL)
    .get(`/report/${apiVersion}/merchant/transaction/`)
    .query(params)
    .reply(200, {
      "resultSet": {
        "responseInfo": {
          "numberOfResult": 0,
          "nextOffset": -1,
          "responseTime": "2020-11-04 20:32:36"
        },
        "requestInfo": {
          "query": "from_date=2020-04-01&to_date=2020-06-19&limit=10&offset=0&approval_status=p,a,c,i",
          "requestTime": "2020-11-04 20:32:35"
        },
        "rowData": []
      }
    });

  const transaction = await client.transaction(bearerToken, {
    limit: 10,
    offset: 0,
    from_date: '2020-04-01',
    to_date: '2020-06-19',
    approval_status: 'p,a,c,i',
  });

  expect(transaction.resultSet.responseInfo.numberOfResult).toBe(0);
});

test('updates transaction', async () => {
  nock(apiURL)
    .post(`/modify/${apiVersion}/merchant/transaction/status/`)
    .reply(200, {
      "resultSet":
      {
        "responseInfo": {
          "numberOfResult": 1,
          "nextOffset": -1,
          "responseTime": '2020-06-19 12:20:22'
        },
        "requestInfo": {
          "query": '',
          "requestTime": '2020-06-19 12:20:22'
        },
        "rowData": {
          "result": true
        }
      }
    });
  const statusMap = new Map<string, boolean>();
  statusMap.set('2456388206728', false);

  const transactionStatus = await client.transactionStatus(
    bearerToken,
    statusMap,
  );

  expect(transactionStatus.resultSet.rowData.result).toBe(true);
});
