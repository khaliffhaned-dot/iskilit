import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getUserProfile } from './cloudService.ts';
import { User } from '../types.ts';

const MOCK_USER_ID = 'mock_user_12345';

// In a real app this would get the session user. For the mock, we fetch the known mock user.
const getCurrentUser = (): Promise<User | null> => {
    return getUserProfile(MOCK_USER_ID);
}

export const generatePdfBlob = async (elementId: string): Promise<Blob | null> => {
    const originalContent = document.getElementById(elementId);
    if (!originalContent) {
        console.error(`Element with ID '${elementId}' not found for export.`);
        alert("Could not find content to export. Please try again.");
        return null;
    }

    const currentUser = await getCurrentUser();
    const branding = currentUser?.branding;

    // Create a container for the PDF content that is off-screen
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '1000px'; // A fixed width for consistent PDF layout
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.color = '#0f172a';
    pdfContainer.style.fontFamily = `'Inter', sans-serif`;
    pdfContainer.style.padding = '40px';

    // Create header with logo
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.borderBottom = `1px solid #e2e8f0`;
    header.style.paddingBottom = '20px';
    header.style.marginBottom = '40px';
    
    const logoContainer = document.createElement('div');

    if (branding?.logoUrl) {
        const logoImg = document.createElement('img');
        logoImg.src = branding.logoUrl;
        logoImg.style.maxHeight = '40px';
        logoImg.style.maxWidth = '150px';
        logoContainer.appendChild(logoImg);
    } else {
        const logoSVG = `
            <svg width="135" height="32" viewBox="0 0 135 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <linearGradient id="export-logo-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop stop-color="#F59E0B"></stop>
                    <stop offset="0.5" stop-color="#DC2626"></stop>
                    <stop offset="1" stop-color="#D97706"></stop>
                </linearGradient>
                </defs>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.0492 1.6001C30.0459 1.6001 36.4492 7.8501 36.4492 15.8001C36.4492 23.7501 30.0459 30.0001 22.0492 30.0001H9.44922V32.0001H-0.550781V0.00012207H22.0492V1.6001ZM9.44922 21.2001H22.0492C25.8659 21.2001 28.9492 18.8001 28.9492 15.8001C28.9492 12.8001 25.8659 10.4001 22.0492 10.4001H9.44922V21.2001Z" fill="url(#export-logo-gradient)"></path>
                <text x="44" y="24" font-family="'Inter', sans-serif" font-size="24" font-weight="800" fill="#0f172a">
                Escalate
                </text>
            </svg>
        `;
        logoContainer.innerHTML = logoSVG;
    }
    
    const reportDate = document.createElement('p');
    reportDate.textContent = `Report Generated: ${new Date().toLocaleDateString()}`;
    reportDate.style.fontSize = '0.875rem';
    reportDate.style.color = '#64748b';

    header.appendChild(logoContainer);
    header.appendChild(reportDate);
    pdfContainer.appendChild(header);

    // Clone the original content to avoid modifying the live page
    const contentToPrint = originalContent.cloneNode(true) as HTMLElement;
    
    // Add a specific class to the cloned content for PDF-specific styling.
    contentToPrint.classList.add('exporting-to-pdf');

    // Clean up any interactive elements that shouldn't be in the PDF
    const elementsToHide = Array.from(contentToPrint.querySelectorAll('.print-hidden'));
    elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');
    
    pdfContainer.appendChild(contentToPrint);

    // Create footer
    const footer = document.createElement('div');
    footer.style.marginTop = '40px';
    footer.style.paddingTop = '20px';
    footer.style.borderTop = `1px solid #e2e8f0`;
    footer.style.textAlign = 'center';
    footer.style.fontSize = '0.75rem';
    footer.style.color = '#94a3b8';
    footer.innerHTML = `&copy; ${new Date().getFullYear()} Escalate. | Confidential Report`;
    pdfContainer.appendChild(footer);

    document.body.appendChild(pdfContainer);

    try {
        const canvas = await html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true, 
        });

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4', hotfixes: ['px_scaling'] });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / pdfWidth;
        const calculatedHeight = canvasHeight / ratio;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, calculatedHeight);
        
        // Handle multi-page PDFs
        let heightLeft = calculatedHeight - pdfHeight;
        let position = -pdfHeight;
        while (heightLeft > 0) {
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, pdfWidth, calculatedHeight);
            heightLeft -= pdfHeight;
            position -= pdfHeight;
        }

        return pdf.output('blob');

    } catch (e) {
        console.error('Error generating PDF Blob:', e);
        return null;
    } finally {
        document.body.removeChild(pdfContainer);
    }
};

export const exportElementAsPDF = async (elementId: string, fileName: string) => {
    const pdfBlob = await generatePdfBlob(elementId);
    if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
};