import html2pdf from 'html2pdf.js';

export const exportToPDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found for PDF export');
        return false;
    }

    // Get computed styles from the original element
    const computedStyles = window.getComputedStyle(element);

    // Clone and prepare the element
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove action buttons from clone
    const actionButtons = clone.querySelectorAll('[title="Download as PDF"], [title="Print"], [title="Share"], [title="Regenerate"]');
    actionButtons.forEach(btn => btn.parentElement?.remove());

    // Simple styling - preserve dark theme
    clone.style.backgroundColor = '#0f172a';
    clone.style.color = '#e2e8f0';
    clone.style.padding = '20px';
    clone.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    clone.style.fontSize = '14px';
    clone.style.lineHeight = '1.6';

    const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number], // top, left, bottom, right in mm
        filename: `${filename}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.92 },
        html2canvas: {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#0f172a',
            scrollX: 0,
            scrollY: 0,
        },
        jsPDF: {
            unit: 'mm' as const,
            format: 'a4' as const,
            orientation: 'portrait' as const
        },
        pagebreak: { mode: 'avoid-all' as const }
    };

    try {
        await html2pdf().set(opt).from(clone).save();
        return true;
    } catch (error) {
        console.error('PDF export failed:', error);
        return false;
    }
};

export const generateShareLink = (businessId: string, section?: string): string => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
        id: businessId,
        ...(section && { section })
    });
    return `${baseUrl}/share?${params.toString()}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
};

export const printSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 40px;
                color: #1e293b;
                line-height: 1.6;
            }
            h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
            h1 { font-size: 28px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
            h2 { font-size: 22px; color: #d97706; }
            h3 { font-size: 18px; }
            p { margin: 0.8em 0; }
            ul, ol { margin: 1em 0; padding-left: 2em; }
            li { margin: 0.5em 0; }
            .header { 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo { font-size: 24px; font-weight: bold; }
            .logo span { color: #f59e0b; }
            .date { color: #64748b; font-size: 14px; }
            @media print {
                body { padding: 0; }
                .no-print { display: none; }
            }
        </style>
    `;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ApexBusiness Report</title>
            ${styles}
        </head>
        <body>
            <div class="header">
                <div class="logo">Apex<span>Business</span></div>
                <div class="date">Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            ${element.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.print();
    };
};
