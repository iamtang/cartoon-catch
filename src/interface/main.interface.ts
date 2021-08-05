import { OptionsInterface as downloadOptionsInterface } from './download.interface';

export interface ImageInterface {
    url: string
	path: string
	fileName: string
	extract: string
	againTimes: number
}

interface HeadersOmterface {
	['string']: string
}
export interface OptionsInterface {
    target: string
	headers: HeadersOmterface
	encoding: boolean
	host: string
	urlReplace: Array<string>
	titleReplace: Array<string>
	beforeFunction: Function
	imageHost: string
	name: string
	extract: string
	downloadOptions: downloadOptionsInterface
}
