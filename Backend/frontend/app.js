const fileInput = document.getElementById('fileInput')
const textInput = document.getElementById('textInput')
const processBtn = document.getElementById('processBtn')
const downloadBtn = document.getElementById('downloadBtn')
const statusEl = document.getElementById('status')
const summaryEl = document.getElementById('summary')
const keypointsEl = document.getElementById('keypoints')
const execEl = document.getElementById('exec')
const analysisEl = document.getElementById('analysis')

let lastResults = null

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const text = await file.text()
  textInput.value = text
})

processBtn.addEventListener('click', async () => {
  const documentText = textInput.value && textInput.value.trim()
  if (!documentText || documentText.length < 50) {
    alert('Please provide a document with at least 50 characters.')
    return
  }

  statusEl.textContent = 'Processing...'
  processBtn.disabled = true
  downloadBtn.disabled = true

  try {
    const res = await fetch('/api/process-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: documentText })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'API error')
    }

    const payload = await res.json()
    const data = payload.data || payload

    // The backend returns combined results at top-level in data
    const summary = data.summary || ''
    const keyPoints = data.keyPoints || data.keypoints || ''
    const executive = data.executiveSummary || ''
    const analysis = data.analysis || ''

    summaryEl.textContent = summary
    keypointsEl.textContent = keyPoints
    execEl.textContent = executive
    analysisEl.textContent = analysis

    lastResults = { summary, keyPoints, executive, analysis }
    downloadBtn.disabled = false
    statusEl.textContent = 'Completed'
  } catch (err) {
    console.error(err)
    statusEl.textContent = 'Error: ' + err.message
    alert('Error: ' + err.message)
  } finally {
    processBtn.disabled = false
  }
})

// Build a single combined text and download as .txt
downloadBtn.addEventListener('click', () => {
  if (!lastResults) return
  const parts = []
  parts.push('=== Summary ===\n')
  parts.push(lastResults.summary || '')
  parts.push('\n\n=== Key Points ===\n')
  parts.push(lastResults.keyPoints || '')
  parts.push('\n\n=== Executive Summary ===\n')
  parts.push(lastResults.executive || '')
  parts.push('\n\n=== Analysis ===\n')
  parts.push(lastResults.analysis || '')

  const blob = new Blob(parts, { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document_enhancer_results.txt'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
})
