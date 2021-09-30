export interface ImageInterface {
    url: string
	path: string
	fileName: string
	againTimes: number
	extract: string
}


export interface OptionsInterface {
    title: string
	parallel?: number
	timeout?: number
	gainInterval?: number
	againTimes?: number
	headers?: object
}
