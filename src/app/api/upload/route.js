export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';
import { generateResponse } from '@/lib/generateResponse';

export async function POST(request) {
    try {
        const formData = await request.formData();
        let prompt;
        const file = formData.get("pdf");
        const text = formData.get("text");
        if (!file && !text) {
            return NextResponse.json({ success: false, message: "No file or text provided" }, { status: 400 });
        }

        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const parser = new PDFParse({ data: buffer });
            const data = await parser.getText();
            await parser.destroy();
            prompt = data.text;
        } else {
            prompt = text;
        }

        const questions = await generateResponse(prompt);

        return NextResponse.json({ success: true, questions }, { status: 200 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }

}