import fetch from 'node-fetch';

const getImageBuffers = async (imageUrls) => {
    const buffers = await Promise.all(
        imageUrls.map(async (url) => {
            const response = await fetch(url);
            return response.buffer();
        })
    );

    return buffers;
};

export default getImageBuffers;
