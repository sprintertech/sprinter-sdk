export const sprinterNameServiceAbi = [
	{
		inputs: [
			{
				internalType: 'string',
				name: '_name',
				type: 'string'
			},
			{
				internalType: 'address',
				name: '_from',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '_value',
				type: 'uint256'
			}
		],
		name: 'claimName',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		name: 'names',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string'
			}
		],
		stateMutability: 'view',
		type: 'function'
	}
] as const;
