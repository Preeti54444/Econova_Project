// Simple Direct Download Export
function exportReportDirect(data, format = 'csv') {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `wetland-report-${timestamp}`;
    
    let content, mimeType, extension;
    
    switch(format) {
        case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            extension = 'csv';
            break;
        case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
        default:
            content = convertToCSV(data);
            mimeType = 'text/csv';
            extension = 'csv';
    }
    
    // Create download using data URL
    const dataUrl = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
    const link = document.createElement('a');
    link.setAttribute('href', dataUrl);
    link.setAttribute('download', `${filename}.${extension}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

// Simple usage
function downloadReport(format) {
    const sampleData = [
        {
            'Report ID': 'WG001',
            'Date': new Date().toLocaleDateString(),
            'Location': 'Wetland Area A',
            'Type': 'Pollution',
            'Status': 'Under Investigation',
            'Description': 'Industrial waste discharge observed'
        }
    ];
    
    exportReportDirect(sampleData, format);
}