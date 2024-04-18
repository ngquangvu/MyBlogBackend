import { extname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import path = require('path')
// import { v4 as uuid } from 'uuid'
import { HttpException, HttpStatus } from '@nestjs/common'
import { getCurrentDateTimeLower } from 'src/utils'

export const multerOptions = {
    limits: {
        fileSize: +process.env.UPLOAD_MAX_FILE_SIZE
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true)
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false)
        }
    },
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = process.env.UPLOADED_FILES_PATH
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath)
            }
            cb(null, uploadPath)
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            const filename: string =
                getCurrentDateTimeLower() + '_' + path.parse(file?.originalname)?.name?.replace(/[^a-zA-Z0-9]/g, '')
            const extension: string = path.parse(file?.originalname)?.ext
            cb(null, `${filename}${extension}`)
            // cb(null, `${uuid()}${extname(file.originalname)}`)
        }
    })
}
