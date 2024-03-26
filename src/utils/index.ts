import { InternalServerErrorException } from '@nestjs/common'
import { existsSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { readFile } from 'fs'
import { promisify } from 'util'
const readFileAsync = promisify(readFile)
import * as sharp from 'sharp'

export const unlinkFile = async (filePath: string) => {
    try {
        if (!existsSync(filePath)) throw new InternalServerErrorException(`Can not delete ${filePath}`)
        await unlink(filePath)
    } catch {
        console.log(`Can not delete ${filePath} (2)`)
    }
}
export const compressImage = async (imagePath: string, imageSize: number) => {
    await readFileAsync(imagePath)
        .then(async (buffer: Buffer) => {
            sharp(buffer).resize(imageSize).withMetadata().toFile(imagePath)
        })
        .then()
        .catch(() => {
            throw Error(`Can not compress images`)
        })
}

export const getFileNameAndExtension = (url: string | undefined): string | null => {
    const match = url ? url.match(/\/([^\/?#]+)\.([a-z0-9]+)(?:[?#]|$)/i) : ''
    if (match && match.length === 3) {
        const fileName = match[1]
        const extension = match[2]
        return fileName + '.' + extension
    }
    return null // return null if no match found
}
