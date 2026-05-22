import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!global.__notifications?.has(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const body = await req.json()
  const existing = global.__notifications.get(id)!
  const updated = { ...existing, ...body, updatedAt: new Date().toISOString() }
  global.__notifications.set(id, updated)
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!global.__notifications?.has(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  global.__notifications.delete(id)
  return new NextResponse(null, { status: 204 })
}
