export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import 'pdf-parse/worker';
import {PDFParse} from 'pdf-parse';
import { cleanPdfText } from '@/lib/cleanText';

export async function POST(request) {
    try{
if (request.body.prompt) {
        //   console.log("Using prompt from body:", req.body.prompt);
        //   request.prompt = request.body.prompt;
        //   return NextResponse.next();
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
    console.log(cleanPdfText(data.text));
    return NextResponse.json({success:true, text :cleanPdfText(data.text)},{status:200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false , message:err.message},{status:500});
    }

}