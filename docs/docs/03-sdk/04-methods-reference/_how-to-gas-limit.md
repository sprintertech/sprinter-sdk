import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Estimating `gasLimit`

The following examples demonstrate how to estimate the `gasLimit` parameter required for interacting with a staking smart contract. We provide examples using different web3 libraries: Web3JS, Viem, and Ethers. 

:::note
To ensure that the transaction has enough gas, we recommend using the estimated gas limit from the provider, adding 25% as a buffer, and then adding an additional 200,000 units for fail-safe calculations. This ensures the transaction won’t run out of gas, even for complex contract interactions.
:::

<details>
  <summary>Show Example Staking Contract and ABI</summary>

  ```solidity
  pragma solidity ^0.8.0;

  contract StakingContract {
      mapping(address => uint256) public stakes;
      uint256 public totalStakes;

      function stake(uint256 amount) public {
          require(amount > 0, "Amount must be greater than zero");
          stakes[msg.sender] += amount;
          totalStakes += amount;
      }

      function withdraw(uint256 amount) public {
          require(amount > 0 && stakes[msg.sender] >= amount, "Invalid amount");
          stakes[msg.sender] -= amount;
          totalStakes -= amount;
      }

      function getStake(address user) public view returns (uint256) {
          return stakes[user];
      }
  }
  ```

  ```json
  {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "stake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
  ```
</details>

<Tabs queryString="web3-libs">
  <TabItem value="web3js" label="Web3JS" default>

    ```typescript
    import Web3 from 'web3';
    import contractABI from './stakingContractABI';

    const web3 = new Web3('<YOUR_INFURA_OR_ALCHEMY_URL>');
    const contractAddress = '<YOUR_CONTRACT_ADDRESS>';
    const account = '<YOUR_ACCOUNT_ADDRESS>';

    const stakingContract = new web3.eth.Contract(contractABI, contractAddress);

    async function estimateGas() {
      const estimatedGas = await stakingContract.methods.stake(100).estimateGas({ from: account });
      const gasLimit = Math.floor(estimatedGas * 1.25) + 200000; // Add 25% and 200k for safety
      console.log('Estimated Gas Limit:', gasLimit);
    }

    estimateGas();
    ```

  </TabItem>
  <TabItem value="viem" label="Viem">

    ```typescript
    import { encodeFunctionData } from 'viem';
    import { estimateGas } from 'viem';
    import contractABI from './stakingContractABI';

    const abi = contractABI;
    const functionName = 'stake';
    const args = [100];

    async function estimateGas() {
      const estimatedGas = await estimateGas({ abi, functionName, args });
      const gasLimit = Math.floor(estimatedGas * 1.25) + 200000; // Add 25% and 200k for safety
      console.log('Estimated Gas Limit:', gasLimit);
    }

    estimateGas();
    ```

  </TabItem>
  <TabItem value="ethers" label="Ethers">

    ```typescript
    import { ethers } from 'ethers';
    import contractABI from './stakingContractABI';

    const provider = new ethers.providers.JsonRpcProvider('<YOUR_INFURA_OR_ALCHEMY_URL>');
    const contractAddress = '<YOUR_CONTRACT_ADDRESS>';
    const signer = provider.getSigner('<YOUR_ACCOUNT_ADDRESS>');

    const stakingContract = new ethers.Contract(contractAddress, contractABI, signer);

    async function estimateGas() {
      const estimatedGas = await stakingContract.estimateGas.stake(100);
      const gasLimit = Math.floor(Number(estimatedGas) * 1.25) + 200000; // Add 25% and 200k for safety
      console.log('Estimated Gas Limit:', gasLimit.toString());
    }

    estimateGas();
    ```

  </TabItem>
</Tabs>
