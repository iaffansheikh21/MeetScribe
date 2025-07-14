import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  const { to, subject, htmlBody } = await request.json() as {
    to: string;
    subject?: string;
    htmlBody: string;
  };

  if (!to || !htmlBody) {
    return NextResponse.json(
      { error: 'Missing `to` or `htmlBody` in request body' },
      { status: 400 }
    );
  }

  try {
    const result = await resend.emails.send({
      from: 'onboard@resend.dev',
      to:"meetscribe0@gmail.com",
      subject: subject || 'Your MeetScribe Update',
      html: htmlBody,
    });

    console.log('✉️ Resend send result:', result);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(' Resend Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = () =>
  NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
