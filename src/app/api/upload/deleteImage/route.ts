import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinaryConfig';

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);

    const imgUrl = searchParams.get('imgUrl');
    if (!imgUrl) return NextResponse.json({ message: 'imgUrl is required' }, { status: 400 });

    const publicId = imgUrl.split('/').pop()?.split('.')[0];

    try {
        await cloudinary.uploader.destroy(publicId as string);
        return NextResponse.json({ message: 'Image deleted' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
