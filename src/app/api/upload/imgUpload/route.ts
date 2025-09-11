import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinaryConfig';
import sharp from 'sharp';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const buffer = Buffer.from(await file.arrayBuffer());

        const cleanBuffer = await sharp(buffer).rotate().jpeg({ quality: 70 }).toBuffer();

        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ resource_type: 'image', upload_preset: 'EI_study' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                })
                .end(cleanBuffer);
        });

        return NextResponse.json({ imgUrl: result.secure_url }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
