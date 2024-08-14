---
sidebar_position: 2
---

# Advanced Usage

## Handling Errors

The dApp is responsible for handling errors that occur during the transaction process. Ensure to implement proper error handling mechanisms to provide a smooth user experience.

### Example

```typescript
sprinter.getUserBalances()
  .then(balances => {
    console.log('User balances:', balances);
  })
  .catch(error => {
    console.error('Error fetching balances:', error);
  });
```

### Explanation

- **catch**: The `catch` method is used to handle any errors that occur during the promise's execution, ensuring that your application can manage and log errors effectively.

## Customizing Requests

The Sprinter SDK allows you to customize requests to suit your application's needs. Here’s how to provide additional options when fetching solutions.

### Example

```typescript
sprinter.getSolution({
  token: "USDC",
  destinationChain: 42161,  // Destination chain ID
  amount: "1000000000"      // Amount in the smallest unit (e.g., wei)
}).then(solution => {
  console.log('Transaction solution:', solution);
});
```

### Explanation

- **token, destinationChain, amount**: These parameters specify the token, destination chain, and amount for the transaction.

## Integrating With Other Libraries

You can integrate the Sprinter SDK with other libraries and tools in your dApp to enhance functionality.

### Example with Web3.js v4

```typescript
import { Sprinter } from '@chainsafe/sprinter-sdk';
import Web3 from 'web3';

async function integrateWithWeb3() {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();

  const sprinter = new Sprinter(window.ethereum);

  const balances = await sprinter.getUserBalances();
  console.log('User balances:', balances);

  const solution = await sprinter.getSolution({
    token: "USDC",
    destinationChain: 42161,
    amount: "1000000000"
  });

  console.log('Transaction solution:', solution);

  // Execute transaction using Web3.js
  const tx = solution[0].transaction;

  web3.eth.sendTransaction(tx)
    .on('transactionHash', (hash) => {
      console.log('Transaction hash:', hash);
    })
    .on('receipt', (receipt) => {
      console.log('Transaction receipt:', receipt);
    })
    .on('error', console.error);
}

integrateWithWeb3().catch(console.error);
```

### Explanation

- **Web3.js v4**: A library for interacting with the Ethereum blockchain, used here to manage accounts and send transactions.
- **solution[0].transaction**: The transaction object provided by Sprinter's solution that is used to execute the transaction.