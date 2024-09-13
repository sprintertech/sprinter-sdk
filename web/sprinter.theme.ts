import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const sprinterTheme: CustomThemeConfig = {
	name: 'sprinter-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `system-ui`,
		'--theme-font-family-heading': `system-ui`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #F2541B
		'--color-primary-50': '253 229 221', // #fde5dd
		'--color-primary-100': '252 221 209', // #fcddd1
		'--color-primary-200': '252 212 198', // #fcd4c6
		'--color-primary-300': '250 187 164', // #fabba4
		'--color-primary-400': '246 135 95', // #f6875f
		'--color-primary-500': '242 84 27', // #F2541B
		'--color-primary-600': '218 76 24', // #da4c18
		'--color-primary-700': '182 63 20', // #b63f14
		'--color-primary-800': '145 50 16', // #913210
		'--color-primary-900': '119 41 13', // #77290d
		// secondary | #263AA7
		'--color-secondary-50': '222 225 242', // #dee1f2
		'--color-secondary-100': '212 216 237', // #d4d8ed
		'--color-secondary-200': '201 206 233', // #c9cee9
		'--color-secondary-300': '168 176 220', // #a8b0dc
		'--color-secondary-400': '103 117 193', // #6775c1
		'--color-secondary-500': '38 58 167', // #263AA7
		'--color-secondary-600': '34 52 150', // #223496
		'--color-secondary-700': '29 44 125', // #1d2c7d
		'--color-secondary-800': '23 35 100', // #172364
		'--color-secondary-900': '19 28 82', // #131c52
		// tertiary | #52A927
		'--color-tertiary-50': '229 242 223', // #e5f2df
		'--color-tertiary-100': '220 238 212', // #dceed4
		'--color-tertiary-200': '212 234 201', // #d4eac9
		'--color-tertiary-300': '186 221 169', // #badda9
		'--color-tertiary-400': '134 195 104', // #86c368
		'--color-tertiary-500': '82 169 39', // #52A927
		'--color-tertiary-600': '74 152 35', // #4a9823
		'--color-tertiary-700': '62 127 29', // #3e7f1d
		'--color-tertiary-800': '49 101 23', // #316517
		'--color-tertiary-900': '40 83 19', // #285313
		// success | #84cc16
		'--color-success-50': '237 247 220', // #edf7dc
		'--color-success-100': '230 245 208', // #e6f5d0
		'--color-success-200': '224 242 197', // #e0f2c5
		'--color-success-300': '206 235 162', // #ceeba2
		'--color-success-400': '169 219 92', // #a9db5c
		'--color-success-500': '132 204 22', // #84cc16
		'--color-success-600': '119 184 20', // #77b814
		'--color-success-700': '99 153 17', // #639911
		'--color-success-800': '79 122 13', // #4f7a0d
		'--color-success-900': '65 100 11', // #41640b
		// warning | #EAB308
		'--color-warning-50': '252 244 218', // #fcf4da
		'--color-warning-100': '251 240 206', // #fbf0ce
		'--color-warning-200': '250 236 193', // #faecc1
		'--color-warning-300': '247 225 156', // #f7e19c
		'--color-warning-400': '240 202 82', // #f0ca52
		'--color-warning-500': '234 179 8', // #EAB308
		'--color-warning-600': '211 161 7', // #d3a107
		'--color-warning-700': '176 134 6', // #b08606
		'--color-warning-800': '140 107 5', // #8c6b05
		'--color-warning-900': '115 88 4', // #735804
		// error | #D41976
		'--color-error-50': '249 221 234', // #f9ddea
		'--color-error-100': '246 209 228', // #f6d1e4
		'--color-error-200': '244 198 221', // #f4c6dd
		'--color-error-300': '238 163 200', // #eea3c8
		'--color-error-400': '225 94 159', // #e15e9f
		'--color-error-500': '212 25 118', // #D41976
		'--color-error-600': '191 23 106', // #bf176a
		'--color-error-700': '159 19 89', // #9f1359
		'--color-error-800': '127 15 71', // #7f0f47
		'--color-error-900': '104 12 58', // #680c3a
		// surface | #495a8f
		'--color-surface-50': '228 230 238', // #e4e6ee
		'--color-surface-100': '219 222 233', // #dbdee9
		'--color-surface-200': '210 214 227', // #d2d6e3
		'--color-surface-300': '182 189 210', // #b6bdd2
		'--color-surface-400': '128 140 177', // #808cb1
		'--color-surface-500': '73 90 143', // #495a8f
		'--color-surface-600': '66 81 129', // #425181
		'--color-surface-700': '55 68 107', // #37446b
		'--color-surface-800': '44 54 86', // #2c3656
		'--color-surface-900': '36 44 70' // #242c46
	}
};
