import { summarizeDocument, extractKeyPoints, generateExecutiveSummary, analyzeDocument } from "./documentSummarizer.js"
import { sampleDocuments } from "./sampleDocuments.js"
import dotenv from "dotenv";
import fs from "fs"
import path from "path"
dotenv.config()

// Main function to demonstrate document summarization
const testDocumentSummarization = async () => {
    console.log("=".repeat(80))
    console.log("DOCUMENT SUMMARIZATION AND ENHANCEMENT SYSTEM")
    console.log("=".repeat(80))

    try {
        // Test with Technology document
        console.log("\n📄 Processing Technology Document...")
        console.log("-".repeat(80))
        
        const techSummary = await summarizeDocument(sampleDocuments.technology)
        console.log("\n✅ SUMMARY:\n", techSummary)

        // Save summary to file
        const outputsDir = path.resolve(process.cwd(), "outputs")
        await fs.promises.mkdir(outputsDir, { recursive: true })
        const techFile = path.join(outputsDir, "technology_summary.txt")
        await fs.promises.writeFile(techFile, techSummary, "utf8")
        console.log(`Saved summary to: ${techFile}`)
        
        const techKeyPoints = await extractKeyPoints(sampleDocuments.technology)
        console.log("\n📌 KEY POINTS:\n", techKeyPoints)
        
        const techExecutive = await generateExecutiveSummary(sampleDocuments.technology)
        console.log("\n👔 EXECUTIVE SUMMARY:\n", techExecutive)

        // Test with Business document
        console.log("\n" + "=".repeat(80))
        console.log("\n📄 Processing Business Document...")
        console.log("-".repeat(80))
        
        const bizSummary = await summarizeDocument(sampleDocuments.business)
        console.log("\n✅ SUMMARY:\n", bizSummary)

        // Save business summary
        const bizFile = path.join(outputsDir, "business_summary.txt")
        await fs.promises.writeFile(bizFile, bizSummary, "utf8")
        console.log(`Saved summary to: ${bizFile}`)
        
        const bizAnalysis = await analyzeDocument(sampleDocuments.business)
        console.log("\n🔍 ANALYSIS:\n", bizAnalysis)

        // Test with Research document
        console.log("\n" + "=".repeat(80))
        console.log("\n📄 Processing Research Document...")
        console.log("-".repeat(80))
        
        const researchSummary = await summarizeDocument(sampleDocuments.research)
        console.log("\n✅ SUMMARY:\n", researchSummary)

        // Save research summary
        const researchFile = path.join(outputsDir, "research_summary.txt")
        await fs.promises.writeFile(researchFile, researchSummary, "utf8")
        console.log(`Saved summary to: ${researchFile}`)
        
        const researchKeyPoints = await extractKeyPoints(sampleDocuments.research)
        console.log("\n📌 KEY POINTS:\n", researchKeyPoints)

        console.log("\n" + "=".repeat(80))
        console.log("✨ All tests completed successfully!")
        console.log("=".repeat(80))

    } catch (error) {
        console.error("❌ Error during testing:", error.message)
        process.exit(1)
    }
}

// Run the test
testDocumentSummarization()