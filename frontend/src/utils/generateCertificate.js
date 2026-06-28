import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCertificate = async (userName, quizTitle, score, dateString) => {
  // Create a temporary DOM element for the certificate layout
  const certContainer = document.createElement('div');
  certContainer.style.width = '800px';
  certContainer.style.height = '600px';
  certContainer.style.padding = '40px';
  certContainer.style.backgroundColor = '#ffffff';
  certContainer.style.color = '#000000';
  certContainer.style.fontFamily = 'Arial, sans-serif';
  certContainer.style.position = 'absolute';
  certContainer.style.left = '-9999px';
  certContainer.style.top = '-9999px';
  certContainer.style.border = '10px solid #1a1a1a';
  certContainer.style.textAlign = 'center';
  certContainer.style.display = 'flex';
  certContainer.style.flexDirection = 'column';
  certContainer.style.justifyContent = 'center';
  certContainer.style.alignItems = 'center';

  certContainer.innerHTML = `
    <div style="border: 2px solid #e0e0e0; width: 100%; height: 100%; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px;">Certificate of Achievement</h1>
      <p style="font-size: 20px; color: #666; margin-bottom: 10px;">This certifies that</p>
      <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 5px; width: 60%;">${userName}</h2>
      <p style="font-size: 20px; color: #666; margin-bottom: 10px;">has successfully completed the quiz</p>
      <h3 style="font-size: 28px; font-weight: bold; margin-bottom: 20px;">${quizTitle}</h3>
      <p style="font-size: 20px; color: #666; margin-bottom: 30px;">with a score of</p>
      <div style="font-size: 42px; font-weight: bold; background-color: #000; color: #fff; padding: 10px 30px; border-radius: 5px; margin-bottom: 30px;">${score.toFixed(1)}%</div>
      <p style="font-size: 16px; color: #666;">Date: ${dateString}</p>
      <div style="margin-top: 40px; border-top: 1px solid #ccc; width: 40%; padding-top: 10px;">
        <p style="font-size: 14px; font-weight: bold; text-transform: uppercase;">Quizeesphere Platform</p>
      </div>
    </div>
  `;

  document.body.appendChild(certContainer);

  try {
    const canvas = await html2canvas(certContainer, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
    pdf.save(`certificate-${quizTitle.replace(/\s+/g, '-')}.pdf`);
  } catch (err) {
    console.error('Error generating certificate:', err);
  } finally {
    document.body.removeChild(certContainer);
  }
};
