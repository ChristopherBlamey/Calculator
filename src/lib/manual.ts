import { jsPDF } from "jspdf";

export async function downloadManual() {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(233, 30, 140);
  doc.rect(0, 0, 210, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("BLAMEY ERP", 20, 12);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Manual de Usuario V1.3", 20, 20);

  let y = 40;
  doc.setTextColor(60, 60, 60);
  
  const sections = [
    { title: "Introducción", content: "BLAMEY ERP es un sistema de gestión integral para tu negocio de comida." },
    { title: "Navegación", content: "Dashboard → Logística → Evento → Productos → Resultados → Lista → Finanzas → Recetas → Admin Prod." },
    { title: "Logística", content: "Calcula el costo de combustible. Ingresa destino, rendimiento y precio bencina." },
    { title: "Evento", content: "Ciclo: Borrador → Pendiente → Finalizado. Agrega productos y guarda." },
    { title: "Productos", content: "Selecciona cantidad, calcula ingredientes, registra ventas." },
    { title: "Finanzas", content: "Configura el costo de cada ingrediente antes del evento." },
    { title: "Admin Productos", content: "Gestiona productos e ingredientes. Sincroniza recetas base." },
    { title: "WhatsApp", content: "Envía listas de compras directamente a Chris o Fer." },
    { title: "Presupuestos", content: "Genera PDFs profesionales para enviar a clientes." },
    { title: "Contacto", content: "BLAMEY ERP © 2026 - Versión 1.3" }
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  
  for (const section of sections) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setTextColor(233, 30, 140);
    doc.text(section.title, 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(section.content, 170);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 8;
  }

  doc.save("BLAMEY-ERP-Manual.pdf");
}
