import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CLOUDINARY_PROFILE, CLOUDINARY_PRODUCT, CLOUDINARY_PARENT_FOLDER } from '../constant/cloudinary.js';
import randomCharacter from './randomCharacter.js';

class Cloudinary {
    static getFolder(target) {
        switch (target) {
            case 'profile':
                return CLOUDINARY_PROFILE;
            case 'product':
                return CLOUDINARY_PRODUCT;
            default:
                throw new Error('Target not found');
        }
    }

    static upload(target) {
        const folder = this.getFolder(target);

        const storage = new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder,
                format: async (req, file) => {
                    const ext = file.mimetype.split('/')[1];
                    const allowedFormats = ['png', 'jpg', 'jpeg', 'gif'];
                    return allowedFormats.includes(ext) ? ext : 'jpg';
                },
                public_id: (req, file) => {
                    const randomStr = randomCharacter(8);
                    return randomStr;
                }
            }
        });

        return multer({ storage: storage });
    }

    static extractPublicId(url) {
        const parts = url.split('/');
        const fileWithExtension = parts.pop();
        const publicId = parts.slice(parts.indexOf(CLOUDINARY_PARENT_FOLDER)).join('/') + '/' + fileWithExtension.split('.')[0];
        return publicId;
    }

    static async removeCloudinary(url, target) {
        try {
            const validTargets = ['profile', 'product'];
            if (!validTargets.includes(target)) {
                throw new Error('Target not found');
            }

            const publicId = this.extractPublicId(url);

            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            return;
        }
    }
}

export default Cloudinary;
