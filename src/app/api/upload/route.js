export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import 'pdf-parse/worker';
import { PDFParse } from 'pdf-parse';
// import { cleanPdfText } from '@/lib/cleanText';
import { generateResponse } from '@/lib/generateResponse';

export async function POST(request) {
    try {
        let prompt;
        if (request.body.prompt) {
            prompt = request.body.prompt;

        }

        const formData = await request.formData();
        const file = formData.get("pdf");

        if (!file) {
            return NextResponse.json({ success: false, message: "no file uploaded" }, { status: 401 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        await parser.destroy();
        // prompt = cleanPdfText(data.text);
        prompt = data.text;

        console.log(prompt);
        const questions = await generateResponse(prompt);

        return NextResponse.json({ success: true, questions }, { status: 200 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }

}