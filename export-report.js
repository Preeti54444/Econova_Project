// Export Report Functionality
function exportReport(reportData, format = 'pdf') {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `wetland-report-${timestamp}`;
    
    switch(format.toLowerCase()) {
        case 'pdf':
            exportToPDF(reportData, filename);
            break;
        case 'csv':
            exportToCSV(reportData, filename);
            break;
        case 'json':
            exportToJSON(reportData, filename);
            break;
        default:
            exportToPDF(reportData, filename);
    }
}

function exportToPDF(data, filename) {
    const content = generatePDFContent(data);
    const blob = new Blob([content], { type: 'application/pdf' });
    downloadFile(blob, `${filename}.pdf`);
}

function exportToCSV(data, filename) {
    const csvContent = generateCSVContent(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `${filename}.csv`);
}

function exportToJSON(data, filename) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

function generateCSVContent(data) {
    const headers = ['Report ID', 'Date', 'Location', 'Type', 'Status', 'Description'];
    const rows = data.map(report => [
        report.id,
        report.date,
        report.location,
        report.type,
        report.status,
        `"${report.description.replace(/"/g, '""')}"`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generatePDFContent(data) {
    // Simple text-based PDF content (for basic implementation)
    let content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
    content += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
    content += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n`;
    content += `4 0 obj\n<< /Length ${data.length * 50} >>\nstream\nBT\n/F1 12 Tf\n50 750 Td\n`;
    
    data.forEach((report, index) => {
        content += `(Report ${report.id}: ${report.type} at ${report.location}) Tj\n0 -20 Td\n`;
    });
    
    content += `ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n`;
    content += `trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n%%EOF`;
    
    return content;
}

// Example usage function
function handleExportClick(event, format) {
    event.preventDefault();
    event.stopPropagation();
    
    // Sample report data - replace with actual data
    const reportData = [
        {
            id: 'WG001',
            date: new Date().toLocaleDateString(),
            location: 'Wetland Area A',
            type: 'Pollution',
            status: 'Under Investigation',
            description: 'Industrial waste discharge observed'
        }
    ];
    
    exportReport(reportData, format);
    return false;
}