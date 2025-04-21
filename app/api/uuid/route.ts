export async function GET() {
  return Response.json({ uuid: crypto.randomUUID() });
}
