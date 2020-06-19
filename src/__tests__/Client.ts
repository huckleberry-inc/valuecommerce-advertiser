import { Client } from '../index';

require('sepia');

const clientKey = 'CLIENT_KEY';
const clientSecret = 'CLIENT_SECRET';

// Sample values
const bearerToken = '69449c99-d35e-4e9b-b2ae-9ab21b4d00d3';
const orderId = 'vc_72da64e066f07_Fw3pMB7p41JBsKxl8xGi';

const client = new Client({ clientKey, clientSecret });

test('returns token', async () => {
  const token = await client.token();

  expect(token.resultSet.rowData.bearer_token).toBe(bearerToken);
});

test('returns transactions', async () => {
  const transaction = await client.transaction(bearerToken, {
    limit: 1000,
    offset: 0,
    from_date: '2020-04-01',
    to_date: '2020-06-19',
  });

  const {
    affilId,
    // TODO: tests below
    // affilPayment, // affilPaymentNet,
    // affilPaymentTax,
    // affiliateSite,
    // approvalDate,
    // approvalDeadline,
    // approvalStatus,
    // clickDate,
    // custEmail,
    // custName,
    // custTel,
    // customerStatus,
    // itemPriceTotal,
    // itemQuantity,
    // orderDate,
    // orderId,
    // programName,
    // upDate,
    // userId,
  } = transaction.resultSet.rowData[0];

  expect(affilId).toBe('3479028');
});

test('updates transaction', async () => {
  const statusMap = new Map<string, boolean>();
  statusMap.set(orderId, false);

  const transactionStatus = await client.transactionStatus(
    bearerToken,
    statusMap,
  );

  expect(transactionStatus.resultSet.rowData.result).toBe(true);
});
