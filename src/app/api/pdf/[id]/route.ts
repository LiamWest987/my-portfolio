import { type NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // In Next.js 15+, params is a Promise
    const { id: slugWithId } = await context.params

    // Extract the actual ID from the slug (format: "project-name--actual-id")
    const id = slugWithId.includes('--') ? slugWithId.split('--').pop() : slugWithId

    // Fetch the PDF URL from Sanity
    const project = await client.fetch(
      `*[_type == "project" && _id == $id][0] {
        "pdfUrl": pdf.asset->url
      }`,
      { id }
    )

    if (!project || !project.pdfUrl) {
      return new NextResponse('PDF not found', { status: 404 })
    }

    // Fetch the PDF from Sanity CDN
    const pdfResponse = await fetch(project.pdfUrl)

    if (!pdfResponse.ok) {
      return new NextResponse('Failed to fetch PDF', { status: 500 })
    }

    // Get the PDF as a buffer
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error proxying PDF:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
